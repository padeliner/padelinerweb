import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { BottomNav } from '@/components/BottomNav'
import { CookieBanner } from '@/components/CookieBanner'
import { ChatBot } from '@/components/ChatBot'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
        url: 'https://www.padeliner.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Padeliner - Plataforma de Pádel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Padeliner - Plataforma Líder de Pádel en España',
    description: 'Descubre entrenadores, clubes y academias de pádel cerca de ti. Reserva, juega y mejora tu nivel.',
    images: ['https://www.padeliner.com/og-image.jpg'],
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
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased pb-16 md:pb-0">
        <CartProvider>
          {children}
          <BottomNav />
          <CookieBanner />
          <ChatBot />
        </CartProvider>
      </body>
    </html>
  )
}
