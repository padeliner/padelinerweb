// Internal linking configuration for automatic link insertion

export interface InternalLink {
  keywords: string[]
  url: string
  title: string
  priority: number // Higher priority = more likely to link (1-10)
}

// Define internal links for automatic insertion
export const INTERNAL_LINKS: InternalLink[] = [
  // Academias & Entrenadores
  {
    keywords: ['entrenador de pádel', 'entrenadores', 'profesor de pádel', 'coach de pádel'],
    url: '/entrenadores',
    title: 'Encuentra entrenadores profesionales de pádel',
    priority: 10
  },
  {
    keywords: ['academia de pádel', 'academias', 'escuela de pádel'],
    url: '/academias',
    title: 'Mejores academias de pádel',
    priority: 9
  },

  // Clubes & Reservas
  {
    keywords: ['club de pádel', 'clubes', 'instalaciones de pádel'],
    url: '/clubes',
    title: 'Clubes de pádel cerca de ti',
    priority: 9
  },
  {
    keywords: ['reservar pista', 'reserva de pista', 'alquiler de pista'],
    url: '/clubes',
    title: 'Reserva pistas de pádel online',
    priority: 8
  },

  // Tienda & Equipamiento
  {
    keywords: ['pala de pádel', 'palas', 'comprar pala'],
    url: '/tienda?category=palas',
    title: 'Mejores palas de pádel 2025',
    priority: 10
  },
  {
    keywords: ['zapatillas de pádel', 'calzado de pádel'],
    url: '/tienda?category=calzado',
    title: 'Zapatillas profesionales de pádel',
    priority: 8
  },
  {
    keywords: ['ropa de pádel', 'equipamiento', 'accesorios de pádel'],
    url: '/tienda?category=ropa',
    title: 'Ropa y accesorios de pádel',
    priority: 7
  },
  {
    keywords: ['pelota de pádel', 'pelotas', 'bolas de pádel'],
    url: '/tienda?category=pelotas',
    title: 'Pelotas de pádel profesionales',
    priority: 6
  },

  // Técnicas específicas
  {
    keywords: ['remate en pádel', 'técnica de remate'],
    url: '/blog?category=tecnica&tag=remate',
    title: 'Guías de técnica de remate',
    priority: 7
  },
  {
    keywords: ['bandeja en pádel', 'técnica de bandeja'],
    url: '/blog?category=tecnica&tag=bandeja',
    title: 'Cómo hacer una bandeja perfecta',
    priority: 7
  },
  {
    keywords: ['volea en pádel', 'técnica de volea'],
    url: '/blog?category=tecnica&tag=volea',
    title: 'Mejora tu técnica de volea',
    priority: 7
  },

  // Contenido
  {
    keywords: ['blog de pádel', 'artículos de pádel', 'noticias de pádel'],
    url: '/blog',
    title: 'Blog de pádel con consejos y noticias',
    priority: 6
  },
  {
    keywords: ['world padel tour', 'WPT', 'circuito mundial'],
    url: '/blog?category=noticias&tag=wpt',
    title: 'Noticias del World Padel Tour',
    priority: 8
  },
]

/**
 * Add internal links to blog content automatically
 * @param content - HTML content of the blog
 * @param currentUrl - Current blog URL to avoid self-linking
 * @param maxLinks - Maximum number of links to add (default: 5)
 * @returns Modified content with internal links
 */
export function addInternalLinks(
  content: string,
  currentUrl: string,
  maxLinks: number = 5
): string {
  let modifiedContent = content
  let linksAdded = 0
  const linkedKeywords = new Set<string>()

  // Sort links by priority (highest first)
  const sortedLinks = [...INTERNAL_LINKS].sort((a, b) => b.priority - a.priority)

  for (const link of sortedLinks) {
    if (linksAdded >= maxLinks) break
    if (link.url === currentUrl) continue // Skip self-linking

    for (const keyword of link.keywords) {
      if (linksAdded >= maxLinks) break
      if (linkedKeywords.has(keyword.toLowerCase())) continue

      // Create case-insensitive regex that matches whole words
      // Avoid matching inside existing links or HTML tags
      const regex = new RegExp(
        `(?<!<a[^>]*>)(?<!<[^>]*)(${keyword})(?![^<]*<\/a>)(?![^<]*>)`,
        'gi'
      )

      // Check if keyword exists in content
      if (regex.test(modifiedContent)) {
        // Replace only the first occurrence
        let replaced = false
        modifiedContent = modifiedContent.replace(regex, (match) => {
          if (!replaced) {
            replaced = true
            linksAdded++
            linkedKeywords.add(keyword.toLowerCase())
            return `<a href="${link.url}" class="text-primary-600 hover:text-primary-700 underline decoration-primary-400 decoration-2 underline-offset-2 transition-colors font-medium" title="${link.title}">${match}</a>`
          }
          return match
        })
        break // Move to next link after first match
      }
    }
  }

  return modifiedContent
}

/**
 * Extract keywords from blog content for SEO
 */
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  const keywords = new Set<string>()
  
  INTERNAL_LINKS.forEach(link => {
    link.keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi')
      if (regex.test(content)) {
        keywords.add(keyword)
      }
    })
  })

  return Array.from(keywords).slice(0, maxKeywords)
}
