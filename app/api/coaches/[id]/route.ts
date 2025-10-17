import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const coachId = params.id

    // Obtener datos del entrenador
    const { data: coach, error: coachError } = await supabase
      .from('users')
      .select(`
        *,
        coach_profiles (
          bio,
          specialties,
          experience_years,
          certifications,
          price_per_hour,
          offers_home_service,
          max_travel_distance,
          available_hours,
          city,
          location_formatted,
          country,
          total_students,
          total_sessions_completed,
          average_rating,
          total_reviews,
          profile_visibility,
          show_stats,
          show_reviews
        )
      `)
      .eq('id', coachId)
      .single()

    if (coachError || !coach) {
      return NextResponse.json({ error: 'Entrenador no encontrado' }, { status: 404 })
    }

    // Verificar visibilidad
    const coachProfile = coach.coach_profiles?.[0]
    if (coachProfile?.profile_visibility === 'private') {
      return NextResponse.json({ error: 'Perfil privado' }, { status: 403 })
    }

    // Obtener reseñas si están habilitadas
    let reviews: any[] = []
    if (coachProfile?.show_reviews !== false) {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          positive_tags,
          created_at,
          player:player_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('coach_id', coachId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(10)

      reviews = reviewsData || []
    }

    // Obtener alumnos recientes (si show_stats está habilitado)
    let recentStudents: any[] = []
    if (coachProfile?.show_stats !== false) {
      const { data: studentsData } = await supabase
        .from('training_sessions')
        .select(`
          player:player_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('coach_id', coachId)
        .eq('status', 'completed')
        .order('start_time', { ascending: false })
        .limit(6)

      if (studentsData) {
        // Eliminar duplicados
        const uniqueStudents = Array.from(
          new Map(studentsData.map((s: any) => [s.player.id, s.player])).values()
        )
        recentStudents = uniqueStudents.slice(0, 6)
      }
    }

    return NextResponse.json({
      ...coach,
      coach_profile: coachProfile,
      reviews,
      recent_students: recentStudents
    })

  } catch (error) {
    console.error('Error fetching coach:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos del entrenador' },
      { status: 500 }
    )
  }
}
