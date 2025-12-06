'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Flag,
  Search,
  Filter,
  Eye,
  Ban,
  Trash2,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ContentReport {
  id: string
  reporter_id: string
  reported_entity_type: string
  reported_entity_id: string
  reported_user_id: string | null
  reason: string
  description: string
  status: string
  priority: string
  evidence_urls: string[]
  assigned_to: string | null
  reviewed_at: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  reporter: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }
  reported_user: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
  assigned_mod: {
    id: string
    full_name: string
    email: string
  } | null
}

export function ModerationManagementClient() {
  const [reports, setReports] = useState<ContentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterEntityType, setFilterEntityType] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [tableNotConfigured, setTableNotConfigured] = useState(false)

  useEffect(() => {
    loadReports()
  }, [filterStatus, filterPriority, filterEntityType])

  const loadReports = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPriority !== 'all') params.append('priority', filterPriority)
      if (filterEntityType !== 'all') params.append('entity_type', filterEntityType)

      const response = await fetch(`/api/admin/moderation/reports?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data.note) {
          setTableNotConfigured(true)
        }
        setReports(data.reports || [])
      }
    } catch (error) {
      // Error cargando reportes
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.reported_user?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const stats = {
    total: reports.length,
    pendientes: reports.filter((r) => r.status === 'pendiente').length,
    en_revision: reports.filter((r) => r.status === 'en_revision').length,
    resueltos: reports.filter((r) => r.status === 'resuelto').length,
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400',
      en_revision: 'bg-blue-100 text-blue-800 dark-admin:bg-blue-900/20 dark-admin:text-blue-400',
      aprobado: 'bg-green-100 text-green-800 dark-admin:bg-green-900/20 dark-admin:text-green-400',
      rechazado: 'bg-red-100 text-red-800 dark-admin:bg-red-900/20 dark-admin:text-red-400',
      resuelto: 'bg-gray-100 text-gray-800 dark-admin:bg-gray-900/20 dark-admin:text-gray-400',
    }

    const icons = {
      pendiente: AlertTriangle,
      en_revision: Clock,
      aprobado: CheckCircle,
      rechazado: Ban,
      resuelto: CheckCircle,
    }

    const Icon = icons[status as keyof typeof icons] || AlertTriangle

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.pendiente}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      baja: 'bg-gray-100 text-gray-800 dark-admin:bg-gray-900/20 dark-admin:text-gray-400',
      media: 'bg-blue-100 text-blue-800 dark-admin:bg-blue-900/20 dark-admin:text-blue-400',
      alta: 'bg-orange-100 text-orange-800 dark-admin:bg-orange-900/20 dark-admin:text-orange-400',
      urgente: 'bg-red-100 text-red-800 dark-admin:bg-red-900/20 dark-admin:text-red-400',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || colors.media}`}>
        <Flag className="w-3 h-3 mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  const getReasonLabel = (reason: string) => {
    const labels: { [key: string]: string } = {
      spam: 'Spam',
      abuso: 'Abuso',
      contenido_inapropiado: 'Contenido Inapropiado',
      informacion_falsa: 'Información Falsa',
      suplantacion: 'Suplantación',
      otro: 'Otro',
    }
    return labels[reason] || reason
  }

  const getEntityTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      user: 'Usuario',
      review: 'Reseña',
      comment: 'Comentario',
      post: 'Publicación',
      academy: 'Academia',
      club: 'Club',
      trainer: 'Entrenador',
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark-admin:text-slate-400">Cargando reportes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">
          Moderación
        </h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
          Gestiona reportes y contenido reportado
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Reportes</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 dark-admin:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">
                {stats.pendientes}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark-admin:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">En Revisión</p>
              <p className="text-3xl font-bold text-blue-600 dark-admin:text-blue-400 mt-1">
                {stats.en_revision}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark-admin:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Resueltos</p>
              <p className="text-3xl font-bold text-green-600 dark-admin:text-green-400 mt-1">
                {stats.resueltos}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark-admin:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de tabla no configurada */}
      {tableNotConfigured && (
        <div className="bg-yellow-50 dark-admin:bg-yellow-900/20 border border-yellow-200 dark-admin:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark-admin:text-yellow-300 mb-2">
                ⚠️ Sistema de Moderación No Configurado
              </h3>
              <p className="text-sm text-yellow-800 dark-admin:text-yellow-400 mb-3">
                Las tablas de moderación no existen en la base de datos.
              </p>
              <div className="bg-yellow-100 dark-admin:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-medium text-yellow-900 dark-admin:text-yellow-300 mb-2">
                  📝 Para configurar el sistema de moderación:
                </p>
                <ol className="text-sm text-yellow-800 dark-admin:text-yellow-400 space-y-2 ml-4 list-decimal">
                  <li>Ve a Supabase → SQL Editor</li>
                  <li>Ejecuta: <code className="px-1.5 py-0.5 bg-yellow-200 dark-admin:bg-yellow-900/60 rounded text-xs">create_moderation_tables.sql</code></li>
                  <li>Recarga esta página</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_revision">En Revisión</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
            <option value="resuelto">Resueltos</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todas las prioridades</option>
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <select
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los tipos</option>
            <option value="user">Usuario</option>
            <option value="review">Reseña</option>
            <option value="comment">Comentario</option>
            <option value="post">Publicación</option>
            <option value="academy">Academia</option>
            <option value="club">Club</option>
            <option value="trainer">Entrenador</option>
          </select>
        </div>
      </div>

      {/* Lista de Reportes */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark-admin:divide-slate-700">
            <thead className="bg-neutral-50 dark-admin:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Reportado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Contenido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark-admin:bg-slate-800 divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {report.reporter.avatar_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={report.reporter.avatar_url}
                            alt={report.reporter.full_name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark-admin:bg-blue-900/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600 dark-admin:text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                          {report.reporter.full_name}
                        </div>
                        <div className="text-sm text-neutral-500 dark-admin:text-slate-400">
                          {report.reporter.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">
                      {getEntityTypeLabel(report.reported_entity_type)}
                    </div>
                    {report.reported_user && (
                      <div className="text-sm text-neutral-500 dark-admin:text-slate-400">
                        {report.reported_user.full_name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark-admin:text-slate-100">
                      {getReasonLabel(report.reason)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(report.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {format(new Date(report.created_at), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedReport(report)
                        setShowDetailModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 dark-admin:text-blue-400 dark-admin:hover:text-blue-300"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
            <p className="text-neutral-600 dark-admin:text-slate-400">
              No se encontraron reportes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
