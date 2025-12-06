import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar que es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, 
      subject, 
      preview_text, 
      content_html, 
      send_immediately = false,
      campaign_id = null 
    } = body

    // Si no hay campaign_id, crear la campaña primero
    let campaignId = campaign_id
    if (!campaignId) {
      const { data: newCampaign, error: createError } = await supabase
        .from('newsletter_campaigns')
        .insert({
          name: name || 'Campaña sin nombre',
          subject,
          preview_text: preview_text || null,
          content_html,
          content_text: content_html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
          status: 'sending',
          target_all: true,
          created_by: user.id
        })
        .select()
        .single()

      if (createError) throw createError
      campaignId = newCampaign.id
    } else {
      // Actualizar estado a sending
      await supabase
        .from('newsletter_campaigns')
        .update({ status: 'sending' })
        .eq('id', campaignId)
    }

    // Obtener suscriptores activos
    const { data: subscribers, error: subsError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')

    if (subsError) throw subsError

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No hay suscriptores activos' },
        { status: 400 }
      )
    }

    console.log(`📧 Enviando campaña a ${subscribers.length} suscriptores...`)

    let sentCount = 0
    let failedCount = 0

    // Enviar emails en batch (de 10 en 10 para no saturar)
    const batchSize = 10
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(async (subscriber) => {
          try {
            // Reemplazar variables personalizadas
            const personalizedHtml = content_html
              .replace(/{{unsubscribe_url}}/g, `https://padeliner.com/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`)
              .replace(/{{email}}/g, subscriber.email)
              .replace(/{{name}}/g, subscriber.name || 'Amigo del pádel')

            // Enviar email con Resend
            const { data: emailData, error: emailError } = await resend.emails.send({
              from: 'Padeliner Newsletter <newsletter@padeliner.com>',
              to: subscriber.email,
              subject: subject,
              html: personalizedHtml,
              headers: {
                'X-Campaign-ID': campaignId
              }
            })

            if (emailError) {
              console.error(`❌ Error enviando a ${subscriber.email}:`, emailError)
              failedCount++
              
              // Registrar envío fallido
              await supabase
                .from('newsletter_sends')
                .insert({
                  campaign_id: campaignId,
                  subscriber_id: subscriber.id,
                  status: 'failed',
                  error_message: emailError.message
                })
              
              return
            }

            console.log(`✅ Enviado a ${subscriber.email}`)
            sentCount++

            // Registrar envío exitoso
            await supabase
              .from('newsletter_sends')
              .insert({
                campaign_id: campaignId,
                subscriber_id: subscriber.id,
                status: 'sent',
                sent_at: new Date().toISOString()
              })

          } catch (error: any) {
            console.error(`❌ Error enviando a ${subscriber.email}:`, error)
            failedCount++
            
            await supabase
              .from('newsletter_sends')
              .insert({
                campaign_id: campaignId,
                subscriber_id: subscriber.id,
                status: 'failed',
                error_message: error.message
              })
          }
        })
      )

      // Pequeña pausa entre batches para no saturar
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Actualizar estadísticas de la campaña
    await supabase
      .from('newsletter_campaigns')
      .update({
        status: 'sent',
        total_recipients: subscribers.length,
        sent_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    console.log(`✅ Campaña enviada: ${sentCount} exitosos, ${failedCount} fallidos`)

    return NextResponse.json({
      success: true,
      campaign_id: campaignId,
      sent_count: sentCount,
      failed_count: failedCount,
      total_recipients: subscribers.length
    })

  } catch (error: any) {
    console.error('Error sending campaign:', error)
    return NextResponse.json(
      { error: 'Error al enviar campaña', details: error.message },
      { status: 500 }
    )
  }
}
