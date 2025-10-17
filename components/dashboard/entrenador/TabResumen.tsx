'use client'

import { useEffect, useState } from 'react'
import { Users, Calendar, DollarSign, Star, Clock, TrendingUp } from 'lucide-react'

interface Stats {
  total_students: number
  upcoming_classes: number
  earnings_period: number
  average_rating: number
  total_reviews: number
}

export default function TabResumen() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/coaches/stats?period=month')
      if (res.ok) {
        const data = await res.json()
        setStats(data.kpis)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats?.total_students || 0}</p>
              <p className="text-sm text-neutral-600">Alumnos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats?.upcoming_classes || 0}</p>
              <p className="text-sm text-neutral-600">Esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">€{stats?.earnings_period?.toFixed(0) || 0}</p>
              <p className="text-sm text-neutral-600">Este mes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats?.average_rating?.toFixed(1) || '-'}</p>
              <p className="text-sm text-neutral-600">{stats?.total_reviews || 0} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximas Clases y Solicitudes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Clases */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Próximas clases</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Ver todas →
              </button>
            </div>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 text-center py-8">No hay clases próximas</p>
          </div>
        </div>

        {/* Nuevas Solicitudes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Nuevas solicitudes</h2>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">0</span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-neutral-600 text-center py-8">No hay solicitudes pendientes</p>
          </div>
        </div>
      </div>

      {/* Gráfico placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">Rendimiento este mes</h2>
        <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-600">Gráfico próximamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
