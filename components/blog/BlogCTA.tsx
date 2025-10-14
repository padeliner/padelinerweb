'use client'

import Link from 'next/link'
import { ArrowRight, Store, Users, TrendingUp } from 'lucide-react'

interface BlogCTAProps {
  category: string
}

export function BlogCTA({ category }: BlogCTAProps) {
  // CTAs diferentes según categoría del blog
  const getCTAByCategory = () => {
    switch (category) {
      case 'tecnica':
      case 'consejos':
        return {
          icon: Users,
          title: '¿Quieres mejorar tu técnica?',
          description: 'Encuentra entrenadores profesionales cerca de ti y lleva tu juego al siguiente nivel',
          buttonText: 'Buscar Entrenadores',
          buttonLink: '/academias',
          gradient: 'from-blue-600 to-cyan-600'
        }

      case 'equipamiento':
        return {
          icon: Store,
          title: 'Encuentra el equipamiento perfecto',
          description: 'Explora nuestra tienda con las mejores palas, zapatillas y accesorios de pádel',
          buttonText: 'Ver Tienda',
          buttonLink: '/tienda',
          gradient: 'from-purple-600 to-pink-600'
        }

      case 'noticias':
        return {
          icon: TrendingUp,
          title: 'Mantente actualizado',
          description: 'Síguenos en redes sociales para no perderte ninguna noticia del mundo del pádel',
          buttonText: 'Síguenos',
          buttonLink: '#', // Aquí irían los enlaces de redes sociales
          gradient: 'from-orange-600 to-red-600'
        }

      case 'estrategia':
        return {
          icon: Users,
          title: 'Mejora tu estrategia con un experto',
          description: 'Encuentra entrenadores especializados en estrategia y táctica de pádel',
          buttonText: 'Buscar Entrenadores',
          buttonLink: '/entrenadores',
          gradient: 'from-green-600 to-teal-600'
        }

      default:
        return {
          icon: Users,
          title: 'Únete a la comunidad Padeliner',
          description: 'Encuentra entrenadores profesionales de pádel y lleva tu juego al siguiente nivel',
          buttonText: 'Buscar Entrenadores',
          buttonLink: '/entrenadores',
          gradient: 'from-primary-600 to-purple-600'
        }
    }
  }

  const cta = getCTAByCategory()
  const Icon = cta.icon

  return (
    <div className={`bg-gradient-to-r ${cta.gradient} rounded-2xl p-8 text-white relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {cta.title}
            </h3>
            <p className="text-white text-opacity-90 text-lg">
              {cta.description}
            </p>
          </div>
        </div>

        <Link
          href={cta.buttonLink}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
          onClick={() => {
            // Analytics event
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'cta_click', {
                cta_type: category,
                cta_link: cta.buttonLink
              })
            }
          }}
        >
          {cta.buttonText}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
