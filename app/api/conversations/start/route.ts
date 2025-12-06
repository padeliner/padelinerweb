import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // Obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('=== CONVERSATION START DEBUG ===')
    console.log('User from auth:', user ? { id: user.id, email: user.email } : 'NULL')
    console.log('User error:', userError)
    
    if (!user) {
      console.error('No user found in session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()
    console.log('Target user ID:', targetUserId)

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
    }

    // Verificar que el usuario objetivo existe
    const { data: targetUser } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', targetUserId)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Buscar si ya existe una conversación entre estos 2 usuarios
    const { data: userConversations } = await supabase
      .from('direct_conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id)

    if (userConversations && userConversations.length > 0) {
      const conversationIds = userConversations.map(c => c.conversation_id)
      
      // Buscar si alguna de esas conversaciones también tiene al target user
      const { data: sharedConversations } = await supabase
        .from('direct_conversation_participants')
        .select('conversation_id')
        .eq('user_id', targetUserId)
        .in('conversation_id', conversationIds)
        .limit(1)

      if (sharedConversations && sharedConversations.length > 0) {
        // Ya existe una conversación
        return NextResponse.json({ 
          conversationId: sharedConversations[0].conversation_id,
          existing: true
        })
      }
    }

    // Crear nueva conversación (usando admin client para bypassear RLS)
    console.log('Attempting to create conversation...')
    console.log('Insert data:', { created_by: user.id })
    
    const { data: newConversation, error: convError } = await adminSupabase
      .from('direct_conversations')
      .insert({
        created_by: user.id
      })
      .select()
      .single()

    console.log('Conversation created:', newConversation)
    console.log('Conversation error:', convError)
    
    if (convError) {
      console.error('FAILED TO CREATE CONVERSATION:', JSON.stringify(convError, null, 2))
      throw convError
    }

    // Añadir participantes (usando admin client)
    const { error: participantsError } = await adminSupabase
      .from('direct_conversation_participants')
      .insert([
        {
          conversation_id: newConversation.id,
          user_id: user.id,
          joined_at: new Date().toISOString()
        },
        {
          conversation_id: newConversation.id,
          user_id: targetUserId,
          joined_at: new Date().toISOString()
        }
      ])

    if (participantsError) throw participantsError

    return NextResponse.json({ 
      conversationId: newConversation.id,
      existing: false
    })

  } catch (error: any) {
    console.error('Error starting conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
