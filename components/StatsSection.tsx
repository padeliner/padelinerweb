'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, MapPin, Star } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Usuarios activos',
    description: 'Jugadores y entrenadores',
  },
  {
    icon: Trophy,
    value: '5,000+',
    label: 'Clases completadas',
    description: 'Entrenamientos exitosos',
  },
  {
    icon: MapPin,
    value: '200+',
    label: 'Clubes asociados',
    description: 'En toda España',
  },
  {
    icon: Star,
    value: '4.9',
    label: 'Valoración media',
    description: 'De nuestros usuarios',
  },
]

export function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Impulsando el pádel en España
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Miles de jugadores confían en nosotros para mejorar su juego
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>

                {/* Value */}
                <div className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-neutral-700 mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-neutral-500">
                  {stat.description}
                </div>
              </div>

              {/* Separator line (except last item on desktop) */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-px h-24 bg-neutral-200 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
