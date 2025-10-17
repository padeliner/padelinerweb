import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * POST /api/players/favorites/[playerId]
 * Añadir jugador a favoritos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // No permitir que alguien se añada a sí mismo como favorito
    if (user.id === params.playerId) {
      return NextResponse.json(
        { error: 'No puedes añadirte a ti mismo como favorito' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('player_favorite_players')
      .insert({
        user_id: user.id,
        favorite_player_id: params.playerId
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Duplicate key
        return NextResponse.json(
          { error: 'Este jugador ya está en tus favoritos' },
          { status: 400 }
        )
      }
      console.error('Error adding favorite player:', error)
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
 * DELETE /api/players/favorites/[playerId]
 * Eliminar jugador de favoritos
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { error } = await supabase
      .from('player_favorite_players')
      .delete()
      .eq('user_id', user.id)
      .eq('favorite_player_id', params.playerId)

    if (error) {
      console.error('Error removing favorite player:', error)
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

/**
 * GET /api/players/favorites/[playerId]
 * Verificar si un jugador está en favoritos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ isFavorite: false })
    }

    const { data, error } = await supabase
      .from('player_favorite_players')
      .select('*')
      .eq('user_id', user.id)
      .eq('favorite_player_id', params.playerId)
      .maybeSingle()

    if (error) {
      console.error('Error checking favorite:', error)
      return NextResponse.json({ isFavorite: false })
    }

    return NextResponse.json({ isFavorite: !!data })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ isFavorite: false })
  }
}
