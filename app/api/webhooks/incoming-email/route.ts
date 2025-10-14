import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Este webhook recibe emails de Cloudflare Email Routing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Cloudflare envía estos datos
    const {
      from,
      to,
      subject,
      text,
      html,
      headers,
    } = body

    console.log('Email recibido:', { from, to, subject })

    // Guardar en base de datos
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('incoming_emails')
      .insert({
        from_address: from,
        to_address: to[0], // Cloudflare envía array
        subject,
        text_content: text,
        html_content: html,
        headers: headers,
        received_at: new Date().toISOString(),
        is_read: false,
      })

    if (error) {
      console.error('Error guardando email:', error)
      return NextResponse.json({ error: 'Error guardando email' }, { status: 500 })
    }

    // Responder a Cloudflare que se recibió correctamente
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json({ error: 'Error procesando email' }, { status: 500 })
  }
}

// Verificación del webhook (opcional)
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'Webhook activo',
    service: 'Cloudflare Email Routing' 
  })
}
