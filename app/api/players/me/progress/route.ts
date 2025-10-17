import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/me/progress
 * Obtener historial de progreso del jugador
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const skillArea = searchParams.get('skill_area') // Filtrar por área específica

    let query = supabase
      .from('player_progress_notes')
      .select(`
        *,
        coach:users!player_progress_notes_coach_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        session:sessions(
          id,
          start_time
        )
      `)
      .eq('player_id', user.id)
      .order('created_at', { ascending: false })

    if (skillArea) {
      query = query.eq('skill_area', skillArea)
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json(
        { error: 'Error al obtener progreso' },
        { status: 500 }
      )
    }

    // Agrupar por área de habilidad para estadísticas
    const progressBySkill: Record<string, any> = {}
    
    progress?.forEach((note: any) => {
      if (!progressBySkill[note.skill_area]) {
        progressBySkill[note.skill_area] = {
          skill_area: note.skill_area,
          notes_count: 0,
          avg_rating_before: 0,
          avg_rating_after: 0,
          improvement: 0,
          latest_note: null
        }
      }
      
      const area = progressBySkill[note.skill_area]
      area.notes_count++
      area.avg_rating_before += note.rating_before || 0
      area.avg_rating_after += note.rating_after || 0
      
      if (!area.latest_note || new Date(note.created_at) > new Date(area.latest_note.created_at)) {
        area.latest_note = note
      }
    })

    // Calcular promedios
    Object.values(progressBySkill).forEach((area: any) => {
      area.avg_rating_before = (area.avg_rating_before / area.notes_count).toFixed(1)
      area.avg_rating_after = (area.avg_rating_after / area.notes_count).toFixed(1)
      area.improvement = (area.avg_rating_after - area.avg_rating_before).toFixed(1)
    })

    return NextResponse.json({
      progress,
      summary: Object.values(progressBySkill)
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
