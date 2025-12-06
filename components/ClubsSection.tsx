'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { mockClubs } from '@/lib/mock-data/clubs'

// Mostrar solo clubes destacados
const featuredClubs = mockClubs.filter(club => club.isFeatured).slice(0, 4)

export function ClubsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Clubes destacados
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Los mejores clubes con instalaciones de primer nivel
          </p>
        </motion.div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredClubs.map((club, index) => (
            <ClubCard key={club.id} club={club} index={index} />
          ))}
        </div>

        {/* Ver más */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/clubes">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
            >
              Ver todos los clubes
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ClubCard({ club, index }: { club: typeof mockClubs[0]; index: number }) {
  return (
    <Link href={`/club/${club.id}`}>
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
            src={club.imageUrl}
            alt={club.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badge */}
          <div className="absolute top-4 left-4 px-3 py-2 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900">
            ⭐ DESTACADO
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full">
            <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
            <span className="text-sm font-bold text-neutral-900">{club.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Name & Location */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              {club.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-neutral-600">
              <MapPin className="w-4 h-4" />
              <span>{club.city}</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Users className="w-4 h-4" />
              <span>{club.instructorsCount} instructores profesionales</span>
            </div>
          </div>

          {/* Price & Reviews */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div>
              <span className="text-2xl font-bold text-neutral-900">€{club.pricePerClass}</span>
              <span className="text-sm text-neutral-600">/clase</span>
            </div>
            <div className="text-sm text-neutral-500">
              {club.reviewsCount} valoraciones
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
