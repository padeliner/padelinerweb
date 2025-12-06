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

    const { messageId } = await request.json()

    if (!messageId) {
      return NextResponse.json({ error: 'messageId required' }, { status: 400 })
    }

    // Marcar mensaje como entregado (usar admin para bypassear RLS)
    const now = new Date().toISOString()
    
    const { error } = await adminSupabase
      .from('direct_messages')
      .update({ delivered_at: now })
      .eq('id', messageId)
      .is('delivered_at', null)

    if (error) {
      console.error('Error marking as delivered:', error)
      throw error
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error marking message as delivered:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
