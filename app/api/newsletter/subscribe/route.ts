import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source = 'website' } = body

    // Validar email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar si ya está suscrito
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { message: 'Ya estás suscrito a nuestra newsletter' },
          { status: 200 }
        )
      } else {
        // Reactivar suscripción
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            name: name || null,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null
          })
          .eq('id', existing.id)

        if (error) throw error

        return NextResponse.json({
          success: true,
          message: '¡Bienvenido de vuelta! Tu suscripción ha sido reactivada.'
        })
      }
    }

    // Obtener IP y User-Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Crear nueva suscripción
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        source,
        status: 'active',
        confirmed: true, // Auto-confirmar (o puedes enviar email de confirmación)
        ip_address: ip,
        user_agent: userAgent
      })

    if (error) {
      console.error('Error creating subscriber:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.'
    })

  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    )
  }
}

// Endpoint para darse de baja
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Te has dado de baja correctamente'
    })

  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la baja' },
      { status: 500 }
    )
  }
}
