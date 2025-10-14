import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { mockCoaches } from '@/lib/mock-data/coaches'

// Verificar que existe la API key
if (!process.env.GEMINI_API_KEY) {
  // GEMINI_API_KEY no está configurada
}

// Inicializar el cliente de Gemini (obtiene la key automáticamente de GEMINI_API_KEY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

// System prompt para el chatbot
const SYSTEM_PROMPT = `Eres un asistente virtual experto de Padeliner, una plataforma líder de reservas de clases de pádel en España.

INFORMACIÓN SOBRE PADELINER:
- Plataforma para conectar alumnos con entrenadores profesionales de pádel
- Disponible en toda España con más de 50 ciudades
- Los alumnos pueden buscar, comparar y reservar clases
- Los entrenadores pueden ofrecer clases individuales y grupales

PARA ALUMNOS:
- Registro GRATUITO sin coste
- Buscar entrenadores por ubicación, precio, nivel
- Reservar clases directamente en la plataforma
- Pago seguro online
- Chat con entrenadores
- Valoraciones y reseñas

PARA ENTRENADORES:
- Registro GRATUITO para crear perfil
- NO hay cuotas mensuales ni costes fijos
- Comisión del 15% por cada reserva completada
- Cobro automático cada 15 días
- Gestión de calendario y disponibilidad
- Visibilidad en toda España
- Sistema de valoraciones

CONDICIONES:
- Los entrenadores cobran cada 15 días por transferencia bancaria
- Comisión de plataforma: 15% por reserva
- Cancelaciones: Hasta 24h antes sin cargo
- Los entrenadores fijan sus propios precios

TU COMPORTAMIENTO:
1. Sé amable, profesional y cercano
2. Responde en español de forma clara y concisa
3. Si te preguntan por entrenadores en una ubicación, responde que has encontrado entrenadores y usa el código especial: [SEARCH_COACHES:ubicación]
4. Si detectas que el usuario quiere hablar con una persona real, soporte humano, o tiene un problema que no puedes resolver:
   - PRIMERO pregunta: "Para que nuestro equipo pueda contactarte, ¿podrías proporcionarme tu email o número de WhatsApp?"
   - ESPERA su respuesta con los datos de contacto
   - DESPUÉS usa el código: [HUMAN_SUPPORT_NEEDED:datos_de_contacto]
   Ejemplo: Si el usuario dice "mi email es juan@example.com", responde: "Perfecto, nuestro equipo se pondrá en contacto contigo pronto. [HUMAN_SUPPORT_NEEDED:juan@example.com]"
5. Responde preguntas sobre precios, comisiones, pagos, registro
6. NO inventes información que no esté aquí

EJEMPLOS:
Usuario: "Quiero reservar una clase cerca de Murcia"
Tú: "¡Perfecto! He encontrado varios entrenadores excelentes cerca de Murcia. Te muestro algunas opciones: [SEARCH_COACHES:Murcia]"

Usuario: "¿Cuánto cobráis a los entrenadores?"
Tú: "Los entrenadores NO pagan cuotas mensuales. Solo cobramos una comisión del 15% por cada reserva completada. El cobro se realiza cada 15 días mediante transferencia bancaria."

Usuario: "Necesito hablar con alguien del equipo"
Tú: "Por supuesto, voy a conectarte con nuestro equipo de soporte. [HUMAN_SUPPORT_NEEDED]"`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userId, userEmail, userName, conversationHistory } = await request.json()

    // Verificar API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'tu_gemini_api_key_aqui') {
      return NextResponse.json(
        { 
          message: 'Lo siento, el chatbot no está configurado correctamente. Por favor, contacta con soporte@padeliner.com',
          coaches: null,
          needsHumanSupport: false
        },
        { status: 500 }
      )
    }

    // Construir el contexto completo
    let fullPrompt = SYSTEM_PROMPT + '\n\n'
    
    // Añadir historial de conversación
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += 'Conversación previa:\n'
      conversationHistory.forEach((msg: any) => {
        fullPrompt += `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}\n`
      })
      fullPrompt += '\n'
    }
    
    fullPrompt += `Usuario: ${message}\nAsistente:`

    // Generar respuesta con el nuevo SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Modelo más moderno y rápido (GRATIS)
      contents: fullPrompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      }
    })

    let responseText = response.text || ''

    // Detectar intenciones
    let coaches = null
    let needsHumanSupport = false

    // Detectar búsqueda de entrenadores
    const searchMatch = responseText.match(/\[SEARCH_COACHES:(.+?)\]/g)
    if (searchMatch) {
      const locations = searchMatch.map((match: string) => {
        const locationMatch = match.match(/\[SEARCH_COACHES:(.+?)\]/)
        return locationMatch ? locationMatch[1].trim().toLowerCase() : ''
      })

      // Filtrar entrenadores por ubicación
      coaches = mockCoaches.filter(coach => 
        locations.some((loc: string) => 
          coach.location.toLowerCase().includes(loc) ||
          coach.city.toLowerCase().includes(loc)
        )
      ).slice(0, 3) // Máximo 3 entrenadores

      // Limpiar el texto de respuesta
      responseText = responseText.replace(/\[SEARCH_COACHES:.+?\]/g, '').trim()
    }

    // Detectar necesidad de soporte humano con datos de contacto
    const supportMatch = responseText.match(/\[HUMAN_SUPPORT_NEEDED:(.+?)\]/)
    if (supportMatch) {
      needsHumanSupport = true
      const contactInfo = supportMatch[1]
      responseText = responseText.replace(/\[HUMAN_SUPPORT_NEEDED:.+?\]/, '').trim()

      // Enviar email al equipo de soporte con la info de contacto
      await sendSupportEmail({
        conversationId,
        userId,
        userEmail: userEmail || contactInfo, // Usa el contactInfo si no hay userEmail
        userName,
        contactInfo, // Info adicional que proporcionó el usuario
        conversationHistory: [...conversationHistory, { role: 'user', content: message }],
        lastMessage: message
      })
    }

    return NextResponse.json({
      message: responseText,
      coaches,
      needsHumanSupport
    })

  } catch (error: any) {
    // Manejar diferentes tipos de errores
    let errorMessage = 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.'
    
    if (error?.message?.includes('API key')) {
      errorMessage = 'Error de configuración. Por favor, contacta con soporte@padeliner.com'
    } else if (error?.message?.includes('quota')) {
      errorMessage = 'El servicio está temporalmente ocupado. Por favor, intenta en unos minutos.'
    } else if (error?.message?.includes('SAFETY')) {
      errorMessage = 'No puedo responder a eso. ¿Puedo ayudarte con algo más sobre Padeliner?'
    }
    
    return NextResponse.json(
      { 
        message: errorMessage,
        coaches: null,
        needsHumanSupport: false
      },
      { status: 500 }
    )
  }
}

// Función para enviar email al equipo de soporte
async function sendSupportEmail(data: {
  conversationId: string
  userId?: string
  userEmail?: string
  userName: string
  contactInfo?: string
  conversationHistory: any[]
  lastMessage: string
}) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Formatear la conversación
    const conversationText = data.conversationHistory
      .map(msg => `${msg.role === 'user' ? '👤 Usuario' : '🤖 Asistente'}: ${msg.content}`)
      .join('\n\n')

    const emailData = await resend.emails.send({
      from: 'Chatbot Padeliner <chatbot@padeliner.com>',
      to: 'padeliner@gmail.com',
      subject: `🚨 Solicitud de Soporte - ${data.conversationId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00C853 0%, #00A843 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">🆘 Nueva Solicitud de Soporte</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h3 style="color: #333; margin-top: 0;">Información del Cliente</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>ID Conversación:</strong></td>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;">${data.conversationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>Nombre:</strong></td>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;">${data.userName}</td>
              </tr>
              ${data.userEmail ? `
              <tr>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>Email:</strong></td>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;">${data.userEmail}</td>
              </tr>
              ` : ''}
              ${data.contactInfo ? `
              <tr>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>Contacto proporcionado:</strong></td>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>${data.contactInfo}</strong></td>
              </tr>
              ` : ''}
              ${data.userId ? `
              <tr>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>ID Usuario:</strong></td>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;">${data.userId}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;"><strong>Fecha:</strong></td>
                <td style="padding: 8px; background: white; border: 1px solid #e0e0e0;">${new Date().toLocaleString('es-ES')}</td>
              </tr>
            </table>

            <h3 style="color: #333; margin-top: 20px;">💬 Conversación Completa</h3>
            <div style="background: white; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; white-space: pre-wrap; font-size: 14px; max-height: 400px; overflow-y: auto;">
${conversationText}
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
              <strong>⚠️ Último mensaje del usuario:</strong>
              <p style="margin: 10px 0 0 0;">${data.lastMessage}</p>
            </div>

            <div style="margin-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 12px;">Este correo se ha generado automáticamente desde el chatbot de Padeliner</p>
            </div>
          </div>
        </div>
      `
    })

    return true
  } catch (error) {
    return false
  }
}
