'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Filter,
  Download,
  RefreshCw,
  Search,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AuditLog {
  id: string
  user_email: string
  user_role: string
  action: string
  entity_type: string
  entity_id: string
  description: string
  level: string
  status: string
  metadata: any
  ip_address: string
  created_at: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({})
  const [filters, setFilters] = useState({
    action: '',
    level: '',
    entity_type: ''
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadLogs(), loadStats()])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    const params = new URLSearchParams()
    if (filters.action) params.set('action', filters.action)
    if (filters.level) params.set('level', filters.level)
    if (filters.entity_type) params.set('entity_type', filters.entity_type)
    params.set('limit', '50')

    const res = await fetch(`/api/admin/logs?${params}`)
    const data = await res.json()
    setLogs(data.logs || [])
  }

  const loadStats = async () => {
    const res = await fetch('/api/admin/logs/stats')
    const data = await res.json()
    setStats(data.stats || {})
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Logs de Auditoría</h1>
          <p className="text-neutral-600 mt-1">Registro de eventos del sistema</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.totalLogs || 0}</p>
          <p className="text-sm text-neutral-600">Total de Logs</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.todayCount || 0}</p>
          <p className="text-sm text-neutral-600">Hoy</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.warningCount || 0}</p>
          <p className="text-sm text-neutral-600">Advertencias</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.errorCount || 0}</p>
          <p className="text-sm text-neutral-600">Errores</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-neutral-600" />
          <h3 className="font-semibold text-neutral-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Nivel</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Acción</label>
            <input
              type="text"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              placeholder="Ej: login, payment_create"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tipo de Entidad</label>
            <select
              value={filters.entity_type}
              onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="user">Usuario</option>
              <option value="payment">Pago</option>
              <option value="conversation">Conversación</option>
              <option value="newsletter">Newsletter</option>
              <option value="email">Email</option>
              <option value="auth">Autenticación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-neutral-600 mt-4">Cargando logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No hay logs que mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Nivel</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Acción</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Descripción</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        <span className={`text-xs px-2 py-1 rounded-full border ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-neutral-100 px-2 py-1 rounded">{log.action}</code>
                    </td>
                    <td className="py-3 px-4 text-sm">{log.description}</td>
                    <td className="py-3 px-4 text-sm">
                      {log.user_email ? (
                        <div>
                          <p className="font-medium">{log.user_email}</p>
                          {log.user_role && (
                            <span className="text-xs text-neutral-500">{log.user_role}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400">Sistema</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-500">
                      {log.ip_address || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
