import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener conversaciones donde el usuario es participante
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants!inner(
          user_id,
          last_read_at
        ),
        conversation_messages(
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    // Procesar conversaciones para formato del frontend
    const processedConversations = await Promise.all(
      (conversations || []).map(async (conv) => {
        // Obtener el otro participante (no el usuario actual)
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select(`
            user_id,
            users!inner(id, full_name, avatar_url, role)
          `)
          .eq('conversation_id', conv.id)
          .neq('user_id', user.id)
          .single()

        const otherUser = participants?.users as any

        // Obtener último mensaje
        const { data: lastMessages } = await supabase
          .from('conversation_messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)

        const lastMessage = lastMessages?.[0]

        // Contar mensajes no leídos
        const lastReadAt = conv.conversation_participants.find(
          (p: any) => p.user_id === user.id
        )?.last_read_at

        const { count: unreadCount } = await supabase
          .from('conversation_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', user.id)
          .gt('created_at', lastReadAt || '1970-01-01')

        return {
          id: conv.id,
          name: otherUser?.full_name || 'Usuario',
          avatar: otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.full_name || 'U')}`,
          role: otherUser?.role || 'Usuario',
          lastMessage: lastMessage?.content || 'Sin mensajes',
          timestamp: lastMessage?.created_at || conv.created_at,
          unreadCount: unreadCount || 0,
          isOnline: false, // TODO: implementar status en tiempo real
        }
      })
    )

    return NextResponse.json({ conversations: processedConversations })

  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
