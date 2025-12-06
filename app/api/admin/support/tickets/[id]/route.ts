import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { status, priority, assigned_to, category } = body

    const updateData: any = {}

    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to
    if (category) updateData.category = category

    // Si se marca como resuelto, guardar timestamp
    if (status === 'resuelto' && !updateData.resolved_at) {
      updateData.resolved_at = new Date().toISOString()
    }

    // Si se marca como cerrado, guardar timestamp
    if (status === 'cerrado' && !updateData.closed_at) {
      updateData.closed_at = new Date().toISOString()
    }

    const { data: ticket, error: dbError } = await supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
        assigned:users!support_tickets_assigned_to_fkey(id, full_name, email)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al actualizar ticket', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket actualizado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
        assigned:users!support_tickets_assigned_to_fkey(id, full_name, email)
      `)
      .eq('id', params.id)
      .single()

    if (ticketError) {
      return NextResponse.json(
        { error: 'Error al obtener ticket', details: ticketError },
        { status: 500 }
      )
    }

    // Obtener mensajes del ticket
    const { data: messages, error: messagesError } = await supabase
      .from('support_messages')
      .select(`
        *,
        user:users(id, full_name, email, avatar_url, role)
      `)
      .eq('ticket_id', params.id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      // Error obteniendo mensajes
    }

    return NextResponse.json({
      ticket,
      messages: messages || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
