'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { mockCoaches, Coach } from '@/lib/mock-data/coaches'
import { 
  Star, 
  MapPin, 
  Award, 
  Clock, 
  Languages, 
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Calendar,
  Shield
} from 'lucide-react'

// Mock reviews
const mockReviews = [
  {
    id: 1,
    userName: "María González",
    rating: 5,
    date: "Hace 2 semanas",
    comment: "Excelente entrenador, muy profesional y atento. He mejorado mucho mi técnica en solo 2 meses.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    userName: "Pedro Martínez",
    rating: 5,
    date: "Hace 1 mes",
    comment: "Las clases son muy dinámicas y divertidas. Totalmente recomendable para todos los niveles.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    userName: "Laura Sánchez",
    rating: 4,
    date: "Hace 1 mes",
    comment: "Gran profesional. Me ha ayudado mucho a mejorar mi saque y mi juego en red.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    userName: "Carlos Ruiz",
    rating: 5,
    date: "Hace 2 meses",
    comment: "Muy paciente y con un método de enseñanza excelente. 100% recomendado.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  }
]

export default function EntrenadorPage() {
  const params = useParams()
  const coachId = parseInt(params.id as string)
  const coach = mockCoaches.find(c => c.id === coachId)

  if (!coach) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Entrenador no encontrado</h1>
          <Link href="/entrenadores" className="text-primary-600 hover:text-primary-700 font-semibold">
            Volver a entrenadores
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
            href="/entrenadores"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver a entrenadores</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Coach Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={coach.imageUrl}
                    alt={coach.name}
                    className="w-48 h-48 rounded-2xl object-cover shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  {coach.isFeatured && (
                    <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-3">
                      ⭐ ENTRENADOR DESTACADO
                    </div>
                  )}
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                    {coach.name}
                  </h1>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(coach.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-neutral-900">{coach.rating}</span>
                    <span className="text-neutral-500">({coach.reviewsCount} valoraciones)</span>
                  </div>

                  <div className="flex items-center text-neutral-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{coach.location}, {coach.city}</span>
                  </div>

                  <div className="flex items-center text-neutral-600 mb-6">
                    <Award className="w-5 h-5 mr-2" />
                    <span>{coach.experience} años de experiencia</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 sticky top-24 shadow-lg">
                <div className="text-center mb-6">
                  <p className="text-sm text-neutral-600 mb-2">Precio por hora</p>
                  <p className="text-4xl font-bold text-primary-600">{coach.pricePerHour}€</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                    <Calendar className="w-5 h-5" />
                    <span>Reservar Clase</span>
                  </button>
                  
                  <button className="w-full py-3.5 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Contactar</span>
                  </button>
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-3 text-sm">
                  {coach.offersHomeService && (
                    <div className="flex items-center text-neutral-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>Disponibilidad de desplazamiento</span>
                    </div>
                  )}
                  <div className="flex items-center text-neutral-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Respuesta en menos de 2h</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sobre mí</h2>
                <p className="text-neutral-700 leading-relaxed text-lg">{coach.bio}</p>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Certificaciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coach.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                      <Award className="w-6 h-6 text-primary-600 flex-shrink-0" />
                      <span className="font-medium text-neutral-900">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Idiomas</h2>
                <div className="flex flex-wrap gap-3">
                  {coach.languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center space-x-2 px-4 py-2 bg-neutral-50 rounded-lg">
                      <Languages className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-neutral-900">{lang}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Disponibilidad</h2>
                <div className="space-y-3">
                  {coach.availability.map((slot, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                      <Clock className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-neutral-900">{slot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {coach.images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Galería</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {coach.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${coach.name} - Imagen ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Valoraciones ({coach.reviewsCount})
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
