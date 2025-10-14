import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://padeliner.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/academias', '/tienda'],
        disallow: ['/admin', '/api', '/auth'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
