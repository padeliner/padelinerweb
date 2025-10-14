import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { emailId, toEmail, subject, content } = body

    // Validate
    if (!emailId || !toEmail || !content) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Send email
    await resend.emails.send({
      from: `${userProfile.full_name} <soporte@padeliner.com>`,
      to: toEmail,
      subject: subject || 'Re: Tu consulta',
      replyTo: 'soporte@padeliner.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Padeliner</h2>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <div style="white-space: pre-wrap; line-height: 1.6;">${content}</div>
          </div>

          <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Este email fue enviado por ${userProfile.full_name}</p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://padeliner.com" style="color: #059669;">www.padeliner.com</a>
            </p>
          </div>
        </div>
      `,
    })

    // Store reply in database
    const { error: replyError } = await supabase
      .from('email_replies')
      .insert({
        incoming_email_id: emailId,
        admin_id: user.id,
        to_email: toEmail,
        subject,
        content
      })

    if (replyError) throw replyError

    // Mark original email as replied
    await supabase
      .from('incoming_emails')
      .update({ replied: true, read: true })
      .eq('id', emailId)

    return NextResponse.json({ 
      success: true,
      message: 'Respuesta enviada correctamente'
    })

  } catch (error: any) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { error: 'Error al enviar respuesta' },
      { status: 500 }
    )
  }
}
