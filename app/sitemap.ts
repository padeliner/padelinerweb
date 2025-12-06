import { MetadataRoute } from 'next'
import { mockCoaches } from '@/lib/mock-data/coaches'
import { mockClubs } from '@/lib/mock-data/clubs'
import { mockAcademies } from '@/lib/mock-data/academies'
import { mockProducts } from '@/lib/mock-data/products'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.padeliner.com'

  // Static pages
  const staticPages = [
    '',
    '/entrenadores',
    '/clubes',
    '/academias',
    '/tienda',
    '/blog',
    '/sobre-nosotros',
    '/contacto',
    '/terminos-y-condiciones',
    '/politica-privacidad',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/blog' ? 0.9 : 0.8,
  }))

  // Dynamic coach pages
  const coachPages = mockCoaches.map((coach) => ({
    url: `${baseUrl}/entrenador/${coach.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic club pages
  const clubPages = mockClubs.map((club) => ({
    url: `${baseUrl}/club/${club.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic academy pages
  const academyPages = mockAcademies.map((academy) => ({
    url: `${baseUrl}/academia/${academy.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic product pages
  const productPages = mockProducts.map((product) => ({
    url: `${baseUrl}/producto/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }))

  // Blog pages (from Supabase)
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (blogs) {
      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  return [
    ...staticPages,
    ...coachPages,
    ...clubPages,
    ...academyPages,
    ...productPages,
    ...blogPages,
  ]
}
