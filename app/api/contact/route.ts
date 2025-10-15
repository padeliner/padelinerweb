import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const SUBJECT_LABELS: Record<string, string> = {
  general: 'Consulta General',
  entrenador: 'Información sobre Entrenadores',
  club: 'Información sobre Clubes',
  academia: 'Información sobre Academias',
  tienda: 'Consulta sobre Tienda',
  soporte: 'Soporte Técnico',
  colaboracion: 'Propuesta de Colaboración',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const subjectLabel = SUBJECT_LABELS[subject] || subject

    // Send email to internal team (will be captured by Cloudflare Worker)
    await resend.emails.send({
      from: 'Formulario de Contacto <contacto@send.padeliner.com>',
      to: 'contact@padeliner.com', // Cloudflare Email Routing → Worker → Supabase + Gmail
      subject: `[Contacto Web] ${subjectLabel} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Nuevo Mensaje de Contacto</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Información del Contacto</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
            <p><strong>Asunto:</strong> ${subjectLabel}</p>
          </div>

          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Mensaje</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Enviado desde Padeliner - Formulario de Contacto
          </p>
        </div>
      `,
      replyTo: email,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'Soporte <soporte@send.padeliner.com>',
      to: email,
      subject: 'Hemos recibido tu mensaje - Padeliner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">¡Gracias por Contactarnos!</h2>
          
          <p>Hola ${name},</p>
          
          <p>Hemos recibido tu mensaje sobre <strong>${subjectLabel}</strong>.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #059669; margin: 20px 0;">
            <p style="margin: 0;"><strong>Tu mensaje:</strong></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p>Nuestro equipo revisará tu consulta y te responderemos lo antes posible, generalmente en menos de 24 horas.</p>

          <p>Si tu consulta es urgente, también puedes contactarnos por teléfono al <strong>+34 900 123 456</strong>.</p>

          <p>¡Gracias por confiar en Padeliner!</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Equipo Padeliner<br />
            <a href="https://padeliner.com" style="color: #059669;">www.padeliner.com</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente'
    })

  } catch (error: any) {
    console.error('Error sending contact form:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
