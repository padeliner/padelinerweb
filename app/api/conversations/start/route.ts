import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()

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
    // Primero obtener conversaciones del usuario actual
    const { data: userConversations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id)

    if (userConversations && userConversations.length > 0) {
      const conversationIds = userConversations.map(c => c.conversation_id)
      
      // Buscar si alguna de esas conversaciones también tiene al target user
      const { data: sharedConversations } = await supabase
        .from('conversation_participants')
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

    // Crear nueva conversación
    const { data: newConversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        created_by: user.id
      })
      .select()
      .single()

    if (convError) throw convError

    // Añadir participantes
    const { error: participantsError } = await supabase
      .from('conversation_participants')
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
