'use client'

import Script from 'next/script'

export function SchemaOrg() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Padeliner',
    alternateName: 'Padeliner - Plataforma de Pádel',
    url: 'https://www.padeliner.com',
    logo: 'https://www.padeliner.com/padeliner-logo.png',
    image: 'https://www.padeliner.com/hero-padel.jpg',
    description: 'La plataforma líder para conectar jugadores con entrenadores profesionales de pádel en España. Reserva clases, encuentra clubes y academias.',
    email: 'contact@padeliner.com',
    telephone: '+34-699-984-661',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Valencia',
      addressCountry: 'ES'
    },
    sameAs: [
      'https://www.instagram.com/padeliner/',
      'https://www.tiktok.com/@padeliner',
      'https://www.youtube.com/@Padeliner',
      'https://www.linkedin.com/company/padeliner/?viewAsMember=true'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34-699-984-661',
      contactType: 'customer service',
      areaServed: 'ES',
      availableLanguage: ['Spanish', 'English']
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Padeliner',
    url: 'https://www.padeliner.com',
    image: 'https://www.padeliner.com/hero-padel.jpg',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.padeliner.com/entrenadores?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Padeliner - Plataforma Líder de Pádel en España',
    description: 'Conecta con los mejores profesionales del pádel. Reserva clases, encuentra clubes y compra equipo de alta calidad.',
    url: 'https://www.padeliner.com',
    image: {
      '@type': 'ImageObject',
      url: 'https://www.padeliner.com/hero-padel.jpg',
      width: 1200,
      height: 630,
      caption: 'Padeliner - Plataforma de Pádel'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Padeliner',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.padeliner.com/padeliner-logo.png',
        width: 512,
        height: 512
      }
    },
    inLanguage: 'es-ES'
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Padeliner',
    image: 'https://www.padeliner.com/hero-padel.jpg',
    '@id': 'https://www.padeliner.com',
    url: 'https://www.padeliner.com',
    telephone: '+34-699-984-661',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Valencia',
      addressCountry: 'ES'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.4699,
      longitude: -0.3763
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    sameAs: [
      'https://www.instagram.com/padeliner/',
      'https://www.tiktok.com/@padeliner',
      'https://www.youtube.com/@Padeliner',
      'https://www.linkedin.com/company/padeliner/?viewAsMember=true'
    ]
  }

  return (
    <>
      <Script
        id="schema-org-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <Script
        id="schema-org-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <Script
        id="schema-org-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />
      <Script
        id="schema-org-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
    </>
  )
}
