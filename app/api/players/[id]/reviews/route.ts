import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/[id]/reviews
 * Obtener reviews de un jugador
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const playerId = params.id
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Verificar que el jugador existe y su configuración de privacidad
    const { data: profile } = await supabase
      .from('player_profiles')
      .select('show_reviews')
      .eq('user_id', playerId)
      .single()

    if (!profile?.show_reviews) {
      return NextResponse.json({
        reviews: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      })
    }

    // Construir query
    let query = supabase
      .from('player_reviews')
      .select(`
        *,
        coach:users!player_reviews_coach_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        session:sessions(
          id,
          start_time,
          service_id
        )
      `, { count: 'exact' })
      .eq('player_id', playerId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    // Paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reviews, error, count } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Error al obtener reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
