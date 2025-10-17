import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/shop/addresses
 * Obtener direcciones de envío del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: addresses, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ addresses })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al obtener direcciones', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/shop/addresses
 * Crear nueva dirección de envío
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = 'España',
      is_default = false,
      is_billing = false
    } = body

    // Validar campos requeridos
    if (!full_name || !phone || !address_line1 || !city || !postal_code) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Si se marca como default, desmarcar las anteriores
    if (is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    // Crear dirección
    const { data: address, error } = await supabase
      .from('shipping_addresses')
      .insert({
        user_id: user.id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default,
        is_billing
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ address }, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error al crear dirección', message: error.message },
      { status: 500 }
    )
  }
}
