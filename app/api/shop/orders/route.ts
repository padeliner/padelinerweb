import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/shop/orders
 * Obtener lista de pedidos del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // pending, paid, shipped, delivered, cancelled
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir query
    let query = supabase
      .from('orders')
      .select(`
        *,
        shipping_address:shipping_addresses(*),
        items:order_items(
          *,
          product_snapshot
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por estado si se especifica
    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error, count } = await query

    if (error) throw error

    // Calcular estadísticas
    const { data: stats } = await supabase
      .from('orders')
      .select('status, total')
      .eq('user_id', user.id)

    const statistics = {
      total_orders: count || 0,
      total_spent: stats?.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) || 0,
      by_status: {
        pending: stats?.filter(o => o.status === 'pending').length || 0,
        paid: stats?.filter(o => o.status === 'paid').length || 0,
        processing: stats?.filter(o => o.status === 'processing').length || 0,
        shipped: stats?.filter(o => o.status === 'shipped').length || 0,
        delivered: stats?.filter(o => o.status === 'delivered').length || 0,
        cancelled: stats?.filter(o => o.status === 'cancelled').length || 0,
      }
    }

    return NextResponse.json({
      orders,
      pagination: {
        total: count,
        limit,
        offset,
        has_more: (offset + limit) < (count || 0)
      },
      statistics
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos', message: error.message },
      { status: 500 }
    )
  }
}
