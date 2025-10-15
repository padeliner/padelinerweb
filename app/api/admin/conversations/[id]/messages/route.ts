import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * GET /api/admin/conversations/:id/messages
 * Obtener mensajes de una conversación
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', params.id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching messages', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages: data })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/conversations/:id/messages
 * Enviar respuesta a una conversación
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, is_internal = false, update_status } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Get conversation details
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*, team:teams(name)')
      .eq('id', params.id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const fromEmail = 'no-reply@padeliner.com'
    const fromName = userProfile?.full_name || 'Equipo Padeliner'

    // Si no es nota interna, enviar email real
    let emailSent = false
    if (!is_internal) {
      try {
        console.log('📧 Sending reply email to:', conversation.contact_email)
        
        const result = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: conversation.contact_email,
          subject: `Re: ${conversation.subject}`,
          replyTo: 'contact@padeliner.com',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #059669; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">Padeliner</h2>
                ${conversation.team ? `<p style="margin: 5px 0; font-size: 14px;">${conversation.team.name}</p>` : ''}
              </div>
              
              <div style="padding: 30px; background: #ffffff;">
                <div style="white-space: pre-wrap; line-height: 1.6;">${content}</div>
              </div>

              <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <p style="margin: 0;">Este email es parte de la conversación: ${conversation.subject}</p>
                <p style="margin: 5px 0;">
                  <a href="https://padeliner.com" style="color: #059669;">www.padeliner.com</a>
                </p>
              </div>
            </div>
          `
        })
        
        console.log('✅ Email sent successfully:', result)
        emailSent = true
        
      } catch (emailError: any) {
        console.error('❌ ERROR sending email:', emailError)
        console.error('Error details:', emailError.message)
        console.error('Error stack:', emailError.stack)
        
        // Return error to user so they know
        return NextResponse.json(
          { 
            error: 'Error al enviar email', 
            details: emailError.message,
            message: 'El mensaje se guardó pero no se pudo enviar el email al cliente'
          },
          { status: 500 }
        )
      }
    }

    // Save message in database
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: params.id,
        from_email: fromEmail,
        from_name: fromName,
        to_email: conversation.contact_email,
        subject: `Re: ${conversation.subject}`,
        content,
        type: is_internal ? 'note' : 'message',
        is_internal,
        is_from_customer: false
      })
      .select()
      .single()

    if (messageError) {
      return NextResponse.json(
        { error: 'Error saving message', details: messageError.message },
        { status: 500 }
      )
    }

    // Update conversation status if requested
    if (update_status) {
      await supabase
        .from('conversations')
        .update({ status: update_status })
        .eq('id', params.id)
    }

    // Mark first response if this is the first reply from team
    if (!conversation.first_response_at && !is_internal) {
      await supabase
        .from('conversations')
        .update({ first_response_at: new Date().toISOString() })
        .eq('id', params.id)
    }

    return NextResponse.json({ message }, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
