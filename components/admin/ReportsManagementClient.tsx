'use client'

import { useState, useMemo } from 'react'
import { Search, AlertTriangle, CheckCircle, XCircle, Eye, Ban, Trash2 } from 'lucide-react'

interface Report {
  id: string
  reporter_name: string
  reporter_email: string
  reported_name: string
  reported_email: string
  type: 'spam' | 'harassment' | 'fake' | 'inappropriate' | 'other'
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
  resolved_at?: string
}

const mockReports: Report[] = [
  {
    id: '1',
    reporter_name: 'Carlos García',
    reporter_email: 'carlos@email.com',
    reported_name: 'Juan Malo',
    reported_email: 'juan@email.com',
    type: 'harassment',
    reason: 'Mensajes ofensivos y acoso continuo',
    status: 'pending',
    created_at: '2025-10-13T10:30:00Z'
  },
  {
    id: '2',
    reporter_name: 'María López',
    reporter_email: 'maria@email.com',
    reported_name: 'Perfil Falso',
    reported_email: 'fake@email.com',
    type: 'fake',
    reason: 'Perfil falso haciéndose pasar por entrenador profesional',
    status: 'pending',
    created_at: '2025-10-13T09:15:00Z'
  },
  {
    id: '3',
    reporter_name: 'Ana Martínez',
    reporter_email: 'ana@email.com',
    reported_name: 'Spam Bot',
    reported_email: 'spam@email.com',
    type: 'spam',
    reason: 'Enviando spam masivo a usuarios',
    status: 'resolved',
    created_at: '2025-10-12T14:20:00Z',
    resolved_at: '2025-10-12T16:00:00Z'
  }
]

export function ReportsManagementClient() {
  const [reports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showModal, setShowModal] = useState(false)

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length
  }), [reports])

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reported_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [reports, searchTerm, typeFilter, statusFilter])

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      spam: { label: 'Spam', color: 'bg-orange-100 text-orange-700 dark-admin:bg-orange-900/20 dark-admin:text-orange-400' },
      harassment: { label: 'Acoso', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400' },
      fake: { label: 'Perfil Falso', color: 'bg-purple-100 text-purple-700 dark-admin:bg-purple-900/20 dark-admin:text-purple-400' },
      inappropriate: { label: 'Inapropiado', color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400' },
      other: { label: 'Otro', color: 'bg-gray-100 text-gray-700 dark-admin:bg-gray-900/20 dark-admin:text-gray-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${types[type].color}`}>{types[type].label}</span>
  }

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400', icon: AlertTriangle },
      resolved: { label: 'Resuelto', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400', icon: CheckCircle },
      dismissed: { label: 'Desestimado', color: 'bg-gray-100 text-gray-700 dark-admin:bg-gray-900/20 dark-admin:text-gray-400', icon: XCircle }
    }
    const statusInfo = statuses[status]
    const Icon = statusInfo.icon
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Moderación y Reportes</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Gestiona reportes de usuarios (DATOS MOCK)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Reportes</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Resueltos</p>
          <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Desestimados</p>
          <p className="text-2xl font-bold text-gray-600 dark-admin:text-gray-400 mt-1">{stats.dismissed}</p>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los tipos</option>
            <option value="spam">Spam</option>
            <option value="harassment">Acoso</option>
            <option value="fake">Perfil Falso</option>
            <option value="inappropriate">Inapropiado</option>
            <option value="other">Otro</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="resolved">Resueltos</option>
            <option value="dismissed">Desestimados</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Reportado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Razón</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{report.reported_name}</div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{report.reported_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(report.type)}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100 truncate">{report.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {new Date(report.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedReport(report); setShowModal(true); }}
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

        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron reportes</p>
          </div>
        )}
      </div>

      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-4">Detalles del Reporte</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Usuario Reportado</p>
                <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReport.reported_name}</p>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400">{selectedReport.reported_email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Reportado por</p>
                <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReport.reporter_name}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-1">Tipo</p>
                {getTypeBadge(selectedReport.type)}
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Razón</p>
                <p className="text-sm text-neutral-900 dark-admin:text-slate-100 mt-1">{selectedReport.reason}</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Resolver
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Suspender Usuario
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg hover:bg-gray-300 dark-admin:hover:bg-slate-600">
                  Desestimar
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full px-4 py-2 bg-neutral-100 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
