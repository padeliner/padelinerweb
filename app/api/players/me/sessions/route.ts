import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/me/sessions
 * Obtener sesiones del jugador actual
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // 'upcoming', 'completed', 'cancelled'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Construir query base
    let query = supabase
      .from('sessions')
      .select(`
        *,
        coach:users!sessions_coach_id_fkey(
          id,
          full_name,
          avatar_url,
          email,
          phone
        )
      `, { count: 'exact' })
      .eq('student_id', user.id)

    // Aplicar filtros de estado
    const now = new Date().toISOString()
    
    if (status === 'upcoming') {
      query = query
        .gte('start_time', now)
        .in('status', ['pending', 'confirmed'])
        .order('start_time', { ascending: true })
    } else if (status === 'completed') {
      query = query
        .eq('status', 'completed')
        .order('start_time', { ascending: false })
    } else if (status === 'cancelled') {
      query = query
        .eq('status', 'cancelled')
        .order('start_time', { ascending: false })
    } else {
      // Por defecto, mostrar todas ordenadas por fecha
      query = query.order('start_time', { ascending: false })
    }

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: sessions, error, count } = await query

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json(
        { error: 'Error al obtener sesiones' },
        { status: 500 }
      )
    }

    // Contar por estado para el dashboard
    const { data: statusCounts } = await supabase
      .from('sessions')
      .select('status, start_time')
      .eq('student_id', user.id)

    const counts = {
      upcoming: statusCounts?.filter((s: any) => 
        ['pending', 'confirmed'].includes(s.status) && 
        new Date(s.start_time) >= new Date()
      ).length || 0,
      completed: statusCounts?.filter((s: any) => s.status === 'completed').length || 0,
      cancelled: statusCounts?.filter((s: any) => s.status === 'cancelled').length || 0,
      total: statusCounts?.length || 0
    }

    return NextResponse.json({
      sessions: sessions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      counts
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
