/**
 * Cloudflare Email Worker V2
 * 
 * Este worker procesa emails entrantes y los envía a Supabase vía webhook
 * Parsea correctamente HTML y texto plano
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
      
      // Parsear el email para extraer texto y HTML
      const parsed = parseEmail(rawText)
      
      // Preparar datos para enviar al webhook
      const emailData = {
        from: from,
        to: to,
        subject: subject,
        text: parsed.text,
        html: parsed.html,
        headers: {
          'content-type': message.headers.get('content-type'),
          'date': message.headers.get('date'),
          'reply-to': message.headers.get('reply-to'),
        }
      }

      console.log('Sending to webhook:', { from, to, subject, hasHtml: !!parsed.html })

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
 * Parsea el email raw y extrae texto plano y HTML
 */
function parseEmail(raw) {
  const result = {
    text: '',
    html: null
  }

  try {
    // Separar headers del body
    const headerBodySplit = raw.split(/\r?\n\r?\n/)
    if (headerBodySplit.length < 2) {
      result.text = raw
      return result
    }

    const body = headerBodySplit.slice(1).join('\n\n')

    // Detectar si es multipart
    const boundaryMatch = raw.match(/boundary="?([^"\s;]+)"?/i)
    
    if (boundaryMatch) {
      const boundary = boundaryMatch[1]
      const parts = body.split(`--${boundary}`)
      
      for (const part of parts) {
        if (!part.trim() || part.trim() === '--') continue
        
        // Buscar Content-Type en esta parte
        const contentTypeMatch = part.match(/Content-Type:\s*([^;\r\n]+)/i)
        const contentType = contentTypeMatch ? contentTypeMatch[1].trim().toLowerCase() : ''
        
        // Separar headers de contenido en esta parte
        const partSplit = part.split(/\r?\n\r?\n/)
        if (partSplit.length < 2) continue
        
        let content = partSplit.slice(1).join('\n\n')
        
        // Decodificar quoted-printable si es necesario
        if (part.includes('Content-Transfer-Encoding: quoted-printable')) {
          content = decodeQuotedPrintable(content)
        }
        
        // Guardar según tipo
        if (contentType.includes('text/html') && !result.html) {
          result.html = content.trim()
        } else if (contentType.includes('text/plain') && !result.text) {
          result.text = content.trim()
        }
      }
    } else {
      // Email simple (no multipart)
      result.text = body.trim()
    }

    // Limpiar si quedaron vacíos
    if (!result.text && result.html) {
      // Extraer texto del HTML (básico)
      result.text = result.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    }

  } catch (error) {
    console.error('Error parsing email:', error)
    result.text = raw
  }

  return result
}

/**
 * Decodifica quoted-printable encoding
 */
function decodeQuotedPrintable(str) {
  return str
    .replace(/=\r?\n/g, '') // Soft line breaks
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
}
