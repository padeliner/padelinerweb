import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/coaches/bookings/[id]/confirm - Confirmar una reserva
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
        { error: 'Solo se pueden confirmar reservas pendientes' },
        { status: 400 }
      )
    }

    // Actualizar estado a confirmed
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Error al confirmar reserva' },
        { status: 500 }
      )
    }

    // Crear notificación para el jugador
    await supabase.from('notifications').insert({
      user_id: booking.player_id,
      type: 'booking_confirmed',
      title: 'Clase confirmada',
      message: `Tu clase del ${new Date(booking.booking_date).toLocaleDateString('es-ES')} a las ${booking.start_time} ha sido confirmada`,
      related_booking_id: booking.id,
    })

    // TODO: Enviar email al jugador (integración con Resend/SendGrid)
    // sendEmail({
    //   to: booking.player.email,
    //   subject: 'Clase confirmada',
    //   template: 'booking-confirmed',
    //   data: { booking }
    // })

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Reserva confirmada exitosamente',
    })
  } catch (error) {
    console.error('Error in POST /api/coaches/bookings/[id]/confirm:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
