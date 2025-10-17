import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/bookings/[id] - Obtener detalles de una reserva
export async function GET(
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

    // Obtener reserva con información del jugador
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        player:users!bookings_player_id_fkey (
          id,
          nombre,
          apellido,
          avatar_url,
          email,
          telefono
        )
      `
      )
      .eq('id', id)
      .eq('coach_id', user.id)
      .single()

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Transformar datos
    const bookingWithPlayerInfo = {
      ...booking,
      player_name: booking.player
        ? `${booking.player.nombre} ${booking.player.apellido || ''}`.trim()
        : 'Desconocido',
      player_avatar: booking.player?.avatar_url || null,
      player_email: booking.player?.email || null,
      player_phone: booking.player?.telefono || null,
    }

    return NextResponse.json(bookingWithPlayerInfo)
  } catch (error) {
    console.error('Error in GET /api/coaches/bookings/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH /api/coaches/bookings/[id] - Actualizar una reserva (notas del entrenador)
export async function PATCH(
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
    const { coach_notes } = body

    // Verificar que la reserva pertenece al entrenador
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('coach_id')
      .eq('id', id)
      .single()

    if (checkError || !existingBooking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    if (existingBooking.coach_id !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar esta reserva' },
        { status: 403 }
      )
    }

    // Actualizar notas
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({ coach_notes })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar reserva' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error in PATCH /api/coaches/bookings/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
