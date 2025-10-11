'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GraduationCap, Users, Calendar, TrendingUp, LogOut, Home } from 'lucide-react'

export default function DashboardAcademia() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(userData)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Dashboard Academia</h1>
              <p className="text-sm text-neutral-600">Bienvenido, {user?.full_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Programas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Programas</h2>
            <p className="text-neutral-600 mb-4">
              Gestiona programas formativos
            </p>
            <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors">
              Gestionar
            </button>
          </div>

          {/* Estudiantes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Estudiantes</h2>
            <p className="text-neutral-600 mb-4">
              Administra estudiantes y grupos
            </p>
            <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors">
              Ver Estudiantes
            </button>
          </div>

          {/* Horarios */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Horarios</h2>
            <p className="text-neutral-600 mb-4">
              Planifica clases y eventos
            </p>
            <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
              Planificar
            </button>
          </div>

          {/* Rendimiento */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Rendimiento</h2>
            <p className="text-neutral-600 mb-4">
              Analiza progreso académico
            </p>
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors">
              Ver Análisis
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Información de la Academia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">Email</p>
              <p className="text-neutral-900">{user?.email}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">Rol</p>
              <p className="text-neutral-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Back Home Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-semibold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </main>
    </div>
  )
}
