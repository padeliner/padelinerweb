'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Users, GraduationCap, Trophy, Award, Medal, Crown } from 'lucide-react'

const academies = [
  {
    id: 1,
    name: 'Academia Elite Pádel',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80',
    rating: 5.0,
    reviews: 167,
    location: 'Madrid, España',
    students: 150,
    programs: 'Infantil, Juvenil, Adultos',
    level: 'Todos los niveles',
    badge: 'Profesional',
    badgeIcon: 'crown',
  },
  {
    id: 2,
    name: 'Pádel Pro Academy Barcelona',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    rating: 4.9,
    reviews: 198,
    location: 'Barcelona, España',
    students: 200,
    programs: 'Competición, Iniciación',
    level: 'Intermedio - Avanzado',
    badge: 'Premium',
    badgeIcon: 'trophy',
  },
  {
    id: 3,
    name: 'Academia Técnica Valencia',
    image: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80',
    rating: 4.8,
    reviews: 134,
    location: 'Valencia, España',
    students: 120,
    programs: 'Técnica, Estrategia',
    level: 'Todos los niveles',
    badge: 'Certificada',
    badgeIcon: 'award',
  },
  {
    id: 4,
    name: 'Champions Padel Academy',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    rating: 4.9,
    reviews: 176,
    location: 'Sevilla, España',
    students: 180,
    programs: 'Alto Rendimiento',
    level: 'Avanzado - Profesional',
    badge: 'Elite',
    badgeIcon: 'medal',
  },
]

const iconMap: Record<string, React.ReactNode> = {
  crown: <Crown className="w-3 h-3" />,
  trophy: <Trophy className="w-3 h-3" />,
  award: <Award className="w-3 h-3" />,
  medal: <Medal className="w-3 h-3" />,
}

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
          {academies.map((academy, index) => (
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
          >
            Ver todas las academias
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function AcademyCard({ academy, index }: { academy: typeof academies[0]; index: number }) {
  return (
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
          src={academy.image}
          alt={academy.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-900 flex items-center space-x-1">
          {iconMap[academy.badgeIcon]}
          <span>{academy.badge}</span>
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
            <span>{academy.location}</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <Users className="w-4 h-4" />
            <span>{academy.students}+ alumnos</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <GraduationCap className="w-4 h-4" />
            <span>{academy.programs}</span>
          </div>
        </div>

        {/* Level & Reviews */}
        <div className="pt-3 border-t border-neutral-100">
          <div className="text-sm font-semibold text-primary-600 mb-2">
            {academy.level}
          </div>
          <div className="text-sm text-neutral-500">
            {academy.reviews} valoraciones
          </div>
        </div>
      </div>
    </motion.div>
  )
}
