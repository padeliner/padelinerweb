import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (security)
    const webhookSecret = request.headers.get('x-webhook-secret')
    
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      console.error('Invalid webhook secret')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Incoming email webhook received:', { from: body.from, to: body.to, subject: body.subject })
    
    // Handle both Cloudflare Worker and Resend formats
    const {
      from,
      to,
      subject,
      text,
      html,
      headers,
      ...rest
    } = body

    // Parse from email
    const fromMatch = from?.match(/<(.+)>/) || from?.match(/(.+)/)
    const fromEmail = fromMatch ? fromMatch[1] : from
    const fromName = from?.replace(/<.+>/, '').trim() || null

    // Determine category based on recipient
    let category = 'general'
    const toEmail = typeof to === 'string' ? to : to?.[0] || 'unknown'
    
    if (toEmail.includes('contact@')) category = 'contact'
    if (toEmail.includes('soporte@')) category = 'support'
    if (toEmail.includes('hola@')) category = 'contact'
    if (toEmail.includes('ventas@')) category = 'sales'
    if (toEmail.includes('info@')) category = 'info'
    if (toEmail.includes('empleo@')) category = 'careers'

    // Store in database
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('incoming_emails')
      .insert({
        from_email: fromEmail,
        from_name: fromName,
        to_email: to,
        subject: subject || '(Sin asunto)',
        text_content: text,
        html_content: html,
        raw_email: rest,
        category,
        read: false,
        replied: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing incoming email:', error)
      return NextResponse.json(
        { error: 'Error storing email' },
        { status: 500 }
      )
    }

    console.log('Incoming email stored:', data.id)

    return NextResponse.json({ 
      success: true,
      emailId: data.id 
    })

  } catch (error: any) {
    console.error('Error processing inbound email:', error)
    return NextResponse.json(
      { error: 'Error processing email' },
      { status: 500 }
    )
  }
}
