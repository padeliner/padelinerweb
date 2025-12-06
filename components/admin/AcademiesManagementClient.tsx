'use client'

import { useState, useMemo } from 'react'
import { Search, Award, CheckCircle, Eye, Star, Users } from 'lucide-react'

interface Academy {
  id: string
  name: string
  director_name: string
  director_email: string
  city: string
  address: string
  coaches_count: number
  students_count: number
  rating: number
  reviews_count: number
  verified: boolean
  status: 'active' | 'pending' | 'suspended'
  created_at: string
}

const mockAcademies: Academy[] = [
  { id: '1', name: 'Academia Pádel Pro', director_name: 'Ana Martínez', director_email: 'ana@academia.com', city: 'Madrid', address: 'C/ Serrano 50', coaches_count: 12, students_count: 85, rating: 4.7, reviews_count: 150, verified: true, status: 'active', created_at: '2024-01-10T10:00:00Z' },
  { id: '2', name: 'Escuela Elite Pádel', director_name: 'Roberto Díaz', director_email: 'roberto@elite.com', city: 'Barcelona', address: 'Passeig de Gràcia 100', coaches_count: 8, students_count: 62, rating: 4.9, reviews_count: 98, verified: true, status: 'active', created_at: '2024-02-15T09:00:00Z' },
  { id: '3', name: 'Centro Formación Valencia', director_name: 'Sara Jiménez', director_email: 'sara@centro.com', city: 'Valencia', address: 'Av. Blasco Ibáñez 20', coaches_count: 5, students_count: 40, rating: 4.3, reviews_count: 45, verified: false, status: 'pending', created_at: '2024-10-05T14:30:00Z' }
]

export function AcademiesManagementClient() {
  const [academies] = useState<Academy[]>(mockAcademies)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null)
  const [showModal, setShowModal] = useState(false)

  const stats = useMemo(() => ({
    total: academies.length,
    active: academies.filter(a => a.status === 'active').length,
    pending: academies.filter(a => a.status === 'pending').length,
    verified: academies.filter(a => a.verified).length,
    totalCoaches: academies.reduce((sum, a) => sum + a.coaches_count, 0),
    totalStudents: academies.reduce((sum, a) => sum + a.students_count, 0)
  }), [academies])

  const filteredAcademies = useMemo(() => {
    return academies.filter(academy => {
      const matchesSearch = 
        academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        academy.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || academy.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [academies, searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      active: { label: 'Activa', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400' },
      suspended: { label: 'Suspendida', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statuses[status].color}`}>{statuses[status].label}</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Academias</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra todas las academias de pádel (DATOS MOCK)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Activas</p>
          <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Verificadas</p>
          <p className="text-2xl font-bold text-blue-600 dark-admin:text-blue-400 mt-1">{stats.verified}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Entrenadores</p>
          <p className="text-2xl font-bold text-purple-600 dark-admin:text-purple-400 mt-1">{stats.totalCoaches}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Alumnos</p>
          <p className="text-2xl font-bold text-orange-600 dark-admin:text-orange-400 mt-1">{stats.totalStudents}</p>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar academia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="pending">Pendientes</option>
            <option value="suspended">Suspendidas</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Academia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Director</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Ciudad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Entrenadores</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Alumnos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredAcademies.map((academy) => (
                <tr key={academy.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark-admin:bg-purple-900/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600 dark-admin:text-purple-400" />
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{academy.name}</div>
                          {academy.verified && <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />}
                        </div>
                        <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{academy.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">{academy.director_name}</div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{academy.director_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{academy.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{academy.coaches_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{academy.students_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{academy.rating}</span>
                      <span className="text-xs text-neutral-500 dark-admin:text-slate-400 ml-1">({academy.reviews_count})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(academy.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedAcademy(academy); setShowModal(true); }}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 dark-admin:bg-green-900/20 text-green-600 dark-admin:text-green-400 hover:bg-green-100 dark-admin:hover:bg-green-900/30 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAcademies.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron academias</p>
          </div>
        )}
      </div>

      {showModal && selectedAcademy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-4">Detalles de la Academia</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Nombre</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Ciudad</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.city}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Director</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.director_name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Email</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.director_email}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Entrenadores</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.coaches_count}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Alumnos</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.students_count}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Rating</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Reseñas</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedAcademy.reviews_count}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark-admin:border-slate-700">
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-2">Estado</p>
                {getStatusBadge(selectedAcademy.status)}
              </div>
              <div className="flex space-x-2 pt-4">
                {!selectedAcademy.verified && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Verificar Academia
                  </button>
                )}
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Aprobar
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Suspender
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full px-4 py-2 bg-neutral-100 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
