import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    
    const search = searchParams.get('search') || ''
    const specialty = searchParams.get('specialty')
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null
    const homeService = searchParams.get('homeService') === 'true'
    const city = searchParams.get('city')

    // Construir query
    let query = supabase
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
          city,
          location_formatted,
          country,
          total_students,
          total_sessions_completed,
          average_rating,
          total_reviews,
          profile_visibility
        )
      `)
      .eq('role', 'entrenador')
      .neq('coach_profiles.profile_visibility', 'private')

    // Filtros
    if (search) {
      query = query.ilike('full_name', `%${search}%`)
    }

    // Obtener datos
    const { data: coaches, error } = await query

    if (error) {
      console.error('Error fetching coaches:', error)
      return NextResponse.json({ error: 'Error al obtener entrenadores' }, { status: 500 })
    }

    // Filtrar en el cliente (postprocesamiento)
    let filteredCoaches = coaches || []

    // Filtro de especialidad
    if (specialty && specialty !== 'all') {
      filteredCoaches = filteredCoaches.filter((coach: any) => 
        coach.coach_profiles?.[0]?.specialties?.includes(specialty)
      )
    }

    // Filtro de precio
    if (minPrice !== null) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.coach_profiles?.[0]?.price_per_hour >= minPrice
      )
    }
    if (maxPrice !== null) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.coach_profiles?.[0]?.price_per_hour <= maxPrice
      )
    }

    // Filtro de servicio a domicilio
    if (homeService) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.coach_profiles?.[0]?.offers_home_service === true
      )
    }

    // Filtro de ciudad
    if (city) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.coach_profiles?.[0]?.city?.toLowerCase().includes(city.toLowerCase())
      )
    }

    // Ordenar por valoración (mejor primero)
    filteredCoaches.sort((a: any, b: any) => {
      const ratingA = a.coach_profiles?.[0]?.average_rating || 0
      const ratingB = b.coach_profiles?.[0]?.average_rating || 0
      return ratingB - ratingA
    })

    return NextResponse.json({
      coaches: filteredCoaches.map((coach: any) => ({
        ...coach,
        coach_profile: coach.coach_profiles?.[0] || null
      })),
      total: filteredCoaches.length
    })

  } catch (error) {
    console.error('Error in coaches API:', error)
    return NextResponse.json(
      { error: 'Error al obtener entrenadores' },
      { status: 500 }
    )
  }
}
