'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Award, Heart, Zap, Trophy, Medal, Shield, Sparkles, Crown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-3 h-3" />,
  trophy: <Trophy className="w-3 h-3" />,
  medal: <Medal className="w-3 h-3" />,
  zap: <Zap className="w-3 h-3" />,
  shield: <Shield className="w-3 h-3" />,
  sparkles: <Sparkles className="w-3 h-3" />,
  crown: <Crown className="w-3 h-3" />,
  'thumbs-up': <ThumbsUp className="w-3 h-3" />,
}

const coaches = [
  {
    id: 1,
    name: 'Carlos Martínez',
    image: 'https://i.pravatar.cc/400?img=12',
    rating: 4.9,
    reviews: 127,
    location: 'Madrid, España',
    specialty: 'Técnica avanzada',
    price: 45,
    experience: '10+ años',
    badge: 'Top Coach',
    badgeIcon: 'star',
  },
  {
    id: 2,
    name: 'Ana García',
    image: 'https://i.pravatar.cc/400?img=5',
    rating: 4.8,
    reviews: 98,
    location: 'Barcelona, España',
    specialty: 'Iniciación',
    price: 35,
    experience: '7 años',
    badge: 'Mejor valorado',
    badgeIcon: 'trophy',
  },
  {
    id: 3,
    name: 'Miguel Rodríguez',
    image: 'https://i.pravatar.cc/400?img=33',
    rating: 5.0,
    reviews: 156,
    location: 'Valencia, España',
    specialty: 'Competición',
    price: 55,
    experience: '15+ años',
    badge: 'Profesional',
    badgeIcon: 'medal',
  },
  {
    id: 4,
    name: 'Laura Sánchez',
    image: 'https://i.pravatar.cc/400?img=9',
    rating: 4.7,
    reviews: 84,
    location: 'Sevilla, España',
    specialty: 'Táctica de juego',
    price: 40,
    experience: '8 años',
    badge: 'Disponible hoy',
    badgeIcon: 'zap',
  },
  {
    id: 5,
    name: 'David López',
    image: 'https://i.pravatar.cc/400?img=15',
    rating: 4.9,
    reviews: 145,
    location: 'Málaga, España',
    specialty: 'Defensa',
    price: 42,
    experience: '12 años',
    badge: 'Experto',
    badgeIcon: 'shield',
  },
  {
    id: 6,
    name: 'Elena Torres',
    image: 'https://i.pravatar.cc/400?img=10',
    rating: 4.8,
    reviews: 112,
    location: 'Bilbao, España',
    specialty: 'Ataque',
    price: 48,
    experience: '9 años',
    badge: 'Nuevo',
    badgeIcon: 'sparkles',
  },
  {
    id: 7,
    name: 'Roberto Díaz',
    image: 'https://i.pravatar.cc/400?img=52',
    rating: 5.0,
    reviews: 203,
    location: 'Zaragoza, España',
    specialty: 'Estrategia',
    price: 50,
    experience: '14 años',
    badge: 'Premium',
    badgeIcon: 'crown',
  },
  {
    id: 8,
    name: 'Carmen Ruiz',
    image: 'https://i.pravatar.cc/400?img=16',
    rating: 4.7,
    reviews: 95,
    location: 'Alicante, España',
    specialty: 'Mentalidad',
    price: 38,
    experience: '6 años',
    badge: 'Recomendado',
    badgeIcon: 'thumbs-up',
  },
]

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
          {coaches.map((coach, index) => (
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
          >
            Ver todos los entrenadores
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function CoachCard({ coach, index }: { coach: typeof coaches[0]; index: number }) {
  const [isFavorite, setIsFavorite] = useState(false)

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
          src={coach.image}
          alt={coach.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-900 flex items-center space-x-1">
          {iconMap[coach.badgeIcon]}
          <span>{coach.badge}</span>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
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
              <span>{coach.location}</span>
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
          <span>{coach.specialty}</span>
          <span className="text-neutral-300">•</span>
          <span>{coach.experience}</span>
        </div>

        {/* Price & Reviews */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-2xl font-bold text-neutral-900">€{coach.price}</span>
            <span className="text-sm text-neutral-600">/hora</span>
          </div>
          <div className="text-sm text-neutral-500">
            {coach.reviews} valoraciones
          </div>
        </div>
      </div>
    </motion.div>
  )
}
