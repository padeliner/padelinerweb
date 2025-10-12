import { MetadataRoute } from 'next'
import { mockCoaches } from '@/lib/mock-data/coaches'
import { mockClubs } from '@/lib/mock-data/clubs'
import { mockAcademies } from '@/lib/mock-data/academies'
import { mockProducts } from '@/lib/mock-data/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.padeliner.com'

  // Static pages
  const staticPages = [
    '',
    '/entrenadores',
    '/clubes',
    '/academias',
    '/tienda',
    '/sobre-nosotros',
    '/contacto',
    '/terminos-y-condiciones',
    '/politica-privacidad',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
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

  return [
    ...staticPages,
    ...coachPages,
    ...clubPages,
    ...academyPages,
    ...productPages,
  ]
}
