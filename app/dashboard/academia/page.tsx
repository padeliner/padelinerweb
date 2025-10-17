'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { GraduationCap, Users, Calendar, TrendingUp, Eye, BookOpen, Award, LogOut } from 'lucide-react'

export default function DashboardAcademia() {
  const router = useRouter()
  const { user, profile, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalStudents: 0,
    activeClasses: 0,
    avgRating: 0
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (profile && profile.role !== 'academy' && profile.role !== 'academia') {
      // Redirigir al dashboard correcto según el rol
      switch (profile.role) {
        case 'entrenador':
        case 'coach':
          router.push('/dashboard/entrenador')
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

    loadStats()
  }, [isAuthenticated, profile, router])

  const loadStats = async () => {
    try {
      setStats({
        totalPrograms: 0,
        totalStudents: 0,
        activeClasses: 0,
        avgRating: 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
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
              <h1 className="text-3xl font-bold text-neutral-900">Dashboard Academia</h1>
              <p className="text-neutral-600 mt-1">
                Bienvenido, {profile?.full_name || 'Academia'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/academias/${user?.id}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Ver mi perfil</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalPrograms}</p>
            <p className="text-sm text-neutral-600 font-medium">Programas</p>
          </div>
          
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.totalStudents}</p>
            <p className="text-sm text-neutral-600 font-medium">Estudiantes</p>
          </div>
          
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.activeClasses}</p>
            <p className="text-sm text-neutral-600 font-medium">Clases Activas</p>
          </div>
          
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stats.avgRating || '-'}</p>
            <p className="text-sm text-neutral-600 font-medium">Valoración</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Programas</h2>
            <p className="text-neutral-600 mb-4">
              Gestiona programas formativos
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
              Gestionar
            </button>
          </div>

          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Estudiantes</h2>
            <p className="text-neutral-600 mb-4">
              Administra estudiantes y grupos
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
              Ver Estudiantes
            </button>
          </div>

          <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Horarios</h2>
            <p className="text-neutral-600 mb-4">
              Planifica clases y eventos
            </p>
            <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
              Planificar
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
