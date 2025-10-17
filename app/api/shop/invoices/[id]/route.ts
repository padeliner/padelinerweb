import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/shop/invoices/[id]
 * Obtener factura de un pedido
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const invoiceId = params.id

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener factura con detalles del pedido
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        order:orders(
          *,
          items:order_items(*)
        )
      `)
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ invoice })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al obtener factura', message: error.message },
      { status: 500 }
    )
  }
}
