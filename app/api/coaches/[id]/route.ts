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
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select(`
        *,
        user:user_id (
          id,
          full_name,
          avatar_url,
          email,
          role,
          created_at
        )
      `)
      .eq('user_id', coachId)
      .eq('verified', true)
      .single()

    if (coachError || !coachData) {
      return NextResponse.json({ error: 'Entrenador no encontrado' }, { status: 404 })
    }

    // Obtener reseñas
    let reviews: any[] = []
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

    // Obtener alumnos recientes
    let recentStudents: any[] = []
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
      .limit(20)

    if (studentsData) {
      // Eliminar duplicados
      const validStudents = studentsData.filter((s: any) => s.player?.id)
      const uniqueStudents = Array.from(
        new Map(validStudents.map((s: any) => [s.player.id, s.player])).values()
      )
      recentStudents = uniqueStudents.slice(0, 6)
    }

    // Formatear respuesta
    return NextResponse.json({
      id: coachData.user_id,
      full_name: coachData.user?.full_name,
      avatar_url: coachData.avatar_url || coachData.user?.avatar_url,
      email: coachData.user?.email,
      role: coachData.user?.role,
      created_at: coachData.user?.created_at,
      coach_profile: {
        bio: coachData.bio,
        specialties: coachData.specialties || [],
        experience_years: coachData.experience_years,
        certifications: coachData.certifications || [],
        languages: coachData.languages || [],
        price_per_hour: parseFloat(coachData.price_per_hour),
        offers_home_service: coachData.offers_home_service,
        available_hours: coachData.availability,
        city: coachData.location_city,
        location: coachData.location,
        location_formatted: coachData.location_city,
        total_students: 0, // Podemos calcularlo después
        total_sessions_completed: 0, // Podemos calcularlo después
        average_rating: parseFloat(coachData.rating || '0'),
        total_reviews: coachData.reviews_count || 0,
        show_stats: true,
        show_reviews: true,
        is_featured: coachData.is_featured || false
      },
      images: coachData.images || [],
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
