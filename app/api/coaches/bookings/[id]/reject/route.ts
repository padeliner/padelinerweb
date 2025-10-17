import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/coaches/bookings/[id]/reject - Rechazar una reserva
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { reason } = body

    if (!reason || reason.trim() === '') {
      return NextResponse.json(
        { error: 'Debes proporcionar una razón para rechazar la reserva' },
        { status: 400 }
      )
    }

    // Verificar que la reserva existe y pertenece al entrenador
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, player:users!bookings_player_id_fkey(nombre, apellido, email)')
      .eq('id', id)
      .eq('coach_id', user.id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que está en estado pending
    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: 'Solo se pueden rechazar reservas pendientes' },
        { status: 400 }
      )
    }

    // Actualizar estado a cancelled
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        cancellation_reason: reason,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Error al rechazar reserva' },
        { status: 500 }
      )
    }

    // TODO: Procesar reembolso en Stripe
    // if (booking.payment_intent_id) {
    //   await stripe.refunds.create({
    //     payment_intent: booking.payment_intent_id,
    //     reason: 'requested_by_customer'
    //   })
    // }

    // Crear notificación para el jugador
    await supabase.from('notifications').insert({
      user_id: booking.player_id,
      type: 'booking_cancelled',
      title: 'Reserva rechazada',
      message: `Tu solicitud de clase del ${new Date(booking.booking_date).toLocaleDateString('es-ES')} ha sido rechazada. Motivo: ${reason}`,
      related_booking_id: booking.id,
    })

    // TODO: Enviar email al jugador
    // sendEmail({
    //   to: booking.player.email,
    //   subject: 'Reserva rechazada',
    //   template: 'booking-rejected',
    //   data: { booking, reason }
    // })

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Reserva rechazada. Se procesará el reembolso automáticamente.',
    })
  } catch (error) {
    console.error('Error in POST /api/coaches/bookings/[id]/reject:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
