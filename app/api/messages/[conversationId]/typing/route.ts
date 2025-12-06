import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

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
    const { isTyping } = await request.json()

    if (isTyping) {
      // Insertar o actualizar indicador de escritura
      await adminSupabase
        .from('direct_typing_indicators')
        .upsert({
          conversation_id: conversationId,
          user_id: user.id,
          is_typing: true,
          updated_at: new Date().toISOString()
        })
    } else {
      // Eliminar indicador cuando deja de escribir
      await adminSupabase
        .from('direct_typing_indicators')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error updating typing indicator:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
