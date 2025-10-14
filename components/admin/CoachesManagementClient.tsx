'use client'

import { useState, useMemo } from 'react'
import { Search, Award, Star, Eye, CheckCircle, XCircle } from 'lucide-react'

interface Coach {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  suspended_at: string | null
}

interface Props {
  initialCoaches: Coach[]
}

export function CoachesManagementClient({ initialCoaches }: Props) {
  const [coaches] = useState<Coach[]>(initialCoaches)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [showModal, setShowModal] = useState(false)

  const stats = useMemo(() => ({
    total: coaches.length,
    active: coaches.filter(c => !c.suspended_at).length,
    suspended: coaches.filter(c => c.suspended_at).length,
    verified: Math.floor(coaches.length * 0.7) // Mock: 70% verificados
  }), [coaches])

  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach => {
      const matchesSearch = 
        coach.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && !coach.suspended_at) ||
        (statusFilter === 'suspended' && coach.suspended_at)
      
      return matchesSearch && matchesStatus
    })
  }, [coaches, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Entrenadores</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra todos los entrenadores de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Activos</p>
          <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Suspendidos</p>
          <p className="text-2xl font-bold text-red-600 dark-admin:text-red-400 mt-1">{stats.suspended}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Verificados</p>
          <p className="text-2xl font-bold text-blue-600 dark-admin:text-blue-400 mt-1">{stats.verified}</p>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar entrenador..."
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
            <option value="active">Activos</option>
            <option value="suspended">Suspendidos</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Entrenador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredCoaches.map((coach) => (
                <tr key={coach.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark-admin:bg-green-900/20 flex items-center justify-center text-green-600 dark-admin:text-green-400 font-bold">
                        {coach.full_name?.charAt(0).toUpperCase() || coach.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                          {coach.full_name || 'Sin nombre'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">
                    {coach.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {coach.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coach.suspended_at ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400">
                        <XCircle className="w-3 h-3 mr-1" />
                        Suspendido
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {new Date(coach.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedCoach(coach); setShowModal(true); }}
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

        {filteredCoaches.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron entrenadores</p>
          </div>
        )}
      </div>

      {showModal && selectedCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-4">Detalles del Entrenador</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Nombre Completo</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedCoach.full_name || 'Sin nombre'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Email</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedCoach.email}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Teléfono</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedCoach.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Fecha de Registro</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                    {new Date(selectedCoach.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark-admin:border-slate-700">
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-2">Estado</p>
                {selectedCoach.suspended_at ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400">
                    Suspendido
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400">
                    Activo
                  </span>
                )}
              </div>
              <div className="flex space-x-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Ver Perfil Completo
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Verificar
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
