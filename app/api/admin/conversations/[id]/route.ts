import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/admin/conversations/:id
 * Obtener detalle de una conversación
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        team:teams(id, name, slug, color, icon),
        assigned_user:users!conversations_assigned_to_fkey(id, full_name, email, avatar_url),
        messages(
          *,
          read_by_user:users!messages_read_by_fkey(id, full_name)
        ),
        notes:conversation_notes(
          *,
          user:users(id, full_name, avatar_url)
        ),
        activities:conversation_activities(
          *,
          user:users(id, full_name)
        ),
        sla_status:conversation_sla_status(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Conversation not found', details: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ conversation: data })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/conversations/:id
 * Actualizar conversación (estado, asignación, prioridad, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updates: any = {}

    // Solo permitir actualizar ciertos campos
    if (body.status) updates.status = body.status
    if (body.priority) updates.priority = body.priority
    if (body.assigned_to !== undefined) {
      updates.assigned_to = body.assigned_to
      updates.assigned_at = body.assigned_to ? new Date().toISOString() : null
    }
    if (body.tags) updates.tags = body.tags
    if (body.team_id) updates.team_id = body.team_id

    // Actualizar closed_at si se cierra
    if (body.status === 'closed') {
      updates.closed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error updating conversation', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversation: data })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/conversations/:id
 * Archivar conversación (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // En vez de eliminar, marcamos como closed
    const { error } = await supabase
      .from('conversations')
      .update({
        status: 'closed',
        closed_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Error archiving conversation', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
