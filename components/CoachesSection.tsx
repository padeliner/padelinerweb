'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Award, Heart } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { mockCoaches } from '@/lib/mock-data/coaches'

// Mostrar solo coaches destacados
const featuredCoaches = mockCoaches.filter(coach => coach.isFeatured).slice(0, 8)

export function CoachesSection() {
  return (
    <section id="entrenadores" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Entrenadores destacados
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Conecta con los mejores profesionales cerca de ti
          </p>
        </motion.div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCoaches.map((coach, index) => (
            <CoachCard key={coach.id} coach={coach} index={index} />
          ))}
        </div>

        {/* Ver más */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/entrenadores">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
            >
              Ver todos los entrenadores
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function CoachCard({ coach, index }: { coach: typeof mockCoaches[0]; index: number }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Link href={`/entrenador/${coach.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={coach.imageUrl}
            alt={coach.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badge */}
          <div className="absolute top-4 left-4 px-3 py-2 bg-yellow-400 backdrop-blur-sm rounded-full text-xs font-bold text-yellow-900">
            ⭐ DESTACADO
          </div>

          {/* Favorite Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600'
              }`}
            />
          </motion.button>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Name & Rating */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                {coach.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-neutral-600">
                <MapPin className="w-4 h-4" />
                <span>{coach.city}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary-50 rounded-lg">
              <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
              <span className="text-sm font-bold text-primary-600">{coach.rating}</span>
            </div>
          </div>

          {/* Specialty */}
          <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-3">
            <Award className="w-4 h-4" />
            <span>{coach.specialties[0]}</span>
            <span className="text-neutral-300">•</span>
            <span>{coach.experience} años</span>
          </div>

          {/* Price & Reviews */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div>
              <span className="text-2xl font-bold text-neutral-900">€{coach.pricePerHour}</span>
              <span className="text-sm text-neutral-600">/hora</span>
            </div>
            <div className="text-sm text-neutral-500">
              {coach.reviewsCount} valoraciones
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
