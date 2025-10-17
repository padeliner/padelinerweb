import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/me/notifications
 * Obtener notificaciones del jugador
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('player_notifications')
      .select('*')
      .eq('player_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data: notifications, error } = await query

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json(
        { error: 'Error al obtener notificaciones' },
        { status: 500 }
      )
    }

    // Contar no leídas
    const { count: unreadCount } = await supabase
      .from('player_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', user.id)
      .eq('read', false)

    return NextResponse.json({
      notifications,
      unread_count: unreadCount || 0
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/players/me/notifications
 * Marcar todas como leídas
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { error } = await supabase
      .from('player_notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('player_id', user.id)
      .eq('read', false)

    if (error) {
      console.error('Error marking notifications as read:', error)
      return NextResponse.json(
        { error: 'Error al marcar notificaciones' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
