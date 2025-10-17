import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/coaches/bookings/[id]/complete - Completar una clase
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
    const { coach_notes } = body

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
        { error: 'Solo se pueden completar reservas confirmadas' },
        { status: 400 }
      )
    }

    // Verificar que la fecha ya pasó (opcional, pero recomendado)
    const bookingDate = new Date(booking.booking_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (bookingDate > today) {
      return NextResponse.json(
        { error: 'No puedes completar una clase que aún no ha ocurrido' },
        { status: 400 }
      )
    }

    // Actualizar estado a completed
    const updateData: any = {
      status: 'completed',
    }

    if (coach_notes) {
      updateData.coach_notes = coach_notes
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Error al completar clase' },
        { status: 500 }
      )
    }

    // TODO: Stripe - Liberar el pago (programado para 24h después)
    // En producción, esto debería hacerse con un cron job o webhook
    // que espere 24 horas antes de hacer el capture del payment intent
    // Ejemplo:
    // setTimeout(async () => {
    //   await stripe.paymentIntents.capture(booking.payment_intent_id)
    // }, 24 * 60 * 60 * 1000) // 24 horas
    
    // Por ahora, solo marcamos como completado

    // Crear notificación para el jugador (pidiendo review)
    await supabase.from('notifications').insert({
      user_id: booking.player_id,
      type: 'booking_completed',
      title: 'Clase completada',
      message: `¿Cómo fue tu clase? Deja una valoración para ayudar a otros jugadores`,
      related_booking_id: booking.id,
    })

    // TODO: Enviar email al jugador pidiendo review
    // sendEmail({
    //   to: booking.player.email,
    //   subject: '¿Cómo fue tu clase?',
    //   template: 'request-review',
    //   data: { booking }
    // })

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Clase completada. Recibirás el pago en 24 horas.',
    })
  } catch (error) {
    console.error('Error in POST /api/coaches/bookings/[id]/complete:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
