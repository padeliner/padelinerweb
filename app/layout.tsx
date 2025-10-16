import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { BottomNav } from '@/components/BottomNav'
import { CookieBanner } from '@/components/CookieBanner'
import { ChatBot } from '@/components/ChatBot'
import { AppDownloadPopup } from '@/components/AppDownloadPopup'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { SchemaOrg } from '@/components/SchemaOrg'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Padeliner - Plataforma Líder de Pádel en España',
    template: '%s | Padeliner'
  },
  description: 'Descubre los mejores entrenadores, clubes y academias de pádel en España. Reserva clases, encuentra instalaciones y compra equipo profesional. +20 entrenadores certificados, +10 clubes premium.',
  keywords: ['pádel', 'entrenador pádel', 'clases pádel', 'clubes pádel', 'academias pádel', 'tienda pádel', 'reservar pista pádel', 'material pádel', 'palas pádel', 'Madrid', 'Barcelona', 'España'],
  authors: [{ name: 'Padeliner', url: 'https://www.padeliner.com' }],
  creator: 'Padeliner',
  publisher: 'Padeliner',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.padeliner.com',
    siteName: 'Padeliner',
    title: 'Padeliner - Plataforma Líder de Pádel en España',
    description: 'Conecta con los mejores profesionales del pádel. Reserva clases, encuentra clubes y compra equipo de alta calidad.',
    images: [
      {
        url: 'https://www.padeliner.com/og-image.png?v=2',
        width: 1200,
        height: 630,
        alt: 'Padeliner - Plataforma de Pádel',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Padeliner - Plataforma Líder de Pádel en España',
    description: 'Descubre entrenadores, clubes y academias de pádel cerca de ti. Reserva, juega y mejora tu nivel.',
    images: ['https://www.padeliner.com/og-image.png?v=2'],
  },
  verification: {
    google: 'verification_token', // Añadir token real de Google Search Console
  },
  alternates: {
    canonical: 'https://www.padeliner.com',
  },
  category: 'sports',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="es" className={inter.variable}>
      <head>
        {/* Facebook App ID - Obtén el tuyo en https://developers.facebook.com */}
        <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
      </head>
      <body className="antialiased pb-16 md:pb-0">
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <SchemaOrg />
        <AuthProvider>
          <CartProvider>
            {children}
            <BottomNav />
            <CookieBanner />
            <ChatBot />
            <AppDownloadPopup />
          </CartProvider>
        </AuthProvider>
        {/* Portal para DatePicker en móvil */}
        <div id="date-picker-portal"></div>
      </body>
    </html>
  )
}
