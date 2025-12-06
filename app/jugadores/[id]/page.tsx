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
  Flame, 
  TrendingUp,
  MapPin,
  Award,
  Users,
  ChevronRight,
  Target,
  LineChart,
  Heart,
  ArrowLeft,
  MessageCircle
} from 'lucide-react'

interface PlayerProfile {
  user_id: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  skill_level: string | null
  years_playing: number
  favorite_position: string | null
  preferred_training_type: any[]
  goals: string[]
  city: string | null
  birth_date: string | null
  location_formatted: string | null
  country: string | null
  total_sessions_completed: number
  total_hours_trained: number
  current_streak_days: number
  longest_streak_days: number
  profile_visibility: string
  show_stats: boolean
  show_reviews: boolean
  show_coaches: boolean
  average_rating: number | null
  total_reviews: number
  achievements_unlocked: number
  favorite_coaches: any[]
  top_coach: any
  recent_progress: any[]
  public_goals: any[]
  user: {
    full_name: string
    avatar_url: string | null
    created_at: string
  }
}

interface Review {
  id: string
  rating: number
  comment: string
  positive_tags: string[]
  created_at: string
  coach: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

interface Achievement {
  id: string
  unlocked_at: string
  achievement: {
    name: string
    description: string
    icon: string
    category: string
  }
}

export default function PlayerPublicProfile() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const playerId = params.id as string
  
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contacting, setContacting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const loadPlayerData = async () => {
    try {
      // Cargar perfil
      const profileRes = await fetch(`/api/players/${playerId}`)
      if (!profileRes.ok) {
        throw new Error('Perfil no encontrado')
      }
      const profileData = await profileRes.json()
      setProfile(profileData)

      // Cargar reviews si está habilitado
      if (profileData.show_reviews) {
        const reviewsRes = await fetch(`/api/players/${playerId}/reviews?limit=5`)
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData.reviews || [])
      }

      // Cargar logros
      const achievementsRes = await fetch(`/api/players/${playerId}/achievements`)
      const achievementsData = await achievementsRes.json()
      setAchievements(achievementsData.unlocked || [])

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/players/favorites/${playerId}`)
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
      router.push(`/login?redirect=/jugadores/${playerId}`)
      return
    }

    setFavoriteLoading(true)
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await fetch(`/api/players/favorites/${playerId}`, {
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
      router.push(`/login?redirect=/jugadores/${playerId}`)
      return
    }

    if (!profile?.user_id) {
      alert('Error: No se puede contactar con este jugador')
      return
    }

    setContacting(true)
    try {
      const res = await fetch('/api/conversations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profile.user_id })
      })

      const data = await res.json()

      if (res.ok && data.conversationId) {
        // Redirigir a mensajes con la conversación abierta automáticamente
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

  useEffect(() => {
    loadPlayerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId])

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Jugador no encontrado</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const skillLevelColors = {
    principiante: 'bg-primary-100 text-primary-700',
    intermedio: 'bg-primary-100 text-primary-700',
    avanzado: 'bg-primary-100 text-primary-700',
    profesional: 'bg-primary-100 text-primary-700'
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver al inicio</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Player Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={profile.user.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
                    alt={profile.display_name}
                    className="w-48 h-48 rounded-2xl object-cover shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  {profile.skill_level && (
                    <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-bold rounded-full mb-3 uppercase">
                      {profile.skill_level}
                    </div>
                  )}
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                    {profile.display_name || profile.user.full_name}
                  </h1>

                  {profile.average_rating && (
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(profile.average_rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-neutral-900">{profile.average_rating.toFixed(1)}</span>
                      <span className="text-neutral-500">({profile.total_reviews} valoraciones)</span>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {(profile.city || profile.country) && (
                      <div className="flex items-center text-neutral-600">
                        <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>
                          {profile.city}
                          {profile.country && profile.city && ', '}
                          {profile.country}
                        </span>
                      </div>
                    )}

                    {profile.birth_date && (
                      <div className="flex items-center text-neutral-600">
                        <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{getAge(profile.birth_date)} años • {getPadelCategory(profile.birth_date)}</span>
                      </div>
                    )}

                    {profile.years_playing > 0 && (
                      <div className="flex items-center text-neutral-600">
                        <Award className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{profile.years_playing} {profile.years_playing === 1 ? 'año' : 'años'} jugando</span>
                      </div>
                    )}
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap gap-2">
                    {profile.favorite_position && (
                      <span className="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg capitalize">
                        Posición: {profile.favorite_position}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Card */}
            {profile.show_stats && (
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 sticky top-24 shadow-lg">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">Estadísticas</h3>
                  
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-neutral-200">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Trophy className="w-5 h-5 text-primary-600" />
                        <span className="text-sm text-neutral-600">Sesiones</span>
                      </div>
                      <p className="text-2xl font-bold text-primary-600">{profile.total_sessions_completed}</p>
                    </div>
                    
                    <div className="text-center pb-4 border-b border-neutral-200">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Clock className="w-5 h-5 text-primary-600" />
                        <span className="text-sm text-neutral-600">Horas entrenadas</span>
                      </div>
                      <p className="text-2xl font-bold text-primary-600">{Math.round(profile.total_hours_trained)}h</p>
                    </div>
                    
                    <div className="text-center pb-4 border-b border-neutral-200">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Flame className="w-5 h-5 text-primary-600" />
                        <span className="text-sm text-neutral-600">Racha actual</span>
                      </div>
                      <p className="text-2xl font-bold text-primary-600">{profile.current_streak_days} días</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Award className="w-5 h-5 text-primary-600" />
                        <span className="text-sm text-neutral-600">Logros</span>
                      </div>
                      <p className="text-2xl font-bold text-primary-600">{profile.achievements_unlocked}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bio & Content Section */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              {profile.bio && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sobre mí</h2>
                  <p className="text-neutral-700 leading-relaxed text-lg">{profile.bio}</p>
                </div>
              )}

              {/* Entrenador Top */}
              {profile.top_coach && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Entrenador Principal</h2>
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                      {profile.top_coach.coach.avatar_url ? (
                        <img src={profile.top_coach.coach.avatar_url} alt={profile.top_coach.coach.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-2xl">👤</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-neutral-900">{profile.top_coach.coach.full_name}</p>
                      <p className="text-sm text-neutral-600">
                        {profile.top_coach.count} {profile.top_coach.count === 1 ? 'sesión completada' : 'sesiones completadas'}
                      </p>
                    </div>
                    <a
                      href={`/entrenador/${profile.top_coach.coach.id}`}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Ver perfil
                    </a>
                  </div>
                </div>
              )}

              {/* Objetivos Públicos */}
              {profile.public_goals && profile.public_goals.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Objetivos Actuales</h2>
                  <div className="space-y-4">
                    {profile.public_goals.map((goal: any) => (
                      <div key={goal.id} className="p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-sm text-neutral-600 mt-1">{goal.description}</p>
                          )}
                          {goal.category && (
                            <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                              {goal.category}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-primary-600 ml-4">
                          {goal.progress_percentage}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-neutral-600">
                        <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                        {goal.target_date && (
                          <span>Meta: {new Date(goal.target_date).toLocaleDateString('es-ES')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              )}

              {/* Progreso Reciente */}
              {profile.recent_progress && profile.recent_progress.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Progreso Reciente</h2>
                  <div className="space-y-4">
                    {profile.recent_progress.map((progress: any) => (
                      <div key={progress.id} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                        {progress.coach?.avatar_url ? (
                          <img src={progress.coach.avatar_url} alt={progress.coach.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">👤</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm text-neutral-900 capitalize">{progress.skill_area}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-600">{progress.rating_before}</span>
                            <span className="text-neutral-400">→</span>
                            <span className="text-lg font-bold text-green-600">{progress.rating_after}</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-600">{progress.coach?.full_name}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(progress.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-green-600">
                        +{(progress.rating_after - progress.rating_before).toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              )}

              {/* Objetivos antiguos (del campo goals del perfil) */}
              {profile.goals && profile.goals.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Objetivos</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {profile.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                        <ChevronRight className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <span className="text-neutral-900 font-medium">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {profile.show_reviews && reviews.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Valoraciones de Entrenadores ({reviews.length})
                  </h2>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-6 bg-neutral-50 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                          {review.coach.avatar_url ? (
                            <img src={review.coach.avatar_url} alt={review.coach.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">👤</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-neutral-900">{review.coach.full_name}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-neutral-700 mb-2">{review.comment}</p>
                          )}
                          {review.positive_tags && review.positive_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {review.positive_tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(review.created_at).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Entrenadores Favoritos */}
              {profile.favorite_coaches && profile.favorite_coaches.length > 0 && (
                <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4">Entrenadores Favoritos</h2>
                <div className="space-y-3">
                  {profile.favorite_coaches.map((fav: any) => (
                    <a
                      key={fav.coach_id}
                      href={`/entrenador/${fav.coach_id}`}
                      className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                        {fav.coach?.avatar_url ? (
                          <img src={fav.coach.avatar_url} alt={fav.coach.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">👤</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-neutral-900 truncate group-hover:text-primary-600">
                          {fav.coach?.full_name}
                        </p>
                        <p className="text-xs text-neutral-600">
                          Favorito desde {new Date(fav.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                    </a>
                  ))}
                </div>
                </div>
              )}

              {/* Información del jugador */}
              <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Información</h2>
                <div className="space-y-3 text-sm">
                  {profile.birth_date && (
                    <div>
                      <p className="text-neutral-500 mb-1">Edad y Categoría</p>
                      <p className="font-medium text-neutral-900">
                        {getAge(profile.birth_date)} años
                      </p>
                      <p className="text-primary-600 font-semibold">
                        {getPadelCategory(profile.birth_date)}
                      </p>
                    </div>
                  )}

                  {(profile.location_formatted || profile.city) && (
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-neutral-500 mb-1">Ubicación</p>
                      <p className="font-medium text-neutral-900">
                        {profile.location_formatted || `${profile.city}${profile.country ? ', ' + profile.country : ''}`}
                      </p>
                    </div>
                  )}

                  {profile.favorite_position && (
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-neutral-500 mb-1">Posición favorita</p>
                      <p className="font-medium text-neutral-900 capitalize">
                        {profile.favorite_position}
                      </p>
                    </div>
                  )}

                  {profile.years_playing > 0 && (
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-neutral-500 mb-1">Experiencia</p>
                      <p className="font-medium text-neutral-900">
                        {profile.years_playing} {profile.years_playing === 1 ? 'año' : 'años'} jugando
                      </p>
                    </div>
                  )}

                  {profile.skill_level && (
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-neutral-500 mb-1">Nivel</p>
                      <p className="font-medium text-neutral-900 capitalize">
                        {profile.skill_level}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logros recientes */}
              {achievements.length > 0 && (
                <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-lg font-bold text-neutral-900 mb-4">Logros Recientes</h2>
                  <div className="space-y-3">
                    {achievements.slice(0, 6).map((unlock) => (
                      <div key={unlock.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="text-3xl">{unlock.achievement.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-neutral-900 truncate">
                            {unlock.achievement.name}
                          </p>
                          <p className="text-xs text-neutral-600 truncate">
                            {unlock.achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {achievements.length > 6 && (
                    <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-semibold">
                      Ver todos ({achievements.length})
                    </button>
                  )}
                </div>
              )}

              {/* Info adicional */}
              <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">¿Entrenar juntos?</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Contacta con {profile.display_name || 'este jugador'} para coordinar una sesión.
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleContactar}
                    disabled={contacting}
                    className="w-full bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{contacting ? 'Abriendo chat...' : 'Enviar mensaje'}</span>
                  </button>

                  <button 
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isFavorite 
                        ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100' 
                        : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                    <span>
                      {favoriteLoading ? 'Actualizando...' : isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    </span>
                  </button>
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

// Función para calcular la edad
function getAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  const age = today.getFullYear() - birth.getFullYear() - 
    (today.getMonth() < birth.getMonth() || 
     (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0)
  return age
}

// Función para calcular la categoría de pádel según la edad
function getPadelCategory(birthDate: string): string {
  const age = getAge(birthDate)

  if (age < 10) return 'Benjamín'
  if (age < 12) return 'Alevín'
  if (age < 14) return 'Infantil'
  if (age < 16) return 'Cadete'
  if (age < 18) return 'Juvenil'
  if (age < 23) return 'Sub-23'
  if (age < 35) return 'Absoluta'
  if (age < 40) return 'Veterano +35'
  if (age < 45) return 'Veterano +40'
  if (age < 50) return 'Veterano +45'
  if (age < 55) return 'Veterano +50'
  return 'Veterano +55'
}
