import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/me/goals
 * Obtener objetivos del jugador
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const includeCompleted = searchParams.get('completed') === 'true'

    let query = supabase
      .from('player_goals')
      .select('*')
      .eq('player_id', user.id)

    if (!includeCompleted) {
      query = query.eq('completed', false)
    }

    query = query.order('completed').order('target_date', { ascending: true })

    const { data: goals, error } = await query

    if (error) {
      console.error('Error fetching goals:', error)
      return NextResponse.json(
        { error: 'Error al obtener objetivos' },
        { status: 500 }
      )
    }

    // Añadir porcentaje de progreso
    const goalsWithProgress = goals?.map((goal: any) => ({
      ...goal,
      progress_percentage: goal.target_value > 0 
        ? Math.round((goal.current_value / goal.target_value) * 100)
        : 0
    }))

    // Estadísticas
    const stats = {
      total: goals?.length || 0,
      active: goals?.filter((g: any) => !g.completed).length || 0,
      completed: goals?.filter((g: any) => g.completed).length || 0
    }

    return NextResponse.json({
      goals: goalsWithProgress,
      stats
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/players/me/goals
 * Crear nuevo objetivo
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      target_value,
      unit,
      target_date,
      is_public
    } = body

    if (!title || !target_value || !unit) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('player_goals')
      .insert({
        player_id: user.id,
        title,
        description,
        category,
        target_value,
        unit,
        target_date,
        is_public: is_public || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      return NextResponse.json(
        { error: 'Error al crear objetivo' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
