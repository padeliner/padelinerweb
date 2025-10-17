'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  Search, 
  Calendar, 
  User, 
  LogOut,
  Trophy,
  Clock,
  Flame,
  Award,
  Settings,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Edit,
  Shield,
  ExternalLink,
  Target,
  LineChart,
  Star,
  Bell,
  Trash2,
  ShoppingBag,
  Package,
  FileText,
  MapPin as MapPinIcon,
  CreditCard,
  Home
} from 'lucide-react'
import NotificationBell from '@/components/NotificationBell'
import { LocationSearch, LocationData } from '@/components/LocationSearch'
import { AvatarUpload } from '@/components/AvatarUpload'

interface PlayerProfile {
  user_id: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  skill_level: string | null
  total_sessions_completed: number
  total_hours_trained: number
  current_streak_days: number
  longest_streak_days: number
  profile_visibility: string
  show_stats: boolean
  show_reviews: boolean
  show_coaches: boolean
  stats: {
    average_rating: number | null
    total_reviews: number
    public_reviews: number
    achievements_unlocked: number
    total_sessions: number
  }
}

interface Session {
  id: string
  start_time: string
  end_time: string
  status: string
  service_id: string
  price: number
  coach: {
    id: string
    full_name: string
    avatar_url: string | null
    email: string
    phone: string | null
  }
}

export default function DashboardJugador() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [sessionCounts, setSessionCounts] = useState({ upcoming: 0, completed: 0, cancelled: 0 })
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'profile' | 'privacy' | 'goals' | 'progress' | 'favorites' | 'shop'>('overview')
  const [sessionFilter, setSessionFilter] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessions(sessionFilter)
    }
  }, [sessionFilter])

  const loadData = async () => {
    try {
      // Verificar autenticación
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
        return
      }

      // Obtener datos del usuario
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(userData)

      // Cargar perfil completo
      const profileRes = await fetch('/api/players/me')
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }

      // Cargar sesiones próximas
      loadSessions('upcoming')

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSessions = async (filter: 'upcoming' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/players/me/sessions?status=${filter}&limit=10`)
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions)
        setSessionCounts(data.counts)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpdateProfile = async (updates: Partial<PlayerProfile>) => {
    try {
      const res = await fetch('/api/players/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (res.ok) {
        const updated = await res.json()
        setProfile({ ...profile!, ...updated })
        alert('Perfil actualizado correctamente')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar perfil')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Mi Dashboard</h1>
              <p className="text-sm text-neutral-600">
                Bienvenido, {profile?.display_name || user?.full_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Inicio</span>
              </a>
              <NotificationBell />
              <a
                href={`/jugadores/${user?.id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Ver mi perfil</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={<TrendingUp className="w-4 h-4" />}
              label="Resumen"
            />
            <TabButton
              active={activeTab === 'sessions'}
              onClick={() => setActiveTab('sessions')}
              icon={<Calendar className="w-4 h-4" />}
              label="Mis Clases"
            />
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              icon={<Edit className="w-4 h-4" />}
              label="Editar Perfil"
            />
            <TabButton
              active={activeTab === 'privacy'}
              onClick={() => setActiveTab('privacy')}
              icon={<Shield className="w-4 h-4" />}
              label="Privacidad"
            />
            <TabButton
              active={activeTab === 'goals'}
              onClick={() => setActiveTab('goals')}
              icon={<Target className="w-4 h-4" />}
              label="Mis Objetivos"
            />
            <TabButton
              active={activeTab === 'progress'}
              onClick={() => setActiveTab('progress')}
              icon={<LineChart className="w-4 h-4" />}
              label="Mi Progreso"
            />
            <TabButton
              active={activeTab === 'favorites'}
              onClick={() => setActiveTab('favorites')}
              icon={<Star className="w-4 h-4" />}
              label="Favoritos"
            />
            <TabButton
              active={activeTab === 'shop'}
              onClick={() => setActiveTab('shop')}
              icon={<ShoppingBag className="w-4 h-4" />}
              label="Mi Tienda"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab profile={profile} sessions={sessions} counts={sessionCounts} />
        )}
        {activeTab === 'sessions' && (
          <SessionsTab 
            sessions={sessions} 
            filter={sessionFilter} 
            setFilter={setSessionFilter}
            counts={sessionCounts}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileTab profile={profile} user={user} onUpdate={handleUpdateProfile} />
        )}
        {activeTab === 'privacy' && (
          <PrivacyTab profile={profile} onUpdate={handleUpdateProfile} />
        )}
        {activeTab === 'goals' && (
          <GoalsTab />
        )}
        {activeTab === 'progress' && (
          <ProgressTab />
        )}
        {activeTab === 'favorites' && (
          <FavoritesTab />
        )}
        {activeTab === 'shop' && (
          <ShopTab />
        )}
      </main>
    </div>
  )
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
        active 
          ? 'bg-primary-500 text-white' 
          : 'bg-white text-neutral-600 hover:bg-neutral-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// Overview Tab
function OverviewTab({ profile, sessions, counts }: any) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="w-6 h-6" />}
          label="Sesiones"
          value={profile?.total_sessions_completed || 0}
          color="bg-primary-100 text-primary-600"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Horas"
          value={`${Math.round(profile?.total_hours_trained || 0)}h`}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Racha"
          value={`${profile?.current_streak_days || 0} días`}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Logros"
          value={profile?.stats?.achievements_unlocked || 0}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Próximas clases */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">Próximas Clases</h2>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
            {counts.upcoming} próximas
          </span>
        </div>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 3).map((session: any) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-8">No tienes clases programadas</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
          icon={<Search className="w-8 h-8" />}
          title="Buscar Entrenador"
          description="Encuentra el entrenador perfecto para ti"
          href="/entrenadores"
          color="bg-primary-500"
        />
        <ActionCard
          icon={<Calendar className="w-8 h-8" />}
          title="Ver Todas Mis Clases"
          description="Gestiona todas tus sesiones"
          onClick={() => {}}
          color="bg-green-500"
        />
      </div>
    </div>
  )
}

// Sessions Tab
function SessionsTab({ sessions, filter, setFilter, counts }: any) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <FilterButton
          active={filter === 'upcoming'}
          onClick={() => setFilter('upcoming')}
          label="Próximas"
          count={counts.upcoming}
          color="text-blue-600"
        />
        <FilterButton
          active={filter === 'completed'}
          onClick={() => setFilter('completed')}
          label="Completadas"
          count={counts.completed}
          color="text-green-600"
        />
        <FilterButton
          active={filter === 'cancelled'}
          onClick={() => setFilter('cancelled')}
          label="Canceladas"
          count={counts.cancelled}
          color="text-red-600"
        />
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <SessionCard key={session.id} session={session} detailed />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-2">No hay sesiones {filter === 'upcoming' ? 'próximas' : filter === 'completed' ? 'completadas' : 'canceladas'}</p>
            <a href="/entrenadores" className="text-primary-600 hover:underline">
              Buscar entrenadores
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// Profile Tab
function ProfileTab({ profile, user, onUpdate }: any) {
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    skill_level: profile?.skill_level || 'principiante',
    years_playing: profile?.years_playing || 0,
    favorite_position: profile?.favorite_position || 'derecha',
    goals: (profile?.goals || []).join('\n')
  })
  
  const [contactData, setContactData] = useState({
    phone: profile?.user?.phone || ''
  })
  
  const [publicData, setPublicData] = useState({
    city: profile?.city || '',
    location_formatted: profile?.location_formatted || '',
    location_lat: profile?.location_lat || null,
    location_lng: profile?.location_lng || null,
    country: profile?.country || 'España',
    birth_date: profile?.birth_date || ''
  })

  const handleLocationSelect = (location: LocationData) => {
    setPublicData({
      ...publicData,
      city: location.city,
      location_formatted: location.formatted,
      location_lat: location.lat,
      location_lng: location.lng,
      country: location.country
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...formData,
      ...publicData,
      goals: formData.goals.split('\n').filter((g: any) => g.trim())
    })
  }

  const handleAvatarUpload = (url: string) => {
    onUpdate({ avatar_url: url })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Editar Perfil</h2>
        
        {/* Avatar Upload */}
        <div className="mb-8 pb-8 border-b border-neutral-200">
          <AvatarUpload
            currentAvatar={user?.avatar_url}
            onUploadComplete={handleAvatarUpload}
            userId={profile?.user_id || ''}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nombre para mostrar
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Biografía
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nivel
              </label>
              <select
                value={formData.skill_level}
                onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="profesional">Profesional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Años jugando
              </label>
              <input
                type="number"
                value={formData.years_playing}
                onChange={(e) => setFormData({ ...formData, years_playing: parseInt(e.target.value) })}
                min="0"
                className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Posición favorita
            </label>
            <select
              value={formData.favorite_position}
              onChange={(e) => setFormData({ ...formData, favorite_position: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="derecha">Derecha</option>
              <option value="izquierda">Izquierda</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Objetivos (uno por línea)
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Mejorar mi revés&#10;Ganar mi primer torneo&#10;Jugar 3 veces por semana"
            />
          </div>

          {/* Ubicación con Google Places */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ubicación
            </label>
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Buscar tu ubicación..."
              value={publicData.location_formatted || publicData.city}
            />
            <p className="text-xs text-neutral-500 mt-1">
              Usa el autocompletado o el botón de GPS para encontrar tu ubicación
            </p>
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={publicData.birth_date}
              onChange={(e) => setPublicData({ ...publicData, birth_date: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Guardar Cambios
          </button>
        </form>
      </div>

      {/* Información de Contacto (Privada) */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Información de Contacto</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Esta información es <span className="font-semibold text-red-600">privada</span> y solo visible para ti y administradores
            </p>
          </div>
          <Shield className="w-8 h-8 text-red-500" />
        </div>

        <div className="space-y-6">
          {/* Email (solo lectura) */}
          <div>
            <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              value={profile?.user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-600 cursor-not-allowed"
            />
            <p className="text-xs text-neutral-500 mt-1">
              El email no se puede modificar
            </p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Teléfono
            </label>
            <input
              type="tel"
              value={contactData.phone}
              onChange={(e) => setContactData({ phone: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+34 600 123 456"
            />
          </div>

          <button
            onClick={async () => {
              // Guardar datos de contacto
              try {
                const res = await fetch('/api/players/me', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(contactData)
                })
                if (res.ok) {
                  alert('Información de contacto actualizada')
                } else {
                  alert('Error al actualizar')
                }
              } catch (error) {
                alert('Error al actualizar')
              }
            }}
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Guardar Información de Contacto
          </button>
        </div>
      </div>
    </div>
  )
}

// Privacy Tab
function PrivacyTab({ profile, onUpdate }: any) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Configuración de Privacidad</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Visibilidad del perfil
            </label>
            <select
              value={profile?.profile_visibility || 'public'}
              onChange={(e) => onUpdate({ profile_visibility: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="public">Público - Visible para todos</option>
              <option value="coaches_only">Solo Entrenadores - Solo entrenadores pueden ver</option>
              <option value="private">Privado - Solo yo puedo ver</option>
            </select>
            <p className="text-xs text-neutral-500 mt-2">
              Controla quién puede ver tu perfil completo
            </p>
          </div>

          <div className="space-y-4">
            <ToggleOption
              label="Mostrar estadísticas"
              description="Sesiones, horas, rachas visibles en tu perfil"
              checked={profile?.show_stats !== false}
              onChange={(checked) => onUpdate({ show_stats: checked })}
            />
            <ToggleOption
              label="Mostrar reviews"
              description="Las reviews de entrenadores serán visibles"
              checked={profile?.show_reviews !== false}
              onChange={(checked) => onUpdate({ show_reviews: checked })}
            />
            <ToggleOption
              label="Mostrar entrenadores"
              description="Lista de entrenadores con los que has trabajado"
              checked={profile?.show_coaches !== false}
              onChange={(checked) => onUpdate({ show_coaches: checked })}
            />
          </div>
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <p className="text-sm text-primary-800">
          <strong>💡 Tip:</strong> Un perfil público con buenas reviews te ayuda a conseguir mejores entrenadores y a que otros jugadores te conozcan.
        </p>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-600">{label}</p>
    </div>
  )
}

function SessionCard({ session, detailed = false }: any) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  return (
    <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
        {session.coach.avatar_url ? (
          <img src={session.coach.avatar_url} alt={session.coach.full_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">👤</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900">{session.coach.full_name}</p>
        <p className="text-sm text-neutral-600">
          {new Date(session.start_time).toLocaleDateString('es-ES', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[session.status as keyof typeof statusColors] || 'bg-neutral-100'}`}>
        {session.status}
      </span>
    </div>
  )
}

function ActionCard({ icon, title, description, href, onClick, color }: any) {
  const content = (
    <div className={`${color} hover:opacity-90 text-white rounded-2xl p-6 transition-all cursor-pointer h-full flex flex-col`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  )

  return href ? <a href={href}>{content}</a> : <div onClick={onClick}>{content}</div>
}

function FilterButton({ active, onClick, label, count, color }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
        active 
          ? 'bg-white shadow-md ' + color
          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
      }`}
    >
      {label} <span className="ml-1">({count})</span>
    </button>
  )
}

function ToggleOption({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary-500' : 'bg-neutral-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  )
}

// Goals Tab
function GoalsTab() {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [showCompleted])

  const loadGoals = async () => {
    try {
      const res = await fetch(`/api/players/me/goals?completed=${showCompleted}`)
      if (res.ok) {
        const data = await res.json()
        setGoals(data.goals || [])
      }
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    try {
      const res = await fetch(`/api/players/me/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_value: currentValue })
      })
      if (res.ok) {
        loadGoals()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const deleteGoal = async (goalId: string) => {
    if (!confirm('¿Eliminar este objetivo?')) return
    
    try {
      const res = await fetch(`/api/players/me/goals/${goalId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setGoals(prev => prev.filter((g: any) => g.id !== goalId))
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando objetivos...</div>
  }

  const activeGoals = goals.filter((g: any) => !g.completed)
  const completedGoals = goals.filter((g: any) => g.completed)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Mis Objetivos</h2>
          <p className="text-neutral-600">
            {activeGoals.length} activos, {completedGoals.length} completados
          </p>
        </div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
        >
          {showCompleted ? 'Ocultar completados' : 'Mostrar completados'}
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Target className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">No tienes objetivos {showCompleted ? 'completados' : 'activos'}</p>
          <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl">
            Crear objetivo
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal: any) => (
            <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-sm text-neutral-600">{goal.description}</p>
                  )}
                  {goal.category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                      {goal.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700">
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </span>
                  <span className="text-sm font-bold text-primary-600">
                    {goal.progress_percentage}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      goal.completed ? 'bg-green-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm">
                {goal.target_date && (
                  <span className="text-neutral-600">
                    Meta: {new Date(goal.target_date).toLocaleDateString('es-ES')}
                  </span>
                )}
                {goal.completed && (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Completado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Progress Tab
function ProgressTab() {
  const [progress, setProgress] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const res = await fetch('/api/players/me/progress')
      if (res.ok) {
        const data = await res.json()
        setProgress(data.progress || [])
        setSummary(data.summary || [])
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando progreso...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Mi Progreso</h2>

      {/* Summary Cards */}
      {summary.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.map((item: any, idx: number) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-neutral-900 mb-4 capitalize">{item.skill_area}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Rating inicial</span>
                  <span className="font-semibold">{item.avg_rating_before}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Rating actual</span>
                  <span className="font-semibold text-primary-600">{item.avg_rating_after}/10</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium text-green-600">Mejora</span>
                  <span className="font-bold text-green-600">+{item.improvement}</span>
                </div>
                <div className="text-xs text-neutral-500">
                  {item.notes_count} {item.notes_count === 1 ? 'nota' : 'notas'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Notes */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Historial de Mejoras</h3>
        
        {progress.length === 0 ? (
          <div className="text-center py-12">
            <LineChart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600">
              Aún no tienes notas de progreso de tus entrenadores
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {progress.map((note: any) => (
              <div key={note.id} className="border-b border-neutral-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  {/* Coach Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                    {note.coach?.avatar_url ? (
                      <img src={note.coach.avatar_url} alt={note.coach.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">👤</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-neutral-900">{note.coach?.full_name}</p>
                        <p className="text-sm text-neutral-600 capitalize">{note.skill_area}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-neutral-600">{note.rating_before}</span>
                          <span className="text-neutral-400">→</span>
                          <span className="text-lg font-bold text-primary-600">{note.rating_after}</span>
                        </div>
                        <span className="text-xs text-green-600 font-semibold">
                          +{(note.rating_after - note.rating_before).toFixed(1)} mejora
                        </span>
                      </div>
                    </div>

                    {note.observations && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-2">
                        <p className="text-sm text-neutral-700">{note.observations}</p>
                      </div>
                    )}

                    {note.recommendations && (
                      <div className="bg-yellow-50 rounded-lg p-3 mb-2">
                        <p className="text-xs font-semibold text-neutral-700 mb-1">Recomendaciones:</p>
                        <p className="text-sm text-neutral-700">{note.recommendations}</p>
                      </div>
                    )}

                    <p className="text-xs text-neutral-500 mt-2">
                      {new Date(note.created_at).toLocaleDateString('es-ES', {
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
        )}
      </div>
    </div>
  )
}

// Favorites Tab
function FavoritesTab() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const res = await fetch('/api/players/me/favorites')
      if (res.ok) {
        const data = await res.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (coachId: string) => {
    if (!confirm('¿Eliminar de favoritos?')) return
    
    try {
      const res = await fetch(`/api/players/me/favorites/${coachId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setFavorites(prev => prev.filter((f: any) => f.coach_id !== coachId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando favoritos...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Entrenadores Favoritos</h2>
        <p className="text-neutral-600">{favorites.length} entrenadores en tu lista</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Star className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-2">No tienes entrenadores favoritos aún</p>
          <p className="text-sm text-neutral-500 mb-4">
            Añade tus entrenadores favoritos para acceder rápidamente a ellos
          </p>
          <a
            href="/entrenadores"
            className="inline-block px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl"
          >
            Buscar entrenadores
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {favorites.map((fav: any) => (
            <div key={fav.coach_id} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4 mb-4">
                {/* Coach Avatar */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                  {fav.coach?.avatar_url ? (
                    <img src={fav.coach.avatar_url} alt={fav.coach.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-2xl">👤</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-neutral-900 mb-1">{fav.coach?.full_name}</h3>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <Trophy className="w-4 h-4 text-primary-600" />
                    <span className="text-neutral-700">
                      {fav.sessions_count} {fav.sessions_count === 1 ? 'sesión' : 'sesiones'}
                    </span>
                  </div>
                </div>

                {/* Favorite Icon */}
                <button
                  onClick={() => removeFavorite(fav.coach_id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Notes */}
              {fav.notes && (
                <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-neutral-700">{fav.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors">
                  Reservar clase
                </button>
                <a
                  href={`/entrenador/${fav.coach_id}`}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Ver perfil
                </a>
              </div>

              <p className="text-xs text-neutral-500 mt-3">
                Añadido el {new Date(fav.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Shop Tab
function ShopTab() {
  const [activeSection, setActiveSection] = useState<'orders' | 'addresses' | 'invoices'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeSection === 'orders') {
      loadOrders()
    } else if (activeSection === 'addresses') {
      loadAddresses()
    }
  }, [activeSection])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/shop/orders')
      const data = await res.json()
      setOrders(data.orders || [])
      setStatistics(data.statistics)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAddresses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/shop/addresses')
      const data = await res.json()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error('Error loading addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    }
    return colors[status] || 'bg-neutral-100 text-neutral-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      pending: 'Pendiente',
      paid: 'Pagado',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Mi Tienda</h2>
        <p className="text-neutral-600">Gestiona tus pedidos, direcciones y facturas</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Pedidos</p>
                <p className="text-2xl font-bold text-neutral-900">{statistics.total_orders}</p>
              </div>
              <Package className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Gastado</p>
                <p className="text-2xl font-bold text-neutral-900">{statistics.total_spent.toFixed(2)}€</p>
              </div>
              <CreditCard className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pendientes</p>
                <p className="text-2xl font-bold text-neutral-900">{statistics.by_status.shipped || 0}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveSection('orders')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeSection === 'orders'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Package className="w-5 h-5 inline-block mr-2" />
            Mis Pedidos
          </button>
          <button
            onClick={() => setActiveSection('addresses')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeSection === 'addresses'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <MapPinIcon className="w-5 h-5 inline-block mr-2" />
            Direcciones
          </button>
          <button
            onClick={() => setActiveSection('invoices')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeSection === 'invoices'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            Facturas
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-neutral-600">Cargando...</p>
            </div>
          ) : (
            <>
              {/* Orders Section */}
              {activeSection === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-4">No tienes pedidos todavía</p>
                      <a
                        href="/tienda"
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors inline-block"
                      >
                        Ir a la tienda
                      </a>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-neutral-900">{order.order_number}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.created_at).toLocaleDateString('es-ES')}
                              </span>
                              <span>{order.items?.length || 0} productos</span>
                              <span className="font-semibold text-primary-700">{parseFloat(order.total).toFixed(2)}€</span>
                            </div>
                            {order.tracking_number && (
                              <p className="text-sm text-neutral-600 mt-2">
                                <Package className="w-4 h-4 inline mr-1" />
                                Tracking: <span className="font-mono">{order.tracking_number}</span>
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <a
                              href={`/dashboard/jugador/pedidos/${order.id}`}
                              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                              Ver detalles
                            </a>
                            {order.invoice && (
                              <a
                                href={order.invoice[0]?.pdf_url || '#'}
                                target="_blank"
                                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-colors"
                              >
                                <FileText className="w-4 h-4 inline mr-1" />
                                Factura
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Addresses Section */}
              {activeSection === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-neutral-900">Mis Direcciones</h3>
                    <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
                      + Añadir dirección
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPinIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-4">No tienes direcciones guardadas</p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div key={address.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-neutral-900">{address.full_name}</h4>
                              {address.is_default && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-700">{address.address_line1}</p>
                            {address.address_line2 && (
                              <p className="text-sm text-neutral-700">{address.address_line2}</p>
                            )}
                            <p className="text-sm text-neutral-700">
                              {address.postal_code} {address.city}, {address.state || ''} {address.country}
                            </p>
                            <p className="text-sm text-neutral-600 mt-1">{address.phone}</p>
                          </div>

                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-sm font-semibold rounded-lg transition-colors">
                              Editar
                            </button>
                            <button className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-lg transition-colors">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Invoices Section */}
              {activeSection === 'invoices' && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600">Las facturas aparecerán aquí una vez realices un pedido</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
