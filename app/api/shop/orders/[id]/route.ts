import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/shop/orders/[id]
 * Obtener detalles completos de un pedido
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const orderId = params.id

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener pedido con todos los detalles
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        shipping_address:shipping_addresses(*),
        payment_method:payment_methods(*),
        items:order_items(*),
        status_history:order_status_history(
          *,
          changed_by_user:changed_by(full_name)
        ),
        invoice:invoices(*)
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(order)

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedido', message: error.message },
      { status: 500 }
    )
  }
}
