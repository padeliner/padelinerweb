'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Shield, Users, BarChart, Settings, Database, AlertTriangle, LogOut, Home } from 'lucide-react'

export default function DashboardAdmin() {
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Panel de Administración</h1>
                <p className="text-sm text-neutral-600">Bienvenido, {user?.full_name}</p>
              </div>
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
        {/* Alert */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900">Panel de Administrador</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Tienes acceso completo a todas las funcionalidades de la plataforma. Usa estos poderes con responsabilidad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Usuarios */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Usuarios</h2>
            <p className="text-neutral-600 mb-4">
              Gestiona todos los usuarios del sistema
            </p>
            <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors">
              Gestionar
            </button>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <BarChart className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Estadísticas</h2>
            <p className="text-neutral-600 mb-4">
              Analiza métricas de la plataforma
            </p>
            <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
              Ver Estadísticas
            </button>
          </div>

          {/* Base de Datos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Base de Datos</h2>
            <p className="text-neutral-600 mb-4">
              Administra datos y backups
            </p>
            <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors">
              Administrar
            </button>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Configuración</h2>
            <p className="text-neutral-600 mb-4">
              Ajustes globales del sistema
            </p>
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors">
              Configurar
            </button>
          </div>

          {/* Reportes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Reportes</h2>
            <p className="text-neutral-600 mb-4">
              Revisa reportes y problemas
            </p>
            <button className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors">
              Ver Reportes
            </button>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Seguridad</h2>
            <p className="text-neutral-600 mb-4">
              Monitorea seguridad y accesos
            </p>
            <button className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors">
              Monitorear
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Información del Administrador</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">Email</p>
              <p className="text-neutral-900">{user?.email}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">Rol</p>
              <p className="text-neutral-900 uppercase font-bold text-red-600">{user?.role}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">ID</p>
              <p className="text-neutral-900 text-xs font-mono">{user?.id}</p>
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
