import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/[id]
 * Obtener perfil público de un jugador
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const playerId = params.id

    // Obtener perfil del jugador
    const { data: profile, error: profileError } = await supabase
      .from('player_profiles')
      .select(`
        *,
        user:users!player_profiles_user_id_fkey(
          id,
          full_name,
          email,
          avatar_url,
          created_at
        )
      `)
      .eq('user_id', playerId)
      .single()

    if (profileError) {
      // Si no existe perfil, intentar obtener datos básicos del usuario
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url, role, created_at')
        .eq('id', playerId)
        .single()

      if (userError || !user || user.role !== 'alumno') {
        return NextResponse.json(
          { error: 'Jugador no encontrado' },
          { status: 404 }
        )
      }

      // Retornar perfil básico si no tiene perfil extendido
      return NextResponse.json({
        user_id: user.id,
        display_name: user.full_name,
        avatar_url: user.avatar_url,
        profile_visibility: 'public',
        total_sessions_completed: 0,
        total_hours_trained: 0,
        user
      })
    }

    // Verificar visibilidad del perfil
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (profile.profile_visibility === 'private' && currentUser?.id !== playerId) {
      return NextResponse.json(
        { error: 'Perfil privado' },
        { status: 403 }
      )
    }

    if (profile.profile_visibility === 'coaches_only' && currentUser) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single()
      
      if (userData?.role !== 'entrenador' && currentUser.id !== playerId) {
        return NextResponse.json(
          { error: 'Perfil solo visible para entrenadores' },
          { status: 403 }
        )
      }
    }

    // Calcular rating promedio si show_reviews está habilitado
    let averageRating = null
    let totalReviews = 0

    if (profile.show_reviews) {
      const { data: reviews } = await supabase
        .from('player_reviews')
        .select('rating')
        .eq('player_id', playerId)
        .eq('is_public', true)

      if (reviews && reviews.length > 0) {
        totalReviews = reviews.length
        averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      }
    }

    // Contar logros desbloqueados
    const { count: achievementsCount } = await supabase
      .from('player_achievement_unlocks')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', playerId)

    // Obtener entrenadores favoritos (solo si es público)
    let favoriteCoaches = []
    const { data: favorites } = await supabase
      .from('player_favorite_coaches')
      .select(`
        coach_id,
        created_at,
        coach:users!player_favorite_coaches_coach_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('player_id', playerId)
      .limit(3)

    if (favorites) {
      favoriteCoaches = favorites
    }

    // Obtener entrenador con más clases (top coach)
    let topCoach = null
    if (profile.show_coaches) {
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select(`
          coach_id,
          coach:users!sessions_coach_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('student_id', playerId)
        .eq('status', 'completed')

      if (sessionsData && sessionsData.length > 0) {
        // Contar sesiones por entrenador
        const coachCounts: Record<string, any> = {}
        sessionsData.forEach((session: any) => {
          const coachId = session.coach_id
          if (!coachCounts[coachId]) {
            coachCounts[coachId] = {
              coach: session.coach,
              count: 0
            }
          }
          coachCounts[coachId].count++
        })

        // Obtener el top
        const sortedCoaches = Object.values(coachCounts).sort((a: any, b: any) => b.count - a.count)
        if (sortedCoaches.length > 0) {
          topCoach = sortedCoaches[0]
        }
      }
    }

    // Obtener progreso reciente (si es público, últimas 3 notas)
    let recentProgress = []
    const { data: progressData } = await supabase
      .from('player_progress_notes')
      .select(`
        id,
        skill_area,
        rating_before,
        rating_after,
        created_at,
        coach:users!player_progress_notes_coach_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (progressData) {
      recentProgress = progressData
    }

    // Obtener objetivos públicos
    let publicGoals = []
    const { data: goalsData } = await supabase
      .from('player_goals')
      .select('*')
      .eq('player_id', playerId)
      .eq('is_public', true)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(5)

    if (goalsData) {
      publicGoals = goalsData.map((goal: any) => ({
        ...goal,
        progress_percentage: goal.target_value > 0 
          ? Math.round((goal.current_value / goal.target_value) * 100)
          : 0
      }))
    }

    return NextResponse.json({
      ...profile,
      average_rating: averageRating,
      total_reviews: totalReviews,
      achievements_unlocked: achievementsCount || 0,
      favorite_coaches: favoriteCoaches,
      top_coach: topCoach,
      recent_progress: recentProgress,
      public_goals: publicGoals
    })

  } catch (error: any) {
    console.error('Error fetching player profile:', error)
    return NextResponse.json(
      { error: 'Error al obtener perfil', message: error.message },
      { status: 500 }
    )
  }
}
