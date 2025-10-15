import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.conversationId

    // Verificar que el usuario es participante de la conversación
    const { data: participant } = await supabase
      .from('direct_conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Obtener mensajes
    const { data: messages, error } = await supabase
      .from('direct_messages')
      .select(`
        *,
        sender:users!sender_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Marcar mensajes como leídos
    await supabase
      .from('direct_conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)

    return NextResponse.json({ messages: messages || [] })

  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Enviar nuevo mensaje
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.conversationId
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Verificar que el usuario es participante
    const { data: participant } = await supabase
      .from('direct_conversation_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Insertar mensaje
    const { data: message, error } = await supabase
      .from('direct_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim()
      })
      .select(`
        *,
        sender:users!sender_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error

    // Actualizar timestamp de la conversación
    await supabase
      .from('direct_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return NextResponse.json({ message })

  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
