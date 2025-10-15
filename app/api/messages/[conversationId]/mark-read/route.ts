import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.conversationId

    // Marcar todos los mensajes de otros como leídos (usar admin para bypassear RLS)
    const now = new Date().toISOString()
    
    const { error, data } = await adminSupabase
      .from('direct_messages')
      .update({ read_at: now })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null)
      .select()

    console.log('Mensajes marcados como leídos:', data)
    if (error) {
      console.error('Error actualizando read_at:', error)
      throw error
    }

    // Actualizar last_read_at del participante
    await adminSupabase
      .from('direct_conversation_participants')
      .update({ last_read_at: now })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true, markedCount: data?.length || 0 })

  } catch (error: any) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
