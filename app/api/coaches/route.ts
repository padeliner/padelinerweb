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

    // Obtener entrenadores con datos de usuario
    const { data: coaches, error } = await supabase
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
      .eq('verified', true)

    if (error) {
      console.error('Error fetching coaches:', error)
      return NextResponse.json({ error: 'Error al obtener entrenadores' }, { status: 500 })
    }

    // Filtrar datos
    let filteredCoaches = (coaches || []).filter((coach: any) => coach.user)

    // Filtro de búsqueda
    if (search) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.user?.full_name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtro de especialidad
    if (specialty && specialty !== 'all') {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.specialties?.includes(specialty)
      )
    }

    // Filtro de precio
    if (minPrice !== null) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        parseFloat(coach.price_per_hour) >= minPrice
      )
    }
    if (maxPrice !== null) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        parseFloat(coach.price_per_hour) <= maxPrice
      )
    }

    // Filtro de servicio a domicilio
    if (homeService) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.offers_home_service === true
      )
    }

    // Filtro de ciudad
    if (city) {
      filteredCoaches = filteredCoaches.filter((coach: any) =>
        coach.location_city?.toLowerCase().includes(city.toLowerCase())
      )
    }

    // Ordenar por valoración (mejor primero)
    filteredCoaches.sort((a: any, b: any) => {
      const ratingA = parseFloat(a.rating || '0')
      const ratingB = parseFloat(b.rating || '0')
      return ratingB - ratingA
    })

    // Formatear respuesta
    const formattedCoaches = filteredCoaches.map((coach: any) => ({
      id: coach.user_id,
      full_name: coach.user?.full_name,
      avatar_url: coach.avatar_url || coach.user?.avatar_url,
      email: coach.user?.email,
      role: coach.user?.role,
      created_at: coach.user?.created_at,
      coach_profile: {
        bio: coach.bio,
        specialties: coach.specialties,
        experience_years: coach.experience_years,
        certifications: coach.certifications,
        languages: coach.languages || [],
        price_per_hour: parseFloat(coach.price_per_hour),
        offers_home_service: coach.offers_home_service,
        location: coach.location,
        location_formatted: coach.location_city,
        city: coach.location_city,
        average_rating: parseFloat(coach.rating || '0'),
        total_reviews: coach.reviews_count || 0,
        is_featured: coach.is_featured || false
      },
      images: coach.images || []
    }))

    return NextResponse.json({
      coaches: formattedCoaches,
      total: formattedCoaches.length
    })

  } catch (error) {
    console.error('Error in coaches API:', error)
    return NextResponse.json(
      { error: 'Error al obtener entrenadores' },
      { status: 500 }
    )
  }
}
