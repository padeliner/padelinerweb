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
    const { status, priority, assigned_to } = body

    const updateData: any = {}

    if (status) {
      updateData.status = status
      if (status === 'en_revision' && !updateData.reviewed_at) {
        updateData.reviewed_at = new Date().toISOString()
      }
      if (status === 'resuelto' && !updateData.resolved_at) {
        updateData.resolved_at = new Date().toISOString()
      }
    }

    if (priority) updateData.priority = priority
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to

    const { data: report, error: dbError } = await supabase
      .from('content_reports')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        reporter:users!content_reports_reporter_id_fkey(id, full_name, email, avatar_url),
        reported_user:users!content_reports_reported_user_id_fkey(id, full_name, email, avatar_url),
        assigned_mod:users!content_reports_assigned_to_fkey(id, full_name, email)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al actualizar reporte', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      report,
      message: 'Reporte actualizado correctamente',
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

    const { data: report, error: reportError } = await supabase
      .from('content_reports')
      .select(`
        *,
        reporter:users!content_reports_reporter_id_fkey(id, full_name, email, avatar_url),
        reported_user:users!content_reports_reported_user_id_fkey(id, full_name, email, avatar_url),
        assigned_mod:users!content_reports_assigned_to_fkey(id, full_name, email)
      `)
      .eq('id', params.id)
      .single()

    if (reportError) {
      return NextResponse.json(
        { error: 'Error al obtener reporte', details: reportError },
        { status: 500 }
      )
    }

    // Obtener acciones de moderación del reporte
    const { data: actions, error: actionsError } = await supabase
      .from('moderation_actions')
      .select(`
        *,
        moderator:users!moderation_actions_moderator_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('report_id', params.id)
      .order('created_at', { ascending: false })

    if (actionsError) {
      // Error obteniendo acciones
    }

    return NextResponse.json({
      report,
      actions: actions || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
