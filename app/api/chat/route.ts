import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { mockCoaches } from '@/lib/mock-data/coaches'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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
4. Si detectas que el usuario quiere hablar con una persona real, soporte humano, o tiene un problema que no puedes resolver, usa el código: [HUMAN_SUPPORT_NEEDED]
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

    // Inicializar Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Construir historial de conversación para contexto
    const chatHistory = conversationHistory.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Iniciar chat con historial
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Soy el asistente virtual de Padeliner y seguiré estas directrices para ayudar a los usuarios.' }]
        },
        ...chatHistory
      ],
    })

    // Enviar mensaje
    const result = await chat.sendMessage(message)
    const response = await result.response
    let responseText = response.text()

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

    // Detectar necesidad de soporte humano
    if (responseText.includes('[HUMAN_SUPPORT_NEEDED]')) {
      needsHumanSupport = true
      responseText = responseText.replace('[HUMAN_SUPPORT_NEEDED]', '').trim()

      // Enviar email al equipo de soporte
      await sendSupportEmail({
        conversationId,
        userId,
        userEmail,
        userName,
        conversationHistory: [...conversationHistory, { role: 'user', content: message }],
        lastMessage: message
      })
    }

    return NextResponse.json({
      message: responseText,
      coaches,
      needsHumanSupport
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        message: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo o contacta con soporte@padeliner.com',
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
  conversationHistory: any[]
  lastMessage: string
}) {
  try {
    // Formatear la conversación
    const conversationText = data.conversationHistory
      .map(msg => `${msg.role === 'user' ? '👤 Usuario' : '🤖 Asistente'}: ${msg.content}`)
      .join('\n\n')

    const emailBody = {
      to: 'soporte@padeliner.com', // Cambia esto a tu email real
      subject: `🚨 Solicitud de Soporte - Conversación ${data.conversationId}`,
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
    }

    // Aquí deberías integrar tu servicio de email (Resend, SendGrid, etc.)
    // Por ahora, lo logueamos en consola
    console.log('📧 Email de soporte generado:', emailBody)
    
    // Ejemplo con Resend (descomenta y configura cuando tengas la API key):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send(emailBody)
    */

    return true
  } catch (error) {
    console.error('Error sending support email:', error)
    return false
  }
}
