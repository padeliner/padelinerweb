'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { mockClubs } from '@/lib/mock-data/clubs'
import { 
  Star, 
  MapPin, 
  Users, 
  Clock, 
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Shield
} from 'lucide-react'

// Mock reviews
const mockReviews = [
  {
    id: 1,
    userName: "Antonio García",
    rating: 5,
    date: "Hace 1 semana",
    comment: "Instructores muy profesionales y metodología excelente. He mejorado muchísimo mi técnica.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    userName: "María Rodríguez",
    rating: 5,
    date: "Hace 2 semanas",
    comment: "Las clases grupales son geniales. Ambiente muy motivador y profesores atentos.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    userName: "Carlos López",
    rating: 4,
    date: "Hace 3 semanas",
    comment: "Muy buen nivel de enseñanza. Los entrenadores se adaptan perfectamente a tu nivel.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    userName: "Laura Martínez",
    rating: 5,
    date: "Hace 1 mes",
    comment: "Excelente relación calidad-precio. Las clases son dinámicas y se aprende rápido.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
]

export default function ClubPage() {
  const params = useParams()
  const clubId = parseInt(params.id as string)
  const club = mockClubs.find(c => c.id === clubId)

  if (!club) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Club no encontrado</h1>
          <Link href="/clubes" className="text-green-600 hover:text-green-700 font-semibold">
            Volver a clubes
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/clubes"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver a clubes</span>
          </Link>
        </div>
      </div>

      {/* Hero Section with Large Image */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Club Info */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="mb-6">
                <img
                  src={club.imageUrl}
                  alt={club.name}
                  className="w-full h-96 rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Club Name and Rating */}
              <div className="mb-6">
                {club.isFeatured && (
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-3">
                    ⭐ CLUB DESTACADO
                  </div>
                )}
                
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                  {club.name}
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(club.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-neutral-900">{club.rating}</span>
                  <span className="text-neutral-500">({club.reviewsCount} valoraciones)</span>
                </div>

                <div className="flex items-center text-neutral-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{club.location}, {club.city}</span>
                </div>

                <div className="flex items-center text-neutral-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{club.instructorsCount} instructores profesionales</span>
                </div>
              </div>

              {/* Gallery */}
              {club.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {club.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${club.name} - Imagen ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 sticky top-24 shadow-lg">
                <div className="text-center mb-6">
                  <p className="text-sm text-neutral-600 mb-2">Precio por clase</p>
                  <p className="text-4xl font-bold text-green-600">{club.pricePerClass}€</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                    <Calendar className="w-5 h-5" />
                    <span>Reservar Clase</span>
                  </button>
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-3 text-sm">
                  <div className="flex items-center text-neutral-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Confirmación instantánea</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Cancelación gratuita 24h antes</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    <span>Pago seguro</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
                  <h3 className="font-bold text-neutral-900 mb-3">Información de contacto</h3>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${club.contactPhone}`} className="hover:text-green-600">
                      {club.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${club.contactEmail}`} className="hover:text-green-600">
                      {club.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sobre el club</h2>
                <p className="text-neutral-700 leading-relaxed text-lg">{club.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Servicios e instalaciones</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {club.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="font-medium text-neutral-900 text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opening Hours */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Horario</h2>
                <div className="space-y-3">
                  {club.openingHours.map((hours, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                      <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-neutral-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Valoraciones ({club.reviewsCount})
                </h2>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-6 bg-neutral-50 rounded-xl">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-neutral-900">{review.userName}</h3>
                            <span className="text-sm text-neutral-500">{review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-neutral-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-neutral-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
