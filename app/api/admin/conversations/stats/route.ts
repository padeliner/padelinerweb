import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/admin/conversations/stats
 * Obtener estadísticas generales de conversaciones
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get counts by status
    const { data: statusCounts } = await supabase
      .from('conversations')
      .select('status')
      .then(res => {
        const counts: any = {
          new: 0,
          open: 0,
          pending: 0,
          solved: 0,
          closed: 0,
          total: res.data?.length || 0
        }
        res.data?.forEach((conv: any) => {
          if (counts.hasOwnProperty(conv.status)) {
            counts[conv.status]++
          }
        })
        return { data: counts }
      })

    // Get my conversations
    const { count: myCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_to', user.id)
      .in('status', ['new', 'open', 'pending'])

    // Get unassigned
    const { count: unassignedCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .is('assigned_to', null)
      .in('status', ['new', 'open'])

    // Get counts by priority
    const { data: priorityCounts } = await supabase
      .from('conversations')
      .select('priority')
      .in('status', ['new', 'open', 'pending'])
      .then(res => {
        const counts: any = {
          low: 0,
          normal: 0,
          high: 0,
          urgent: 0
        }
        res.data?.forEach((conv: any) => {
          if (counts.hasOwnProperty(conv.priority)) {
            counts[conv.priority]++
          }
        })
        return { data: counts }
      })

    // Get counts by team
    const { data: teamCounts } = await supabase
      .from('conversations')
      .select('team_id, teams(name, slug)')
      .in('status', ['new', 'open', 'pending'])
      .then(res => {
        const byTeam: any = {}
        res.data?.forEach((conv: any) => {
          const teamSlug = conv.teams?.slug || 'unassigned'
          if (!byTeam[teamSlug]) {
            byTeam[teamSlug] = {
              name: conv.teams?.name || 'Sin asignar',
              count: 0
            }
          }
          byTeam[teamSlug].count++
        })
        return { data: byTeam }
      })

    // Get counts by source
    const { data: sourceCounts } = await supabase
      .from('conversations')
      .select('source')
      .in('status', ['new', 'open', 'pending'])
      .then(res => {
        const counts: any = {
          email: 0,
          chatbot: 0,
          form: 0
        }
        res.data?.forEach((conv: any) => {
          if (counts.hasOwnProperty(conv.source)) {
            counts[conv.source]++
          }
        })
        return { data: counts }
      })

    // Get counts by category (NEW)
    const { data: categoryCounts } = await supabase
      .from('conversations')
      .select('category')
      .eq('source', 'email')
      .in('status', ['new', 'open', 'pending'])
      .then(res => {
        const counts: any = {
          general: 0,
          entrenador: 0,
          club: 0,
          academia: 0,
          tienda: 0,
          soporte: 0,
          colaboracion: 0
        }
        res.data?.forEach((conv: any) => {
          if (counts.hasOwnProperty(conv.category)) {
            counts[conv.category]++
          }
        })
        return { data: counts }
      })

    return NextResponse.json({
      stats: {
        byStatus: statusCounts,
        byPriority: priorityCounts,
        byTeam: teamCounts,
        bySource: sourceCounts,
        byCategory: categoryCounts,
        myConversations: myCount || 0,
        unassigned: unassignedCount || 0
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
