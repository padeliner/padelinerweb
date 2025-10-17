import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/[id]/stats
 * Obtener estadísticas detalladas de un jugador
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const playerId = params.id

    // Verificar configuración de privacidad
    const { data: profile } = await supabase
      .from('player_profiles')
      .select('show_stats, profile_visibility')
      .eq('user_id', playerId)
      .single()

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!profile?.show_stats && currentUser?.id !== playerId) {
      return NextResponse.json(
        { error: 'Estadísticas privadas' },
        { status: 403 }
      )
    }

    if (profile?.profile_visibility === 'private' && currentUser?.id !== playerId) {
      return NextResponse.json(
        { error: 'Perfil privado' },
        { status: 403 }
      )
    }

    // Obtener estadísticas básicas del perfil
    const { data: playerProfile } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('user_id', playerId)
      .single()

    // Obtener sesiones completadas con detalles
    const { data: sessions } = await supabase
      .from('sessions')
      .select(`
        id,
        start_time,
        end_time,
        status,
        coach:users!sessions_coach_id_fkey(id, full_name, avatar_url)
      `)
      .eq('student_id', playerId)
      .eq('status', 'completed')
      .order('start_time', { ascending: false })

    // Calcular estadísticas avanzadas
    const now = new Date()
    const sessionsByMonth: Record<string, number> = {}
    const coachFrequency: Record<string, { count: number; name: string; avatar?: string }> = {}
    
    sessions?.forEach(session => {
      // Sesiones por mes
      const monthKey = new Date(session.start_time).toISOString().slice(0, 7)
      sessionsByMonth[monthKey] = (sessionsByMonth[monthKey] || 0) + 1

      // Frecuencia por entrenador
      if (session.coach?.id) {
        if (!coachFrequency[session.coach.id]) {
          coachFrequency[session.coach.id] = {
            count: 0,
            name: session.coach.full_name || 'Unknown',
            avatar: session.coach.avatar_url
          }
        }
        coachFrequency[session.coach.id].count++
      }
    })

    // Top 5 entrenadores
    const topCoaches = Object.entries(coachFrequency)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([id, data]) => ({
        coach_id: id,
        name: data.name,
        avatar_url: data.avatar,
        sessions_count: data.count
      }))

    // Últimas 6 sesiones por mes
    const recentMonths = Object.entries(sessionsByMonth)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
      .reverse()
      .map(([month, count]) => ({
        month,
        sessions: count
      }))

    return NextResponse.json({
      profile: playerProfile,
      sessions: {
        total: sessions?.length || 0,
        by_month: recentMonths,
        last_session: sessions?.[0] || null
      },
      coaches: {
        total_coaches: Object.keys(coachFrequency).length,
        top_coaches: topCoaches
      }
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
