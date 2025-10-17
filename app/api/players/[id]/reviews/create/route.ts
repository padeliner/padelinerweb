import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * POST /api/players/[id]/reviews/create
 * Crear review de un jugador (solo entrenadores)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const playerId = params.id

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar que es entrenador
    const { data: coachData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (coachData?.role !== 'entrenador') {
      return NextResponse.json(
        { error: 'Solo entrenadores pueden dejar reviews' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      session_id,
      rating,
      comment,
      punctuality_rating,
      attitude_rating,
      commitment_rating,
      positive_tags,
      is_public = true
    } = body

    // Validar campos requeridos
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating debe estar entre 1 y 5' },
        { status: 400 }
      )
    }

    // Verificar que la sesión existe y está completada
    if (session_id) {
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', session_id)
        .eq('coach_id', user.id)
        .eq('student_id', playerId)
        .single()

      if (sessionError || !session) {
        return NextResponse.json(
          { error: 'Sesión no encontrada o no tienes permiso' },
          { status: 404 }
        )
      }

      if (session.status !== 'completed') {
        return NextResponse.json(
          { error: 'Solo puedes dejar review de sesiones completadas' },
          { status: 400 }
        )
      }

      // Verificar que no existe ya una review para esta sesión
      const { data: existingReview } = await supabase
        .from('player_reviews')
        .select('id')
        .eq('session_id', session_id)
        .eq('coach_id', user.id)
        .single()

      if (existingReview) {
        return NextResponse.json(
          { error: 'Ya dejaste una review para esta sesión' },
          { status: 400 }
        )
      }
    }

    // Crear review
    const { data: review, error } = await supabase
      .from('player_reviews')
      .insert({
        player_id: playerId,
        coach_id: user.id,
        session_id: session_id || null,
        rating,
        comment,
        punctuality_rating,
        attitude_rating,
        commitment_rating,
        positive_tags: positive_tags || [],
        is_public
      })
      .select(`
        *,
        coach:users!player_reviews_coach_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json(
        { error: 'Error al crear review', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(review, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
