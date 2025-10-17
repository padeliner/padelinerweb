import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/shop/addresses/[id]
 * Actualizar dirección de envío
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const addressId = params.id

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: any = {}

    // Campos actualizables
    if (body.full_name !== undefined) updateData.full_name = body.full_name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.address_line1 !== undefined) updateData.address_line1 = body.address_line1
    if (body.address_line2 !== undefined) updateData.address_line2 = body.address_line2
    if (body.city !== undefined) updateData.city = body.city
    if (body.state !== undefined) updateData.state = body.state
    if (body.postal_code !== undefined) updateData.postal_code = body.postal_code
    if (body.country !== undefined) updateData.country = body.country
    if (body.is_default !== undefined) updateData.is_default = body.is_default
    if (body.is_billing !== undefined) updateData.is_billing = body.is_billing

    // Si se marca como default, desmarcar las anteriores
    if (body.is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', addressId)
    }

    // Actualizar dirección
    const { data: address, error } = await supabase
      .from('shipping_addresses')
      .update(updateData)
      .eq('id', addressId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ address })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar dirección', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/shop/addresses/[id]
 * Eliminar dirección de envío
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const addressId = params.id

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Eliminar dirección
    const { error } = await supabase
      .from('shipping_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar dirección', message: error.message },
      { status: 500 }
    )
  }
}
