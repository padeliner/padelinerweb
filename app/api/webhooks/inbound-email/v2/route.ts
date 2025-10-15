import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Webhook V2 - Crea conversaciones agrupadas en vez de emails individuales
 * 
 * Flujo:
 * 1. Email llega → Cloudflare Worker → Este webhook
 * 2. Buscar conversación existente por contact_email
 * 3. Si existe: Añadir mensaje a conversación
 * 4. Si no: Crear nueva conversación + primer mensaje
 * 5. Auto-asignar a equipo según destino
 * 6. Crear SLA timer
 */

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret')
    
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      console.error('Invalid webhook secret')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📧 Incoming email webhook v2:', { from: body.from, to: body.to, subject: body.subject })
    
    const {
      from,
      to,
      subject,
      text,
      html,
      headers,
      ...rest
    } = body

    // Parse from email and name
    const fromMatch = from?.match(/<(.+)>/) || from?.match(/(.+)/)
    const fromEmail = fromMatch ? fromMatch[1] : from
    const fromName = from?.replace(/<.+>/, '').trim() || null

    // Determine team based on recipient
    const toEmail = typeof to === 'string' ? to : to?.[0] || 'unknown'
    let teamSlug = 'general'
    let category = 'general'
    
    if (toEmail.includes('contact@')) { teamSlug = 'general'; category = 'contact'; }
    if (toEmail.includes('soporte@')) { teamSlug = 'support'; category = 'support'; }
    if (toEmail.includes('support@')) { teamSlug = 'support'; category = 'support'; }
    if (toEmail.includes('ventas@')) { teamSlug = 'sales'; category = 'sales'; }
    if (toEmail.includes('sales@')) { teamSlug = 'sales'; category = 'sales'; }
    if (toEmail.includes('empleo@')) { teamSlug = 'hr'; category = 'careers'; }
    if (toEmail.includes('hr@')) { teamSlug = 'hr'; category = 'careers'; }

    // Connect to Supabase with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Get team ID
    const { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('slug', teamSlug)
      .single()

    if (!team) {
      console.error('Team not found:', teamSlug)
      return NextResponse.json({ error: 'Team not found' }, { status: 500 })
    }

    // Check if conversation already exists for this contact
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id, status')
      .eq('contact_email', fromEmail)
      .in('status', ['new', 'open', 'pending'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let conversationId: string

    if (existingConversation) {
      // Add message to existing conversation
      console.log('Adding to existing conversation:', existingConversation.id)
      conversationId = existingConversation.id

      // Update conversation
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

    } else {
      // Create new conversation
      console.log('Creating new conversation for:', fromEmail)

      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          contact_email: fromEmail,
          contact_name: fromName,
          subject: subject || '(Sin asunto)',
          team_id: team.id,
          category,
          source: 'email',
          status: 'new',
          priority: 'normal',
          first_message_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
          message_count: 0,
          unread_count: 0
        })
        .select('id')
        .single()

      if (convError) {
        console.error('Error creating conversation:', convError)
        return NextResponse.json(
          { error: 'Error creating conversation', details: convError.message },
          { status: 500 }
        )
      }

      conversationId = newConversation!.id

      // Create SLA status
      const { data: slaRule } = await supabase
        .from('sla_rules')
        .select('id, first_response_minutes, resolution_minutes')
        .eq('team_id', team.id)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (slaRule) {
        const now = new Date()
        await supabase
          .from('conversation_sla_status')
          .insert({
            conversation_id: conversationId,
            sla_rule_id: slaRule.id,
            first_response_due_at: new Date(now.getTime() + slaRule.first_response_minutes * 60000).toISOString(),
            resolution_due_at: new Date(now.getTime() + slaRule.resolution_minutes * 60000).toISOString()
          })
      }

      // Log activity
      await supabase
        .from('conversation_activities')
        .insert({
          conversation_id: conversationId,
          action: 'created',
          details: { source: 'email', from: fromEmail }
        })
    }

    // Add message to conversation
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        from_email: fromEmail,
        from_name: fromName,
        to_email: toEmail,
        subject: subject || '(Sin asunto)',
        content: text || html || '',
        html_content: html,
        type: 'message',
        is_internal: false,
        is_from_customer: true,
        attachments: [],
        headers: headers || {},
        raw_email: rest,
        read: false
      })

    if (messageError) {
      console.error('Error storing message:', messageError)
      return NextResponse.json(
        { error: 'Error storing message', details: messageError.message },
        { status: 500 }
      )
    }

    console.log('✅ Conversation and message created successfully')

    return NextResponse.json({ 
      success: true,
      conversationId,
      isNew: !existingConversation
    })

  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
