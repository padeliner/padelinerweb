'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { 
  Users, Calendar, DollarSign, Settings, Eye, Clock, Star, LogOut, 
  BarChart3, ClipboardList
} from 'lucide-react'

// Componentes de tabs
import TabResumen from '@/components/dashboard/entrenador/TabResumen'
import TabCalendario from '@/components/dashboard/entrenador/TabCalendario'
import TabReservas from '@/components/dashboard/entrenador/TabReservas'
import TabConfiguracion from '@/components/dashboard/entrenador/TabConfiguracion'

type TabId = 'resumen' | 'calendario' | 'reservas' | 'alumnos' | 'disponibilidad' | 'finanzas' | 'config'

export default function DashboardEntrenador() {
  const router = useRouter()
  const { user, profile, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('resumen')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (profile && profile.role !== 'coach' && profile.role !== 'entrenador') {
      // Redirigir al dashboard correcto según el rol
      switch (profile.role) {
        case 'academia':
        case 'academy':
          router.push('/dashboard/academia')
          return
        case 'club':
          router.push('/dashboard/club')
          return
        case 'admin':
          router.push('/admin')
          return
        default:
          router.push('/dashboard/jugador')
          return
      }
    }

    setLoading(false)
  }, [isAuthenticated, profile, router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const tabs = [
    { id: 'resumen' as TabId, label: 'Resumen', icon: BarChart3 },
    { id: 'calendario' as TabId, label: 'Calendario', icon: Calendar },
    { id: 'reservas' as TabId, label: 'Reservas', icon: ClipboardList },
    { id: 'alumnos' as TabId, label: 'Alumnos', icon: Users },
    { id: 'disponibilidad' as TabId, label: 'Disponibilidad', icon: Clock },
    { id: 'finanzas' as TabId, label: 'Finanzas', icon: DollarSign },
    { id: 'config' as TabId, label: 'Mi Perfil', icon: Settings },
  ]

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
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Dashboard Header */}
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Dashboard Entrenador</h1>
              <p className="text-neutral-600 text-sm mt-1">
                Bienvenido, {profile?.full_name || 'Entrenador'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/entrenadores/${user?.id}`}
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Ver perfil</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${isActive 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'resumen' && <TabResumen />}
        {activeTab === 'calendario' && <TabCalendario />}
        {activeTab === 'reservas' && <TabReservas />}
        {activeTab === 'alumnos' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Alumnos</h2>
            <p className="text-neutral-600">Próximamente...</p>
          </div>
        )}
        {activeTab === 'disponibilidad' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Disponibilidad</h2>
            <p className="text-neutral-600">Próximamente...</p>
          </div>
        )}
        {activeTab === 'finanzas' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Finanzas</h2>
            <p className="text-neutral-600">Próximamente...</p>
          </div>
        )}
        {activeTab === 'config' && <TabConfiguracion />}
      </main>

      <Footer />
    </div>
  )
}
