'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Users, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { mockAcademies } from '@/lib/mock-data/academies'

// Mostrar solo academias destacadas
const featuredAcademies = mockAcademies.filter(academy => academy.isFeatured).slice(0, 4)

export function AcademiesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Academias destacadas
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Formación profesional con los mejores programas de entrenamiento
          </p>
        </motion.div>

        {/* Academies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAcademies.map((academy, index) => (
            <AcademyCard key={academy.id} academy={academy} index={index} />
          ))}
        </div>

        {/* Ver más */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/academias">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
            >
              Ver todas las academias
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function AcademyCard({ academy, index }: { academy: typeof mockAcademies[0]; index: number }) {
  return (
    <Link href={`/academia/${academy.id}`}>
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
            src={academy.imageUrl}
            alt={academy.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badge */}
          <div className="absolute top-4 left-4 px-3 py-2 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900">
            ⭐ DESTACADA
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full">
            <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
            <span className="text-sm font-bold text-neutral-900">{academy.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Name & Location */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              {academy.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-neutral-600">
              <MapPin className="w-4 h-4" />
              <span>{academy.city}</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Users className="w-4 h-4" />
              <span>{academy.studentCapacity} plazas</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <GraduationCap className="w-4 h-4" />
              <span>{academy.coachesCount} entrenadores</span>
            </div>
          </div>

          {/* Price & Reviews */}
          <div className="pt-3 border-t border-neutral-100">
            <div className="text-lg font-bold text-neutral-900 mb-1">
              {academy.pricePerMonth}€/mes
            </div>
            <div className="text-sm text-neutral-500">
              {academy.reviewsCount} valoraciones
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
