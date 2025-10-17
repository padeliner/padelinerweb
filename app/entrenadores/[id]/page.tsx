'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { 
  Star, 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin,
  Award,
  Users,
  Heart,
  ArrowLeft,
  MessageCircle,
  Check,
  X,
  Home,
  BookOpen,
  Target
} from 'lucide-react'

interface CoachProfile {
  id: string
  full_name: string
  avatar_url: string | null
  email: string
  role: string
  created_at: string
  coach_profile: {
    bio: string | null
    specialties: string[]
    experience_years: number
    certifications: string[]
    price_per_hour: number
    offers_home_service: boolean
    max_travel_distance: number
    available_hours: any
    city: string | null
    location_formatted: string | null
    country: string | null
    total_students: number
    total_sessions_completed: number
    average_rating: number | null
    total_reviews: number
    profile_visibility: string
    show_stats: boolean
    show_reviews: boolean
  } | null
  reviews: any[]
  recent_students: any[]
}

export default function CoachPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const coachId = params.id as string

  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [contacting, setContacting] = useState(false)

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
      setProfile(data)
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
      const res = await fetch(`/api/players/me/favorites/${coachId}`, {
        method
      })

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

  const handleContactar = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/entrenadores/${coachId}`)
      return
    }

    if (!profile?.id) {
      alert('Error: No se puede contactar con este entrenador')
      return
    }

    setContacting(true)
    try {
      const res = await fetch('/api/conversations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profile.id })
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
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando perfil...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            {error || 'Entrenador no encontrado'}
          </h1>
          <Link href="/entrenadores" className="text-primary-600 hover:underline">
            Ver todos los entrenadores
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const coachProfile = profile.coach_profile

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/entrenadores"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a entrenadores
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-primary-500"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-primary-100 flex items-center justify-center border-4 border-primary-500">
                  <Users className="w-16 h-16 text-primary-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    {profile.full_name}
                  </h1>
                  {coachProfile?.average_rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(coachProfile.average_rating!)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-neutral-700 font-semibold">
                        {coachProfile.average_rating.toFixed(1)}
                      </span>
                      <span className="text-neutral-500">
                        ({coachProfile.total_reviews} reseñas)
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
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
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleContactar}
                    disabled={contacting}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {contacting ? 'Contactando...' : 'Contactar'}
                  </button>
                </div>
              </div>

              {/* Location & Price */}
              <div className="flex flex-wrap gap-4 mb-4">
                {coachProfile?.location_formatted && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span>{coachProfile.location_formatted}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-primary-600 font-bold">
                  <span className="text-2xl">€{coachProfile?.price_per_hour || '-'}</span>
                  <span className="text-sm text-neutral-600">/hora</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {coachProfile?.experience_years && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {coachProfile.experience_years} años experiencia
                  </span>
                )}
                {coachProfile?.offers_home_service && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    Servicio a domicilio
                  </span>
                )}
                {coachProfile?.certifications && coachProfile.certifications.length > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Certificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {coachProfile?.bio && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Sobre mí</h2>
                <p className="text-neutral-700 whitespace-pre-wrap">{coachProfile.bio}</p>
              </div>
            )}

            {/* Especialidades */}
            {coachProfile?.specialties && Array.isArray(coachProfile.specialties) && coachProfile.specialties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  Especialidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {coachProfile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certificaciones */}
            {coachProfile?.certifications && Array.isArray(coachProfile.certifications) && coachProfile.certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  Certificaciones
                </h2>
                <div className="space-y-2">
                  {coachProfile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 text-neutral-700">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {coachProfile?.show_reviews !== false && profile.reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Reseñas</h2>
                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        {review.player?.avatar_url ? (
                          <img
                            src={review.player.avatar_url}
                            alt={review.player.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                            <Users className="w-5 h-5 text-neutral-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-900">
                            {review.player?.full_name || 'Alumno'}
                          </p>
                          <div className="flex items-center gap-2">
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
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-neutral-700 ml-13">{review.comment}</p>
                      )}
                      {review.positive_tags && review.positive_tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 ml-13">
                          {review.positive_tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            {coachProfile?.show_stats !== false && coachProfile && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Estadísticas</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Alumnos</span>
                    <span className="font-bold text-neutral-900">
                      {coachProfile.total_students || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Clases completadas</span>
                    <span className="font-bold text-neutral-900">
                      {coachProfile.total_sessions_completed || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Alumnos recientes */}
            {profile.recent_students.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Alumnos recientes</h2>
                <div className="grid grid-cols-3 gap-3">
                  {profile.recent_students.map((student: any, index: number) => (
                    <div key={index} className="text-center">
                      {student.avatar_url ? (
                        <img
                          src={student.avatar_url}
                          alt={student.full_name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-2">
                          <Users className="w-8 h-8 text-neutral-500" />
                        </div>
                      )}
                      <p className="text-xs text-neutral-600 truncate">{student.full_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
