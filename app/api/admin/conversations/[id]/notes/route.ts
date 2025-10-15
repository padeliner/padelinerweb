import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/admin/conversations/:id/notes
 * Obtener notas internas de una conversación
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
      .from('conversation_notes')
      .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
      .eq('conversation_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching notes', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ notes: data })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/conversations/:id/notes
 * Añadir nota interna a conversación
 */
export async function POST(
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
    const { content, is_pinned = false } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const { data: note, error } = await supabase
      .from('conversation_notes')
      .insert({
        conversation_id: params.id,
        user_id: user.id,
        content,
        is_pinned
      })
      .select(`
        *,
        user:users(id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error creating note', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ note }, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
