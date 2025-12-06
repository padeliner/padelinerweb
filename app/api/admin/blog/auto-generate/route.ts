import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/utils/supabase/server'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

// Temas profesionales para generación automática
const BLOG_THEMES = [
  {
    category: 'noticias',
    topics: [
      'Últimas tendencias en el pádel profesional',
      'Análisis de torneos recientes de World Padel Tour',
      'Nuevos rankings y clasificaciones WPT',
      'Fichajes destacados en el circuito profesional',
      'Entrevistas y declaraciones de jugadores top'
    ]
  },
  {
    category: 'tecnica',
    topics: [
      'Cómo mejorar tu técnica de bandeja paso a paso',
      'Secretos del remate perfecto en pádel',
      'Domina la volea: técnicas de los profesionales',
      'Mejora tu juego en la red con estos ejercicios',
      'Técnicas avanzadas de defensa en pared de fondo'
    ]
  },
  {
    category: 'estrategia',
    topics: [
      'Estrategias ganadoras para jugar en pareja',
      'Cómo leer el juego de tus oponentes',
      'Tácticas de posicionamiento en la pista',
      'Cuándo atacar y cuándo defender en pádel',
      'Estrategias para ganar partidos ajustados'
    ]
  },
  {
    category: 'equipamiento',
    topics: [
      'Las mejores palas de pádel de 2025',
      'Guía completa para elegir tu pala ideal',
      'Innovaciones tecnológicas en equipamiento de pádel',
      'Cómo elegir las zapatillas perfectas para pádel',
      'Accesorios esenciales para jugadores de pádel'
    ]
  },
  {
    category: 'salud',
    topics: [
      'Prevención de lesiones más comunes en pádel',
      'Rutina de calentamiento ideal antes de jugar',
      'Ejercicios de fortalecimiento para jugadores de pádel',
      'Nutrición óptima para mejorar tu rendimiento',
      'Recuperación post-partido: consejos de expertos'
    ]
  },
  {
    category: 'consejos',
    topics: [
      'Consejos para principiantes que empiezan en pádel',
      'Cómo progresar rápidamente en pádel',
      'Errores comunes y cómo evitarlos',
      'Mentalidad ganadora en el pádel',
      'Cómo encontrar el compañero ideal de pádel'
    ]
  }
]

// Imagen por defecto de Unsplash si todo falla
const DEFAULT_PADEL_IMAGE = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80' // Pista de pádel

// Verificar si una URL de imagen es válida
async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    const contentType = response.headers.get('content-type')
    return response.ok && (contentType?.startsWith('image/') || false)
  } catch {
    return false
  }
}

// Búsqueda de imágenes en Unsplash con fallback
async function searchPadelImage(query: string): Promise<string> {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return DEFAULT_PADEL_IMAGE
  }

  const searchQueries = [
    `padel ${query}`,
    'padel court',
    'padel game',
    'padel sport'
  ]

  for (const searchQuery of searchQueries) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
          }
        }
      )

      if (!response.ok) continue

      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        // Intentar con múltiples imágenes hasta encontrar una válida
        const imageCount = Math.min(5, data.results.length)
        for (let i = 0; i < imageCount; i++) {
          const randomIndex = Math.floor(Math.random() * data.results.length)
          const imageUrl = data.results[randomIndex].urls.regular
          
          // Verificar que la imagen es válida
          const isValid = await verifyImageUrl(imageUrl)
          if (isValid) {
            return imageUrl
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching Unsplash image for "${searchQuery}":`, error)
      continue
    }
  }

  // Si todo falla, usar imagen por defecto
  console.log('Using default padel image as fallback')
  return DEFAULT_PADEL_IMAGE
}

// Generar slug único
function generateSlug(title: string, timestamp: number): string {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  return `${baseSlug}-${Date.now()}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación (puede ser un cron job con API key)
    const authHeader = request.headers.get('authorization')
    const cronApiKey = process.env.CRON_API_KEY || 'dev-cron-key'
    
    // Permitir acceso con API key de cron o usuario admin
    let isAuthorized = false
    let isCronJob = false
    
    if (authHeader === `Bearer ${cronApiKey}`) {
      isAuthorized = true
      isCronJob = true
    } else {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (!authError && user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (userProfile?.role === 'admin') {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Si es cron job, verificar si la auto-generación está activada
    if (isCronJob) {
      const { data: config } = await supabase
        .from('blog_config')
        .select('auto_generate_enabled')
        .single()
      
      if (!config?.auto_generate_enabled) {
        return NextResponse.json({ 
          message: 'Auto-generación desactivada',
          skipped: true 
        })
      }
    }

    // Obtener cantidad de blogs a generar (del body o default 1)
    let count = 1
    try {
      const body = await request.json()
      count = body.count || 1
    } catch {
      // Si no hay body, usar default
    }

    // Validar cantidad
    if (count < 1 || count > 5) {
      return NextResponse.json({ 
        error: 'La cantidad debe estar entre 1 y 5' 
      }, { status: 400 })
    }

    // Verificar API keys necesarias
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API de Gemini no configurada' },
        { status: 500 }
      )
    }

    // Array para almacenar los blogs generados
    const generatedBlogs = []
    const errors = []

    // Generar múltiples blogs
    for (let i = 0; i < count; i++) {
      try {
        // Seleccionar tema aleatorio para cada blog
        const randomTheme = BLOG_THEMES[Math.floor(Math.random() * BLOG_THEMES.length)]
        const randomTopic = randomTheme.topics[Math.floor(Math.random() * randomTheme.topics.length)]

    // Prompt profesional mejorado
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    const professionalPrompt = `Eres un experto periodista deportivo especializado en pádel con años de experiencia cubriendo el World Padel Tour.

FECHA DE HOY: ${currentDate}

Genera un artículo profesional y optimizado para SEO sobre: "${randomTopic}"

CONTEXTO IMPORTANTE:
- Incluye datos actuales y relevantes del año 2025
- Si es sobre noticias, menciona eventos recientes creíbles
- Usa estadísticas realistas y referencias a jugadores conocidos (Alejandro Galán, Arturo Coello, Agustín Tapia, etc.)
- Optimiza para palabras clave relacionadas con pádel
- El contenido debe ser útil, informativo y compartible

ESTRUCTURA REQUERIDA:

1. **Título SEO-optimizado** (50-60 caracteres)
   - Debe incluir palabra clave principal
   - Atractivo y clickeable
   - Formato: "Cómo/Guía/Top/Secretos/etc + [Palabra clave] + [Beneficio]"

2. **Excerpt/Lead** (140-160 caracteres)
   - Resume el valor principal del artículo
   - Incluye palabra clave secundaria
   - Llamada a la acción implícita

3. **Contenido HTML profesional** (1200-1500 palabras)
   IMPORTANTE: Cada h2 y h3 DEBE tener un id único en formato slug.
   
   Estructura:
   
   <h2 id="introduccion">Introducción</h2>
   <p>Contexto relevante y gancho emocional (2-3 párrafos)</p>
   
   <h2 id="punto-principal-1">[Punto Principal 1]</h2>
   <p>Desarrollo con datos específicos</p>
   <ul>
     <li>Puntos clave con ejemplos</li>
   </ul>
   
   <h3 id="subtema-1-1">[Subtema si aplica]</h3>
   <p>Detalle adicional</p>
   
   <h2 id="punto-principal-2">[Punto Principal 2]</h2>
   <p>Explicación detallada</p>
   <ol>
     <li>Pasos o técnicas específicas</li>
   </ol>
   
   <h2 id="punto-principal-3">[Punto Principal 3]</h2>
   <p>Consejos prácticos aplicables</p>
   
   <h2 id="consejos-expertos">Consejos de Expertos</h2>
   <p>Tips profesionales y mejores prácticas</p>
   
   <h2 id="conclusion">Conclusión</h2>
   <p>Resumen y call-to-action</p>
   
   REGLAS CRÍTICAS:
   - TODOS los h2 y h3 deben tener atributo id
   - Los IDs deben ser en minúsculas, sin acentos, con guiones
   - Ejemplo: "Técnicas Avanzadas" → id="tecnicas-avanzadas"
   - Usar <p> separados para cada párrafo
   - Agregar <br> entre secciones si necesario

4. **Tags estratégicos** (7-10 tags)
   - Mix de términos amplios y específicos
   - Incluir variaciones de búsqueda
   - Ejemplos: "padel", "world padel tour", "técnica de pádel", etc.

5. **Meta título SEO** (50-60 caracteres)
   - Optimizado para Google
   - Incluye año o "Guía" para relevancia

6. **Meta descripción SEO** (150-160 caracteres)
   - Persuasiva y orientada a conversión
   - Incluye beneficio claro

REQUISITOS DE CALIDAD:
- Tono profesional pero accesible
- Sin errores gramaticales
- Datos verificables y realistas
- Estructura clara con subtítulos
- Párrafos cortos (3-4 líneas máximo)
- Uso de listas y negritas para escaneabilidad
- Incluir cifras y datos concretos
- Mencionar marcas reales del sector (Adidas, Head, Bullpadel, etc.)

DEVUELVE SOLO ESTE JSON (sin markdown, sin explicaciones):
{
  "title": "Título del artículo",
  "excerpt": "Resumen del artículo",
  "content": "<h2>...</h2><p>...</p>",
  "tags": ["tag1", "tag2", ...],
  "seo_title": "Título SEO",
  "seo_description": "Descripción SEO",
  "image_search_query": "término específico para buscar imagen (ej: padel court, padel smash, padel tournament)"
}`

    // Generar contenido con Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: professionalPrompt,
      config: {
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    })

    let generatedText = response.text || ''
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    let blogData
    try {
      blogData = JSON.parse(generatedText)
    } catch (parseError) {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        blogData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No se pudo parsear la respuesta de la IA')
      }
    }

    // Buscar imagen apropiada (siempre retorna una imagen válida)
    const imageQuery = blogData.image_search_query || randomTopic
    const coverImage = await searchPadelImage(imageQuery)
    console.log(`Image for blog "${blogData.title}": ${coverImage}`)

    // Generar slug único
    const slug = generateSlug(blogData.title, Date.now())

    // Verificar que el slug sea único
    const { data: existingBlog } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingBlog) {
      return NextResponse.json(
        { error: 'Slug duplicado, intenta de nuevo' },
        { status: 400 }
      )
    }

    // Crear blog automáticamente publicado
    const { data: blog, error: dbError } = await supabase
      .from('blogs')
      .insert({
        title: blogData.title,
        slug,
        excerpt: blogData.excerpt || '',
        content: blogData.content,
        cover_image: coverImage,
        category: randomTheme.category,
        tags: blogData.tags || [],
        published: true, // Auto-publicar
        published_at: new Date().toISOString(),
        seo_title: blogData.seo_title || blogData.title,
        seo_description: blogData.seo_description || blogData.excerpt,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear blog', details: dbError },
        { status: 500 }
      )
    }

    // Generar 3 comentarios personalizados con IA
    if (blog) {
      const commentPrompt = `Genera 3 comentarios realistas en español de usuarios que leyeron este artículo de pádel:

TÍTULO: ${blogData.title}
CONTENIDO: ${blogData.excerpt}

Genera comentarios variados, auténticos y relacionados con el contenido del artículo.

DEVUELVE SOLO ESTE JSON (sin markdown):
{
  "comments": [
    {
      "author": "Nombre completo español",
      "comment": "Comentario específico sobre el artículo (50-100 palabras, menciona algo concreto del tema)"
    }
  ]
}`

      try {
        const commentsResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: commentPrompt,
          config: {
            temperature: 0.9,
            maxOutputTokens: 1024,
          }
        })

        let commentsText = commentsResponse.text || ''
        commentsText = commentsText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        
        let commentsData
        try {
          commentsData = JSON.parse(commentsText)
        } catch {
          const jsonMatch = commentsText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            commentsData = JSON.parse(jsonMatch[0])
          }
        }

        if (commentsData?.comments) {
          for (const comment of commentsData.comments.slice(0, 3)) {
            const authorEmail = `${comment.author.toLowerCase().replace(/\s+/g, '.')}@email.com`
            
            await supabase.from('blog_comments').insert({
              blog_id: blog.id,
              user_id: null,
              parent_comment_id: null,
              author_name: comment.author,
              author_email: authorEmail,
              content: comment.comment,
              approved: true, // Aprobar automáticamente
              created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            })
          }
        }
      } catch (commentError) {
        console.error('Error generating comments:', commentError)
        // Continue without comments if generation fails
      }
    }

        generatedBlogs.push({
          title: blogData.title,
          category: randomTheme.category,
          has_image: !!coverImage
        })

      } catch (error: any) {
        errors.push(`Blog ${i + 1}: ${error.message}`)
      }
    }

    // Actualizar estadísticas en blog_config
    if (generatedBlogs.length > 0) {
      await supabase
        .from('blog_config')
        .update({
          last_auto_generation: new Date().toISOString(),
          total_auto_generated: supabase.rpc('increment', { x: generatedBlogs.length })
        })
        .eq('id', (await supabase.from('blog_config').select('id').single()).data?.id)
    }

    return NextResponse.json({
      success: true,
      count: generatedBlogs.length,
      blogs: generatedBlogs,
      errors: errors.length > 0 ? errors : undefined,
      message: `${generatedBlogs.length} blog(s) generado(s) y publicado(s) automáticamente`
    })

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Error al generar blogs automáticos', 
        details: error?.message 
      },
      { status: 500 }
    )
  }
}
