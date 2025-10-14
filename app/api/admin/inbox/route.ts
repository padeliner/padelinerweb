import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET - List incoming emails
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'all' // all, unread, read
    const category = searchParams.get('category')

    let query = supabase
      .from('incoming_emails')
      .select(`
        *,
        assigned_user:users!assigned_to(full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (filter === 'unread') {
      query = query.eq('read', false)
    } else if (filter === 'read') {
      query = query.eq('read', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ emails: data || [] })

  } catch (error: any) {
    console.error('Error fetching inbox:', error)
    return NextResponse.json(
      { error: 'Error al cargar emails' },
      { status: 500 }
    )
  }
}

// PATCH - Update email (mark as read, assign, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { emailId, updates } = body

    const { data, error } = await supabase
      .from('incoming_emails')
      .update(updates)
      .eq('id', emailId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ email: data })

  } catch (error: any) {
    console.error('Error updating email:', error)
    return NextResponse.json(
      { error: 'Error al actualizar email' },
      { status: 500 }
    )
  }
}
