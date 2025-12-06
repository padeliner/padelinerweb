import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parámetros de búsqueda
    const city = searchParams.get('city')
    const specialty = searchParams.get('specialty')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const homeService = searchParams.get('homeService')
    const featured = searchParams.get('featured')

    // Construir query
    let query = supabase
      .from('coaches')
      .select(`
        *,
        user:users!coaches_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('verified', true)

    // Filtros
    if (city) {
      query = query.ilike('location_city', `%${city}%`)
    }

    if (specialty && specialty !== 'all') {
      query = query.contains('specialties', [specialty])
    }

    if (minPrice) {
      query = query.gte('price_per_hour', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price_per_hour', parseFloat(maxPrice))
    }

    if (homeService === 'true') {
      query = query.eq('offers_home_service', true)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data: coaches, error } = await query.order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching coaches:', error)
      return NextResponse.json(
        { error: 'Error al cargar entrenadores' },
        { status: 500 }
      )
    }

    // Formatear respuesta
    const formattedCoaches = coaches.map(coach => ({
      id: coach.user_id,
      name: coach.user?.full_name || 'Entrenador',
      specialties: coach.specialties || [],
      experience: coach.experience_years || 0,
      rating: parseFloat(coach.rating || '0'),
      reviewsCount: coach.reviews_count || 0,
      pricePerHour: parseFloat(coach.price_per_hour || '0'),
      location: coach.location || '',
      city: coach.location_city || '',
      lat: parseFloat(coach.location_lat || '0'),
      lng: parseFloat(coach.location_lng || '0'),
      imageUrl: coach.avatar_url || coach.user?.avatar_url || '',
      isFeatured: coach.is_featured || false,
      offersHomeService: coach.offers_home_service || false,
      userId: coach.user_id
    }))

    return NextResponse.json(formattedCoaches)
  } catch (error) {
    console.error('Error fetching coaches:', error)
    return NextResponse.json(
      { error: 'Error al cargar entrenadores' },
      { status: 500 }
    )
  }
}
