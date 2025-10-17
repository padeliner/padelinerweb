'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { 
  Star, 
  Calendar, 
  MapPin,
  Award,
  Heart,
  ArrowLeft,
  MessageCircle,
  CheckCircle,
  Home as HomeIcon,
  Languages
} from 'lucide-react'

export default function CoachPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const coachId = params.id as string

  const [coach, setCoach] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [contacting, setContacting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (coachId) {
      loadCoachData()
      if (isAuthenticated) {
        checkFavoriteStatus()
      }
    }
  }, [coachId, isAuthenticated])

  const loadCoachData = async () => {
    try {
      const res = await fetch(`/api/coaches/${coachId}`)
      if (!res.ok) {
        throw new Error('Entrenador no encontrado')
      }
      const data = await res.json()
      setCoach(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/players/me/favorites/${coachId}`)
      if (res.ok) {
        const data = await res.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/entrenadores/${coachId}`)
      return
    }

    setFavoriteLoading(true)
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await fetch(`/api/players/me/favorites/${coachId}`, { method })

      if (res.ok) {
        setIsFavorite(!isFavorite)
      } else {
        const data = await res.json()
        alert(data.error || 'Error al actualizar favoritos')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Error al actualizar favoritos')
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleReservar = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/entrenadores/${coachId}`)
      return
    }
    router.push(`/reservar/${coachId}`)
  }

  const handleContactar = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/entrenadores/${coachId}`)
      return
    }

    setContacting(true)
    try {
      const res = await fetch('/api/conversations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: coach.id })
      })

      const data = await res.json()

      if (res.ok && data.conversationId) {
        router.push(`/mensajes?conversation=${data.conversationId}`)
      } else {
        alert('Error al iniciar conversación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al iniciar conversación')
    } finally {
      setContacting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !coach) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              {error || 'Entrenador no encontrado'}
            </h1>
            <Link href="/entrenadores" className="text-primary-600 hover:underline font-semibold">
              Ver todos los entrenadores
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const coachProfile = coach.coach_profile
  const images = coach.images || []
  const mainImage = coach.avatar_url || (images.length > 0 ? images[0] : null)

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/entrenadores"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Volver a entrenadores</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={mainImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(coach.full_name)}&size=200&background=16a34a&color=fff&bold=true`}
                        alt={coach.full_name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-primary-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                            {coach.full_name}
                          </h1>
                          {coachProfile?.average_rating > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < Math.round(coachProfile.average_rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-neutral-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-lg font-bold text-neutral-900">
                                {coachProfile.average_rating.toFixed(1)}
                              </span>
                              <span className="text-neutral-500">
                                ({coachProfile.total_reviews} reseñas)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={toggleFavorite}
                          disabled={favoriteLoading}
                          className={`p-3 rounded-xl transition-all ${
                            isFavorite
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4">
                        {coachProfile?.location && (
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            <span>{coachProfile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-neutral-600" />
                          <span className="text-neutral-600">{coachProfile?.experience_years} años experiencia</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="inline-flex items-baseline gap-2 px-4 py-2 bg-primary-50 rounded-xl mb-4">
                        <span className="text-3xl font-bold text-primary-600">
                          €{coachProfile?.price_per_hour}
                        </span>
                        <span className="text-neutral-600">/hora</span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {coachProfile?.is_featured && (
                          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold flex items-center gap-1">
                            ⭐ DESTACADO
                          </span>
                        )}
                        {coachProfile?.offers_home_service && (
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                            <HomeIcon className="w-4 h-4" />
                            Servicio a domicilio
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 md:px-8 pb-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleReservar}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Reservar Clase
                  </button>
                  <button
                    onClick={handleContactar}
                    disabled={contacting}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-900 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {contacting ? 'Contactando...' : 'Contactar'}
                  </button>
                </div>
              </div>

              {/* Bio */}
              {coachProfile?.bio && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sobre mí</h2>
                  <p className="text-neutral-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {coachProfile.bio}
                  </p>
                </div>
              )}

              {/* Galería de Imágenes */}
              {images.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Galería</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image: string, index: number) => (
                      <div key={index} className="relative group cursor-pointer overflow-hidden rounded-xl">
                        <img
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {coach.reviews && coach.reviews.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Reseñas</h2>
                  <div className="space-y-6">
                    {coach.reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.player?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.player?.full_name || 'Usuario')}&size=48`}
                            alt={review.player?.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-bold text-neutral-900">
                                {review.player?.full_name || 'Alumno'}
                              </p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-neutral-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-neutral-500">
                                {new Date(review.created_at).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-neutral-700 mb-2">{review.comment}</p>
                            )}
                            {review.positive_tags && review.positive_tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {review.positive_tags.map((tag: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Especialidades */}
              {coachProfile?.specialties && coachProfile.specialties.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {coachProfile.specialties.map((spec: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-medium text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificaciones */}
              {coachProfile?.certifications && coachProfile.certifications.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-600" />
                    Certificaciones
                  </h3>
                  <ul className="space-y-2">
                    {coachProfile.certifications.map((cert: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-neutral-700">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Idiomas */}
              {coachProfile?.languages && coachProfile.languages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-primary-600" />
                    Idiomas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coachProfile.languages.map((lang: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disponibilidad */}
              {coachProfile?.available_hours && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">Disponibilidad</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-neutral-600">
                      Consulta horarios disponibles al reservar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
