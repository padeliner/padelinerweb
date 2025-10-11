'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, Users, Clock, Trophy, Award, Building2 } from 'lucide-react'

const clubs = [
  {
    id: 1,
    name: 'Pádel Premium Madrid',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    rating: 4.9,
    reviews: 234,
    location: 'Madrid, España',
    courts: 8,
    openHours: '07:00 - 23:00',
    price: 25,
    badge: 'Verificado',
    badgeIcon: 'award',
  },
  {
    id: 2,
    name: 'Club Deportivo Barcelona',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80',
    rating: 4.8,
    reviews: 189,
    location: 'Barcelona, España',
    courts: 12,
    openHours: '06:00 - 24:00',
    price: 30,
    badge: 'Premium',
    badgeIcon: 'trophy',
  },
  {
    id: 3,
    name: 'Valencia Padel Center',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
    rating: 4.7,
    reviews: 156,
    location: 'Valencia, España',
    courts: 6,
    openHours: '08:00 - 22:00',
    price: 22,
    badge: 'Popular',
    badgeIcon: 'users',
  },
  {
    id: 4,
    name: 'Málaga Sports Club',
    image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80',
    rating: 5.0,
    reviews: 198,
    location: 'Málaga, España',
    courts: 10,
    openHours: '07:00 - 23:00',
    price: 28,
    badge: 'Top Rated',
    badgeIcon: 'star',
  },
]

const iconMap: Record<string, React.ReactNode> = {
  award: <Award className="w-3 h-3" />,
  trophy: <Trophy className="w-3 h-3" />,
  users: <Users className="w-3 h-3" />,
  star: <Star className="w-3 h-3" />,
}

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
          {clubs.map((club, index) => (
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
          >
            Ver todos los clubes
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function ClubCard({ club, index }: { club: typeof clubs[0]; index: number }) {
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
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-900 flex items-center space-x-1">
          {iconMap[club.badgeIcon]}
          <span>{club.badge}</span>
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
            <span>{club.location}</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <Building2 className="w-4 h-4" />
            <span>{club.courts} pistas disponibles</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>{club.openHours}</span>
          </div>
        </div>

        {/* Price & Reviews */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-2xl font-bold text-neutral-900">€{club.price}</span>
            <span className="text-sm text-neutral-600">/hora</span>
          </div>
          <div className="text-sm text-neutral-500">
            {club.reviews} valoraciones
          </div>
        </div>
      </div>
    </motion.div>
  )
}
