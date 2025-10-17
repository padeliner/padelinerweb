import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/bookings - Obtener todas las reservas del entrenador
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

    // Verificar que el usuario es un entrenador
    const { data: profile } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (!profile || profile.user_type !== 'entrenador') {
      return NextResponse.json(
        { error: 'Solo entrenadores pueden acceder a esta API' },
        { status: 403 }
      )
    }

    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')
    const limit = searchParams.get('limit') || '50'

    // Construir query
    let query = supabase
      .from('bookings')
      .select(
        `
        *,
        player:users!bookings_player_id_fkey (
          id,
          nombre,
          apellido,
          avatar_url,
          email
        )
      `
      )
      .eq('coach_id', user.id)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(parseInt(limit))

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }

    if (fromDate) {
      query = query.gte('booking_date', fromDate)
    }

    if (toDate) {
      query = query.lte('booking_date', toDate)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Error al obtener reservas' },
        { status: 500 }
      )
    }

    // Transformar datos para incluir nombre completo del alumno
    const bookingsWithPlayerInfo = bookings?.map((booking) => ({
      ...booking,
      player_name: booking.player
        ? `${booking.player.nombre} ${booking.player.apellido || ''}`.trim()
        : 'Desconocido',
      player_avatar: booking.player?.avatar_url || null,
      player_email: booking.player?.email || null,
    }))

    return NextResponse.json({
      bookings: bookingsWithPlayerInfo || [],
      count: bookingsWithPlayerInfo?.length || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/bookings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
