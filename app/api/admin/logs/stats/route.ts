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

    // Obtener estadísticas
    const { count: totalLogs } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })

    const { count: errorCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('level', 'error')

    const { count: warningCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('level', 'warning')

    const { count: todayCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString())

    // Top acciones
    const { data: topActions } = await supabase
      .from('audit_logs')
      .select('action')
      .limit(1000)

    const actionCounts: Record<string, number> = {}
    topActions?.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
    })

    const topActionsList = Object.entries(actionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }))

    return NextResponse.json({
      stats: {
        totalLogs: totalLogs || 0,
        errorCount: errorCount || 0,
        warningCount: warningCount || 0,
        todayCount: todayCount || 0,
        topActions: topActionsList
      }
    })

  } catch (error: any) {
    console.error('Error fetching log stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
