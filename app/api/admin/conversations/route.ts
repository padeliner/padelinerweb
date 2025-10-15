import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/admin/conversations
 * Lista todas las conversaciones con filtros
 * 
 * Query params:
 * - status: new, open, pending, solved, closed
 * - team_id: UUID del equipo
 * - assigned_to: UUID del agente (o 'me', 'unassigned')
 * - priority: low, normal, high, urgent
 * - page: número de página (default 1)
 * - limit: items por página (default 20)
 * - search: búsqueda full-text
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const teamId = searchParams.get('team_id')
    const assignedTo = searchParams.get('assigned_to')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('conversations')
      .select(`
        *,
        team:teams(id, name, slug, color, icon),
        assigned_user:users!conversations_assigned_to_fkey(id, full_name, email, avatar_url),
        message_count:messages(count),
        latest_message:messages(id, content, created_at, is_from_customer)
      `, { count: 'exact' })
      .order('updated_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (teamId) {
      query = query.eq('team_id', teamId)
    }

    if (assignedTo === 'me') {
      query = query.eq('assigned_to', user.id)
    } else if (assignedTo === 'unassigned') {
      query = query.is('assigned_to', null)
    } else if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    if (search) {
      query = query.textSearch('subject', search)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        { error: 'Error fetching conversations', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversations: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/conversations
 * Crear nueva conversación manualmente
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      contact_email,
      contact_name,
      contact_phone,
      subject,
      team_id,
      category,
      priority = 'normal',
      initial_message
    } = body

    // Validate
    if (!contact_email || !subject) {
      return NextResponse.json(
        { error: 'contact_email and subject are required' },
        { status: 400 }
      )
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        contact_email,
        contact_name,
        contact_phone,
        subject,
        team_id,
        category: category || 'general',
        priority,
        source: 'manual',
        status: 'new'
      })
      .select()
      .single()

    if (convError) {
      return NextResponse.json(
        { error: 'Error creating conversation', details: convError.message },
        { status: 500 }
      )
    }

    // Add initial message if provided
    if (initial_message) {
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          from_email: contact_email,
          from_name: contact_name,
          to_email: 'contact@padeliner.com',
          subject,
          content: initial_message,
          is_from_customer: true
        })
    }

    return NextResponse.json({ conversation }, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
