import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const coachId = params.id

    // Obtener datos del entrenador
    const { data: coach, error } = await supabase
      .from('coaches')
      .select(`
        *,
        user:users!coaches_user_id_fkey (
          id,
          full_name,
          email,
          avatar_url,
          created_at
        )
      `)
      .eq('user_id', coachId)
      .single()

    if (error || !coach) {
      return NextResponse.json(
        { error: 'Entrenador no encontrado' },
        { status: 404 }
      )
    }

    // Formatear disponibilidad
    let formattedAvailability: string[] = []
    if (coach.availability && typeof coach.availability === 'object') {
      const days: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      }

      Object.entries(coach.availability).forEach(([day, hours]) => {
        if (Array.isArray(hours) && hours.length > 0) {
          const dayName = days[day as keyof typeof days] || day
          formattedAvailability.push(`${dayName}: ${hours.join(', ')}`)
        }
      })
    }

    // Construir respuesta
    const response = {
      user_id: coach.user_id,
      full_name: coach.user?.full_name || 'Entrenador',
      email: coach.user?.email,
      avatar_url: coach.avatar_url || coach.user?.avatar_url,
      bio: coach.bio,
      experience_years: coach.experience_years || 0,
      certifications: coach.certifications || [],
      languages: coach.languages || [],
      specialties: coach.specialties || [],
      rating: parseFloat(coach.rating || '0'),
      reviews_count: coach.reviews_count || 0,
      price_per_hour: parseFloat(coach.price_per_hour || '0'),
      location: coach.location || '',
      location_city: coach.location_city || '',
      location_lat: parseFloat(coach.location_lat || '0'),
      location_lng: parseFloat(coach.location_lng || '0'),
      offers_home_service: coach.offers_home_service || false,
      is_featured: coach.is_featured || false,
      images: coach.images || [],
      availability: formattedAvailability,
      verified: coach.verified || false,
      verification_status: coach.verification_status,
      created_at: coach.user?.created_at
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching coach:', error)
    return NextResponse.json(
      { error: 'Error al cargar datos del entrenador' },
      { status: 500 }
    )
  }
}
