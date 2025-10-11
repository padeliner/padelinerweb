import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Padeliner - Encuentra tu entrenador de pádel perfecto',
  description: 'Conecta con los mejores entrenadores de pádel cerca de ti. Reserva clases, mejora tu juego y equípate con lo mejor.',
  keywords: 'pádel, entrenador, clases, reservar, padel, deporte',
  authors: [{ name: 'Padeliner' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Padeliner - Encuentra tu entrenador de pádel',
    description: 'La plataforma líder para conectar jugadores con entrenadores profesionales',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
