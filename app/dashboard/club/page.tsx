'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { Building2, Users, Calendar, BarChart, Eye, Clock, Star } from 'lucide-react'

export default function DashboardClub() {
  const router = useRouter()
  const { user, profile, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourts: 0,
    totalMembers: 0,
    todayReservations: 0,
    avgRating: 0
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (profile && profile.role !== 'club') {
      // Redirigir al dashboard correcto según el rol
      switch (profile.role) {
        case 'entrenador':
        case 'coach':
          router.push('/dashboard/entrenador')
          return
        case 'academia':
        case 'academy':
          router.push('/dashboard/academia')
          return
        case 'admin':
          router.push('/admin')
          return
        default:
          router.push('/dashboard/jugador')
          return
      }
    }

    loadStats()
  }, [isAuthenticated, profile, router])

  const loadStats = async () => {
    try {
      setStats({
        totalCourts: 0,
        totalMembers: 0,
        todayReservations: 0,
        avgRating: 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Dashboard Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Dashboard Club</h1>
              <p className="text-neutral-600 mt-1">
                Bienvenido, {profile?.full_name || 'Club'}
              </p>
            </div>
            <a
              href={`/clubes/${user?.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Ver mi perfil</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalCourts}</p>
            <p className="text-sm text-neutral-600 font-medium">Pistas</p>
          </div>
          
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalMembers}</p>
            <p className="text-sm text-neutral-600 font-medium">Socios</p>
          </div>
          
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.todayReservations}</p>
            <p className="text-sm text-neutral-600 font-medium">Reservas Hoy</p>
          </div>
          
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-3">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.avgRating || '-'}</p>
            <p className="text-sm text-neutral-600 font-medium">Valoración</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Instalaciones</h2>
            <p className="text-neutral-600 mb-4">
              Gestiona pistas y áreas del club
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
              Gestionar
            </button>
          </div>

          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Socios</h2>
            <p className="text-neutral-600 mb-4">
              Administra socios y membresías
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
              Ver Socios
            </button>
          </div>

          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Reservas</h2>
            <p className="text-neutral-600 mb-4">
              Controla reservas de pistas
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
              Ver Reservas
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
