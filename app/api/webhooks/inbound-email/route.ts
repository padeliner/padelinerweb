import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (security)
    const webhookSecret = request.headers.get('x-webhook-secret')
    
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Resend sends emails in this format
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
    if (to?.includes('soporte@')) category = 'support'
    if (to?.includes('hola@')) category = 'contact'
    if (to?.includes('ventas@')) category = 'sales'
    if (to?.includes('info@')) category = 'info'

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
