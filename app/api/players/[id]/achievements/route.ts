import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/[id]/achievements
 * Obtener logros desbloqueados de un jugador
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const playerId = params.id

    // Verificar que el perfil es público
    const { data: profile } = await supabase
      .from('player_profiles')
      .select('profile_visibility')
      .eq('user_id', playerId)
      .single()

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Verificar permisos según visibilidad
    if (profile && profile.profile_visibility === 'private' && currentUser?.id !== playerId) {
      return NextResponse.json(
        { error: 'Perfil privado' },
        { status: 403 }
      )
    }

    // Obtener logros desbloqueados
    const { data: unlockedAchievements, error } = await supabase
      .from('player_achievement_unlocks')
      .select(`
        id,
        unlocked_at,
        achievement:player_achievements(
          id,
          code,
          name,
          description,
          icon,
          category,
          requirement_type,
          requirement_value
        )
      `)
      .eq('player_id', playerId)
      .order('unlocked_at', { ascending: false })

    if (error) {
      console.error('Error fetching achievements:', error)
      return NextResponse.json(
        { error: 'Error al obtener logros' },
        { status: 500 }
      )
    }

    // Obtener todos los logros disponibles para mostrar progreso
    const { data: allAchievements } = await supabase
      .from('player_achievements')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    // Identificar logros desbloqueados
    const unlockedIds = new Set(
      unlockedAchievements?.map(ua => ua.achievement?.id).filter(Boolean) || []
    )

    // Separar en desbloqueados y pendientes
    const unlocked = unlockedAchievements || []
    const locked = allAchievements?.filter(a => !unlockedIds.has(a.id)) || []

    return NextResponse.json({
      unlocked,
      locked,
      total: allAchievements?.length || 0,
      unlocked_count: unlocked.length,
      completion_percentage: allAchievements?.length 
        ? Math.round((unlocked.length / allAchievements.length) * 100)
        : 0
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
