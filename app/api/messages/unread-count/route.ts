import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener conversaciones del usuario
    const { data: userConversations } = await supabase
      .from('direct_conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', user.id)

    if (!userConversations || userConversations.length === 0) {
      return NextResponse.json({ unreadCount: 0 })
    }

    const conversationIds = userConversations.map(c => c.conversation_id)

    // Contar mensajes no leídos en todas las conversaciones
    let totalUnread = 0

    for (const conv of userConversations) {
      const lastReadAt = conv.last_read_at || '1970-01-01'
      
      const { count } = await supabase
        .from('direct_messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.conversation_id)
        .neq('sender_id', user.id) // Solo mensajes de otros
        .gt('created_at', lastReadAt)

      totalUnread += count || 0
    }

    return NextResponse.json({ unreadCount: totalUnread })

  } catch (error: any) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
