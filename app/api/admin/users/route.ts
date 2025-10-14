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
    const role = searchParams.get('role')

    let query = supabase
      .from('users')
      .select('id, full_name, email, role, avatar_url, created_at')
      .order('created_at', { ascending: false })

    if (role) {
      query = query.eq('role', role)
    }

    const { data: users, error: dbError } = await query

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al obtener usuarios', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
