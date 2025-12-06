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
    const entityType = searchParams.get('entity_type')

    let query = supabase
      .from('content_reports')
      .select(`
        *,
        reporter:users!content_reports_reporter_id_fkey(id, full_name, email, avatar_url),
        reported_user:users!content_reports_reported_user_id_fkey(id, full_name, email, avatar_url),
        assigned_mod:users!content_reports_assigned_to_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority)
    }

    if (entityType && entityType !== 'all') {
      query = query.eq('reported_entity_type', entityType)
    }

    const { data: reports, error: dbError } = await query

    if (dbError) {
      // Si la tabla no existe
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        return NextResponse.json({
          reports: [],
          note: 'La tabla content_reports no está configurada. Ejecuta la migración primero.',
        })
      }
      return NextResponse.json(
        { error: 'Error al obtener reportes', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({ reports: reports || [] })
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
    const {
      reported_entity_type,
      reported_entity_id,
      reported_user_id,
      reason,
      description,
      priority,
      evidence_urls,
    } = body

    if (!reported_entity_type || !reported_entity_id || !reason || !description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const { data: report, error: dbError } = await supabase
      .from('content_reports')
      .insert({
        reporter_id: user.id,
        reported_entity_type,
        reported_entity_id,
        reported_user_id,
        reason,
        description,
        priority: priority || 'media',
        evidence_urls: evidence_urls || [],
        status: 'pendiente',
      })
      .select(`
        *,
        reporter:users!content_reports_reporter_id_fkey(id, full_name, email, avatar_url),
        reported_user:users!content_reports_reported_user_id_fkey(id, full_name, email, avatar_url)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear reporte', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      report,
      message: 'Reporte creado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
