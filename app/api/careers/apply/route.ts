import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fullName, email, phone, position, message, cvFile, fileName } = body

    // Validate required fields
    if (!fullName || !email || !position || !message || !cvFile) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Extract base64 content
    const base64Data = cvFile.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    // Send email to internal team (email address NOT exposed in frontend)
    await resend.emails.send({
      from: 'Recursos Humanos <empleo@send.padeliner.com>',
      to: process.env.CAREERS_EMAIL || 'padeliner@gmail.com',
      subject: `Nueva Solicitud de Empleo: ${position} - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Nueva Solicitud de Empleo</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Información del Candidato</h3>
            <p><strong>Nombre:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
            <p><strong>Puesto de Interés:</strong> ${position}</p>
          </div>

          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Mensaje / Carta de Presentación</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            <strong>Nota:</strong> El currículum está adjunto en este correo.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Enviado desde Padeliner - Sistema de Solicitudes de Empleo
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: buffer,
        },
      ],
    })

    // Send confirmation email to applicant
    await resend.emails.send({
      from: 'Recursos Humanos <empleo@send.padeliner.com>',
      to: email,
      subject: 'Solicitud Recibida - Padeliner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">¡Gracias por tu Interés!</h2>
          
          <p>Hola ${fullName},</p>
          
          <p>Hemos recibido tu solicitud para el puesto de <strong>${position}</strong>.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-left: 4px solid #059669; margin: 20px 0;">
            <p style="margin: 0;"><strong>Estado:</strong> En revisión</p>
            <p style="margin: 10px 0 0 0;">Nuestro equipo revisará tu perfil y nos pondremos en contacto contigo pronto.</p>
          </div>

          <p>Mientras tanto, te invitamos a seguir explorando Padeliner y conocer más sobre nuestra plataforma.</p>

          <p>¡Gracias por considerar formar parte del equipo Padeliner!</p>

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
      message: 'Solicitud enviada correctamente'
    })

  } catch (error: any) {
    console.error('Error sending job application:', error)
    return NextResponse.json(
      { error: 'Error al enviar la solicitud. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
