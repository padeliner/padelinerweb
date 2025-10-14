'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, CheckCircle, XCircle, Eye, Star } from 'lucide-react'

interface Club {
  id: string
  name: string
  owner_name: string
  owner_email: string
  city: string
  address: string
  courts_count: number
  rating: number
  reviews_count: number
  verified: boolean
  status: 'active' | 'pending' | 'suspended'
  created_at: string
}

const mockClubs: Club[] = [
  { id: '1', name: 'Club Pádel Madrid Centro', owner_name: 'Pedro García', owner_email: 'pedro@club.com', city: 'Madrid', address: 'Calle Mayor 10', courts_count: 8, rating: 4.5, reviews_count: 120, verified: true, status: 'active', created_at: '2024-01-15T10:00:00Z' },
  { id: '2', name: 'Pádel Club Barcelona', owner_name: 'Laura Ruiz', owner_email: 'laura@club.com', city: 'Barcelona', address: 'Av. Diagonal 350', courts_count: 6, rating: 4.8, reviews_count: 95, verified: true, status: 'active', created_at: '2024-02-20T09:00:00Z' },
  { id: '3', name: 'Valencia Padel Center', owner_name: 'Miguel Torres', owner_email: 'miguel@club.com', city: 'Valencia', address: 'C/ Colón 45', courts_count: 4, rating: 4.2, reviews_count: 65, verified: false, status: 'pending', created_at: '2024-10-10T14:30:00Z' }
]

export function ClubsManagementClient() {
  const [clubs] = useState<Club[]>(mockClubs)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [showModal, setShowModal] = useState(false)

  const stats = useMemo(() => ({
    total: clubs.length,
    active: clubs.filter(c => c.status === 'active').length,
    pending: clubs.filter(c => c.status === 'pending').length,
    verified: clubs.filter(c => c.verified).length
  }), [clubs])

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchesSearch = 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || club.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [clubs, searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      active: { label: 'Activo', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400' },
      suspended: { label: 'Suspendido', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statuses[status].color}`}>{statuses[status].label}</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Clubes</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra todos los clubes de pádel (DATOS MOCK)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Clubes</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Activos</p>
          <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">{stats.pending}</p>
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
              placeholder="Buscar club..."
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
            <option value="pending">Pendientes</option>
            <option value="suspended">Suspendidos</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Propietario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Ciudad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Pistas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredClubs.map((club) => (
                <tr key={club.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark-admin:bg-orange-900/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-600 dark-admin:text-orange-400" />
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{club.name}</div>
                          {club.verified && <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />}
                        </div>
                        <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{club.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">{club.owner_name}</div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{club.owner_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{club.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{club.courts_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{club.rating}</span>
                      <span className="text-xs text-neutral-500 dark-admin:text-slate-400 ml-1">({club.reviews_count})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(club.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedClub(club); setShowModal(true); }}
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

        {filteredClubs.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron clubes</p>
          </div>
        )}
      </div>

      {showModal && selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-4">Detalles del Club</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Nombre</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedClub.name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Ciudad</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedClub.city}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Propietario</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedClub.owner_name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Número de Pistas</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedClub.courts_count}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Rating</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedClub.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Reseñas</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedClub.reviews_count}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark-admin:border-slate-700">
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-2">Estado</p>
                {getStatusBadge(selectedClub.status)}
              </div>
              <div className="flex space-x-2 pt-4">
                {!selectedClub.verified && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Verificar Club
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
