import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/me/favorites
 * Obtener entrenadores favoritos del jugador
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: favorites, error } = await supabase
      .from('player_favorite_coaches')
      .select(`
        coach_id,
        notes,
        created_at,
        coach:users!player_favorite_coaches_coach_id_fkey(
          id,
          full_name,
          email,
          avatar_url,
          phone
        )
      `)
      .eq('player_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      return NextResponse.json(
        { error: 'Error al obtener favoritos' },
        { status: 500 }
      )
    }

    // Obtener estadísticas de sesiones con cada entrenador
    const favoritesWithStats = await Promise.all(
      (favorites || []).map(async (fav: any) => {
        const { count } = await supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id)
          .eq('coach_id', fav.coach_id)
          .eq('status', 'completed')

        return {
          ...fav,
          sessions_count: count || 0
        }
      })
    )

    return NextResponse.json({ favorites: favoritesWithStats })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
