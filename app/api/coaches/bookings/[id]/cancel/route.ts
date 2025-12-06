import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/coaches/bookings/[id]/cancel - Cancelar una clase (por el entrenador)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

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
        { error: 'Debes proporcionar una razón para cancelar la clase' },
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

    // Verificar que está en estado confirmed
    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Solo se pueden cancelar reservas confirmadas' },
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
        payment_status: 'refunded', // Marcar como reembolsado
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Error al cancelar clase' },
        { status: 500 }
      )
    }

    // TODO: Procesar reembolso COMPLETO en Stripe
    // Cuando el entrenador cancela, SIEMPRE se reembolsa el 100%
    // if (booking.payment_intent_id) {
    //   await stripe.refunds.create({
    //     payment_intent: booking.payment_intent_id,
    //     amount: booking.total_price * 100, // en centavos
    //     reason: 'requested_by_customer'
    //   })
    //
    //   // Actualizar payment_status
    //   await supabase
    //     .from('bookings')
    //     .update({ payment_status: 'refunded' })
    //     .eq('id', id)
    // }

    // Crear notificación para el jugador
    await supabase.from('notifications').insert({
      user_id: booking.player_id,
      type: 'booking_cancelled',
      title: 'Clase cancelada',
      message: `Tu clase del ${new Date(booking.booking_date).toLocaleDateString('es-ES')} ha sido cancelada por el entrenador. Recibirás un reembolso completo. Motivo: ${reason}`,
      related_booking_id: booking.id,
    })

    // TODO: Enviar email al jugador
    // sendEmail({
    //   to: booking.player.email,
    //   subject: 'Clase cancelada - Reembolso procesado',
    //   template: 'booking-cancelled-by-coach',
    //   data: { booking, reason }
    // })

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Clase cancelada. Se procesará el reembolso completo al alumno.',
    })
  } catch (error) {
    console.error('Error in POST /api/coaches/bookings/[id]/cancel:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
