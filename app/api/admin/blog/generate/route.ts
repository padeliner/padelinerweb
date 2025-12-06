import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/utils/supabase/server'

// Inicializar Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { topic, keywords, category, tone = 'profesional' } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'El tema es requerido' },
        { status: 400 }
      )
    }

    // Verificar API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'tu_gemini_api_key_aqui') {
      return NextResponse.json(
        { error: 'API de Gemini no configurada correctamente' },
        { status: 500 }
      )
    }

    // Construir el prompt para generar el blog
    const prompt = `Eres un experto escritor de contenido sobre pádel. 

Genera un artículo de blog completo y profesional sobre: "${topic}"
${keywords ? `Incluye estas palabras clave: ${keywords}` : ''}
${category ? `Categoría: ${category}` : ''}
Tono: ${tone}

El artículo debe incluir:

1. **Título atractivo y llamativo** (máximo 70 caracteres)
2. **Excerpt/Resumen** (2-3 frases que enganchen al lector)
3. **Contenido completo en HTML** (mínimo 800 palabras) con:
   - Subtítulos relevantes usando <h2> y <h3>
   - Párrafos bien estructurados con <p>
   - Listas numeradas o con viñetas cuando sea apropiado usando <ul> y <ol>
   - Enfasis en puntos clave con <strong> o <em>
   - Formato limpio y profesional
4. **5-7 tags relevantes** separados por comas
5. **Meta título SEO** (máximo 60 caracteres)
6. **Meta descripción SEO** (máximo 160 caracteres)

IMPORTANTE: 
- El contenido debe ser original, informativo y útil para jugadores de pádel
- Usa un lenguaje claro y accesible
- Incluye consejos prácticos cuando sea relevante
- El HTML debe ser válido y estar bien formateado
- NO incluyas imágenes o referencias a URLs externas

Devuelve ÚNICAMENTE un objeto JSON con esta estructura exacta:
{
  "title": "Título del artículo",
  "excerpt": "Resumen del artículo",
  "content": "<h2>Subtítulo</h2><p>Contenido...</p>",
  "tags": ["tag1", "tag2", "tag3"],
  "seo_title": "Título SEO",
  "seo_description": "Descripción SEO"
}

NO incluyas markdown, NO incluyas explicaciones adicionales, SOLO el JSON.`

    // Generar contenido con Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096,
      }
    })

    let generatedText = response.text || ''
    
    // Limpiar el texto para extraer solo el JSON
    // Remover markdown si existe
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    // Intentar parsear el JSON
    let blogData
    try {
      blogData = JSON.parse(generatedText)
    } catch (parseError) {
      // Si falla, intentar extraer el JSON del texto
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        blogData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No se pudo parsear la respuesta de la IA')
      }
    }

    // Validar que tiene los campos necesarios
    if (!blogData.title || !blogData.content) {
      return NextResponse.json(
        { error: 'La IA no generó un formato válido' },
        { status: 500 }
      )
    }

    // Generar slug basado en el título
    const slug = blogData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .trim()

    return NextResponse.json({
      success: true,
      blog: {
        ...blogData,
        slug,
        category: category || 'general',
      },
    })

  } catch (error: any) {
    let errorMessage = 'Error al generar el contenido'
    
    if (error?.message?.includes('API key')) {
      errorMessage = 'Error de configuración de API'
    } else if (error?.message?.includes('quota')) {
      errorMessage = 'Límite de uso de IA alcanzado. Intenta más tarde.'
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error?.message },
      { status: 500 }
    )
  }
}
