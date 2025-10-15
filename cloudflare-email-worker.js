/**
 * Cloudflare Email Worker
 * 
 * Este worker procesa emails entrantes y los envía a Supabase vía webhook
 * 
 * Cómo usarlo:
 * 1. Cloudflare Dashboard → Workers & Pages → Create Worker
 * 2. Nombre: email-handler
 * 3. Pega este código
 * 4. Deploy
 * 5. Settings → Variables → Añade WEBHOOK_SECRET
 * 6. Email Routing → Edit Rule → Send to Worker → email-handler
 */

export default {
  async email(message, env, ctx) {
    try {
      console.log('Processing email from:', message.from, 'to:', message.to)

      // Extraer información del email
      const from = message.from
      const to = message.to
      const subject = message.headers.get('subject') || '(Sin asunto)'
      
      // Leer el contenido del email
      const rawText = await streamToText(message.raw)
      
      // Extraer texto plano (simplificado)
      const textContent = extractTextFromRaw(rawText)
      
      // Preparar datos para enviar al webhook
      const emailData = {
        from: from,
        to: to,
        subject: subject,
        text: textContent,
        html: null,
        headers: {
          'content-type': message.headers.get('content-type'),
          'date': message.headers.get('date'),
        }
      }

      console.log('Sending to webhook:', emailData)

      // Enviar a tu webhook de Supabase (V2 - Conversaciones)
      const webhookResponse = await fetch('https://padeliner.com/api/webhooks/inbound-email/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': env.WEBHOOK_SECRET || ''
        },
        body: JSON.stringify(emailData)
      })

      if (!webhookResponse.ok) {
        console.error('Webhook failed:', await webhookResponse.text())
      } else {
        console.log('Webhook success:', await webhookResponse.json())
      }

      // Reenviar a Gmail (SIEMPRE, incluso si webhook falla)
      await message.forward('padeliner@gmail.com')
      
      console.log('Email processed successfully')

    } catch (error) {
      console.error('Error procesando email:', error)
      
      // Aún así reenviar a Gmail para no perder el email
      try {
        await message.forward('padeliner@gmail.com')
      } catch (forwardError) {
        console.error('Error forwarding to Gmail:', forwardError)
      }
    }
  }
}

/**
 * Convierte un ReadableStream a texto
 */
async function streamToText(stream) {
  const chunks = []
  const reader = stream.getReader()
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    
    // Concatenar todos los chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    
    return new TextDecoder().decode(result)
  } finally {
    reader.releaseLock()
  }
}

/**
 * Extrae texto plano del email raw (simplificado)
 */
function extractTextFromRaw(raw) {
  // Buscar el contenido después de los headers
  const parts = raw.split('\n\n')
  if (parts.length > 1) {
    return parts.slice(1).join('\n\n').trim()
  }
  return raw
}
