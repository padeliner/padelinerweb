import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * POST /api/players/me/favorites/[coachId]
 * Añadir entrenador a favoritos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { coachId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { notes } = body

    const { data, error } = await supabase
      .from('player_favorite_coaches')
      .insert({
        player_id: user.id,
        coach_id: params.coachId,
        notes: notes || null
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Duplicate key
        return NextResponse.json(
          { error: 'Este entrenador ya está en tus favoritos' },
          { status: 400 }
        )
      }
      console.error('Error adding favorite:', error)
      return NextResponse.json(
        { error: 'Error al añadir favorito' },
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

/**
 * DELETE /api/players/me/favorites/[coachId]
 * Eliminar entrenador de favoritos
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { coachId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { error } = await supabase
      .from('player_favorite_coaches')
      .delete()
      .eq('player_id', user.id)
      .eq('coach_id', params.coachId)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json(
        { error: 'Error al eliminar favorito' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
