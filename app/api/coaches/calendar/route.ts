import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/calendar - Obtener vista de calendario
export async function GET(request: NextRequest) {
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

    // Obtener parámetros
    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')
    const view = searchParams.get('view') || 'week'

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: 'from_date y to_date son obligatorios' },
        { status: 400 }
      )
    }

    // Obtener reservas en el rango de fechas
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        player:users!bookings_player_id_fkey (
          id,
          nombre,
          apellido,
          avatar_url
        )
      `
      )
      .eq('coach_id', user.id)
      .gte('booking_date', fromDate)
      .lte('booking_date', toDate)
      .in('status', ['pending', 'confirmed', 'completed'])
      .order('booking_date')
      .order('start_time')

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Error al obtener reservas' },
        { status: 500 }
      )
    }

    // Obtener fechas bloqueadas en el rango
    const { data: blockedDates, error: blockedError } = await supabase
      .from('coach_blocked_dates')
      .select('*')
      .eq('coach_id', user.id)
      .gte('blocked_date', fromDate)
      .lte('blocked_date', toDate)

    if (blockedError) {
      console.error('Error fetching blocked dates:', blockedError)
      return NextResponse.json(
        { error: 'Error al obtener fechas bloqueadas' },
        { status: 500 }
      )
    }

    // Transformar datos para el calendario
    const events = []

    // Añadir bookings como eventos
    bookings?.forEach((booking) => {
      const playerName = booking.player
        ? `${booking.player.nombre} ${booking.player.apellido || ''}`.trim()
        : 'Desconocido'

      events.push({
        id: booking.id,
        type: 'booking',
        title: playerName,
        date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        class_type: booking.class_type,
        participants: booking.participants,
        player_avatar: booking.player?.avatar_url,
        location: booking.location_address,
      })
    })

    // Añadir fechas bloqueadas como eventos
    blockedDates?.forEach((blocked) => {
      events.push({
        id: blocked.id,
        type: 'blocked',
        title: blocked.reason || 'Bloqueado',
        date: blocked.blocked_date,
        start_time: blocked.start_time || '00:00',
        end_time: blocked.end_time || '23:59',
        all_day: !blocked.start_time,
      })
    })

    // Organizar por fecha para facilitar el renderizado
    const eventsByDate: { [key: string]: any[] } = {}
    events.forEach((event) => {
      const dateKey = event.date
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = []
      }
      eventsByDate[dateKey].push(event)
    })

    return NextResponse.json({
      events,
      events_by_date: eventsByDate,
      view,
      from_date: fromDate,
      to_date: toDate,
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/calendar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
