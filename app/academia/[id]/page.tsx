'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { mockAcademies } from '@/lib/mock-data/academies'
import { Star, MapPin, Users, Clock, Phone, Mail, ArrowLeft, CheckCircle, Calendar, Shield, GraduationCap } from 'lucide-react'

const mockReviews = [
  { id: 1, userName: "Javier Moreno", rating: 5, date: "Hace 1 semana", comment: "Mi hijo ha mejorado muchísimo desde que empezó. Excelentes entrenadores.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: 2, userName: "Carmen López", rating: 5, date: "Hace 2 semanas", comment: "Academia muy profesional. El programa de adultos es perfecto para principiantes.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: 3, userName: "Roberto Díaz", rating: 4, date: "Hace 3 semanas", comment: "Muy buenos entrenadores y ambiente familiar. Recomendable 100%.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
]

export default function AcademiaPage() {
  const params = useParams()
  const academyId = parseInt(params.id as string)
  const academy = mockAcademies.find(a => a.id === academyId)

  if (!academy) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Academia no encontrada</h1>
          <Link href="/academias" className="text-blue-600 hover:text-blue-700 font-semibold">Volver a academias</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/academias" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver a academias</span>
          </Link>
        </div>
      </div>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img src={academy.imageUrl} alt={academy.name} className="w-full h-96 rounded-2xl object-cover shadow-lg" />
              </div>

              <div className="mb-6">
                {academy.isFeatured && (
                  <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-3">
                    ⭐ ACADEMIA DESTACADA
                  </div>
                )}
                
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">{academy.name}</h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(academy.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-neutral-900">{academy.rating}</span>
                  <span className="text-neutral-500">({academy.reviewsCount} valoraciones)</span>
                </div>

                <div className="flex items-center text-neutral-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{academy.location}, {academy.city}</span>
                </div>

                <div className="flex items-center space-x-6 text-neutral-600 mb-6">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="font-semibold">{academy.coachesCount} entrenadores</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    <span className="font-semibold">{academy.studentCapacity} plazas</span>
                  </div>
                </div>
              </div>

              {academy.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {academy.images.map((image, idx) => (
                      <img key={idx} src={image} alt={`${academy.name} - ${idx + 1}`} className="w-full h-48 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 sticky top-24 shadow-lg">
                <div className="text-center mb-6">
                  <p className="text-sm text-neutral-600 mb-2">Precio mensual</p>
                  <p className="text-4xl font-bold text-blue-600">{academy.pricePerMonth}€</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                    <Calendar className="w-5 h-5" />
                    <span>Solicitar Información</span>
                  </button>
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-3 text-sm">
                  <div className="flex items-center text-neutral-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Primera clase gratis</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Sin matrícula</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Garantía de satisfacción</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
                  <h3 className="font-bold text-neutral-900 mb-3">Contacto</h3>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${academy.contactPhone}`} className="hover:text-blue-600">{academy.contactPhone}</a>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${academy.contactEmail}`} className="hover:text-blue-600">{academy.contactEmail}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sobre la academia</h2>
                <p className="text-neutral-700 leading-relaxed text-lg">{academy.description}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Programas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {academy.programs.map((program, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-neutral-900">{program}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Horario</h2>
                <div className="space-y-3">
                  {academy.schedule.map((hours, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-neutral-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Valoraciones ({academy.reviewsCount})</h2>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-6 bg-neutral-50 rounded-xl">
                      <div className="flex items-start space-x-4">
                        <img src={review.avatar} alt={review.userName} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-neutral-900">{review.userName}</h3>
                            <span className="text-sm text-neutral-500">{review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
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
