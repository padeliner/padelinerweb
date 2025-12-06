import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { from, to, subject, html, replyTo } = body

    if (!from || !to || !subject || !html) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: from, to, subject, html' },
        { status: 400 }
      )
    }

    // Limpiar y validar emails destinatarios
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const toArray = Array.isArray(to) ? to : [to]
    const cleanedEmails = toArray
      .map((email) => email.trim())
      .filter((email) => email && emailRegex.test(email))

    if (cleanedEmails.length === 0) {
      return NextResponse.json(
        { error: 'No hay emails válidos en el campo "to"' },
        { status: 400 }
      )
    }

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: `Padeliner <${from}>`,
      to: cleanedEmails,
      subject,
      html,
      replyTo: replyTo || 'soporte@padeliner.com',
    })

    if (error) {
      return NextResponse.json(
        { error: 'Error al enviar el email', details: error },
        { status: 500 }
      )
    }

    // Intentar guardar registro del email enviado en la base de datos
    try {
      const { error: dbError } = await supabase
        .from('admin_emails')
        .insert({
          email_id: data?.id,
          from_user_id: user.id,
          to_addresses: cleanedEmails,
          subject,
          html_content: html,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

      if (dbError) {
        // No se pudo guardar en DB (tabla no existe)
      }
    } catch (dbErr) {
      // Error guardando email en DB - no retornamos error porque el email sí se envió
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      message: 'Email enviado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
