import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar que es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Obtener parámetros de filtro
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const level = searchParams.get('level')
    const entityType = searchParams.get('entity_type')
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir query
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (action) query = query.eq('action', action)
    if (level) query = query.eq('level', level)
    if (entityType) query = query.eq('entity_type', entityType)
    if (userId) query = query.eq('user_id', userId)

    const { data: logs, error, count } = await query

    if (error) throw error

    return NextResponse.json({ 
      logs,
      total: count,
      limit,
      offset 
    })

  } catch (error: any) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
