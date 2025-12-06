import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
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
    const {
      report_id,
      action_type,
      target_entity_type,
      target_entity_id,
      reason,
      notes,
      duration_days,
    } = body

    if (!action_type || !target_entity_type || !target_entity_id || !reason) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Crear acción de moderación
    const { data: action, error: actionError } = await supabase
      .from('moderation_actions')
      .insert({
        report_id,
        moderator_id: user.id,
        action_type,
        target_entity_type,
        target_entity_id,
        reason,
        notes,
        duration_days,
      })
      .select(`
        *,
        moderator:users!moderation_actions_moderator_id_fkey(id, full_name, email, avatar_url)
      `)
      .single()

    if (actionError) {
      return NextResponse.json(
        { error: 'Error al crear acción', details: actionError },
        { status: 500 }
      )
    }

    // Si es suspensión de usuario, crear registro en user_suspensions
    if (action_type === 'suspender_usuario') {
      const expiresAt = duration_days
        ? new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000).toISOString()
        : null

      await supabase.from('user_suspensions').insert({
        user_id: target_entity_id,
        moderator_id: user.id,
        reason,
        notes,
        expires_at: expiresAt,
        is_active: true,
      })
    }

    // Si es desuspensión, marcar suspensiones como inactivas
    if (action_type === 'desuspender_usuario') {
      await supabase
        .from('user_suspensions')
        .update({
          is_active: false,
          lifted_at: new Date().toISOString(),
          lifted_by: user.id,
        })
        .eq('user_id', target_entity_id)
        .eq('is_active', true)
    }

    return NextResponse.json({
      success: true,
      action,
      message: 'Acción de moderación creada correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
