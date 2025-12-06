import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * PATCH /api/players/me/goals/[id]
 * Actualizar objetivo
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      current_value,
      unit,
      target_date,
      is_public,
      completed
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (target_value !== undefined) updateData.target_value = target_value
    if (current_value !== undefined) updateData.current_value = current_value
    if (unit !== undefined) updateData.unit = unit
    if (target_date !== undefined) updateData.target_date = target_date
    if (is_public !== undefined) updateData.is_public = is_public
    if (completed !== undefined) updateData.completed = completed

    const { data, error } = await supabase
      .from('player_goals')
      .update(updateData)
      .eq('id', params.id)
      .eq('player_id', user.id) // Solo puede actualizar sus propios objetivos
      .select()
      .single()

    if (error) {
      console.error('Error updating goal:', error)
      return NextResponse.json(
        { error: 'Error al actualizar objetivo' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Objetivo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/players/me/goals/[id]
 * Eliminar objetivo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { error } = await supabase
      .from('player_goals')
      .delete()
      .eq('id', params.id)
      .eq('player_id', user.id)

    if (error) {
      console.error('Error deleting goal:', error)
      return NextResponse.json(
        { error: 'Error al eliminar objetivo' },
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
