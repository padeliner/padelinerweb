import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')

    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
        assigned:users!support_tickets_assigned_to_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: tickets, error: dbError } = await query

    if (dbError) {
      // Si la tabla no existe, devolver array vacío en lugar de error
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        return NextResponse.json({
          tickets: [],
          note: 'La tabla support_tickets no está configurada. Ejecuta la migración primero.',
        })
      }
      return NextResponse.json(
        { error: 'Error al obtener tickets', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({ tickets: tickets || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { subject, category, priority, description, user_id } = body

    if (!subject || !category || !description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: subject, category, description' },
        { status: 400 }
      )
    }

    const { data: ticket, error: dbError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user_id || user.id,
        subject,
        category,
        priority: priority || 'media',
        description,
        status: 'abierto',
      })
      .select(`
        *,
        user:users!support_tickets_user_id_fkey(id, full_name, email, avatar_url)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear ticket', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket creado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
