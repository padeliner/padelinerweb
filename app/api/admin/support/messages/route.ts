import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { ticket_id, message, is_internal } = body

    if (!ticket_id || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: ticket_id, message' },
        { status: 400 }
      )
    }

    // Verificar que el ticket existe y el usuario tiene acceso
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado' },
        { status: 404 }
      )
    }

    // Crear mensaje
    const { data: newMessage, error: dbError } = await supabase
      .from('support_messages')
      .insert({
        ticket_id,
        user_id: user.id,
        message,
        is_internal: is_internal || false,
      })
      .select(`
        *,
        user:users(id, full_name, email, avatar_url, role)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear mensaje', details: dbError },
        { status: 500 }
      )
    }

    // Actualizar el ticket para cambiar updated_at
    await supabase
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticket_id)

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
