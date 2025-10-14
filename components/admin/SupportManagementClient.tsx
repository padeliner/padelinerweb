'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Filter,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  Flag,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TicketDetailModal } from './TicketDetailModal'
import { CreateTicketModal } from './CreateTicketModal'

interface SupportTicket {
  id: string
  ticket_number: string
  user_id: string
  subject: string
  category: string
  priority: string
  status: string
  description: string
  assigned_to: string | null
  resolved_at: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }
  assigned: {
    id: string
    full_name: string
    email: string
  } | null
}

export function SupportManagementClient() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [tableNotConfigured, setTableNotConfigured] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [filterStatus, filterPriority, filterCategory])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPriority !== 'all') params.append('priority', filterPriority)
      if (filterCategory !== 'all') params.append('category', filterCategory)

      const response = await fetch(`/api/admin/support/tickets?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data.note) {
          setTableNotConfigured(true)
        }
        setTickets(data.tickets || [])
      }
    } catch (error) {
      // Error cargando tickets
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const stats = {
    total: tickets.length,
    abiertos: tickets.filter((t) => t.status === 'abierto').length,
    en_progreso: tickets.filter((t) => t.status === 'en_progreso').length,
    resueltos: tickets.filter((t) => t.status === 'resuelto').length,
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

  const getStatusBadge = (status: string) => {
    const colors = {
      abierto: 'bg-yellow-100 text-yellow-800 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400',
      en_progreso: 'bg-blue-100 text-blue-800 dark-admin:bg-blue-900/20 dark-admin:text-blue-400',
      resuelto: 'bg-green-100 text-green-800 dark-admin:bg-green-900/20 dark-admin:text-green-400',
      cerrado: 'bg-gray-100 text-gray-800 dark-admin:bg-gray-900/20 dark-admin:text-gray-400',
    }

    const icons = {
      abierto: AlertCircle,
      en_progreso: Clock,
      resuelto: CheckCircle,
      cerrado: CheckCircle,
    }

    const Icon = icons[status as keyof typeof icons] || AlertCircle

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.abierto}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    )
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      tecnico: AlertCircle,
      facturacion: Mail,
      cuenta: User,
      general: MessageSquare,
      bug: AlertCircle,
      feature: Plus,
    }

    return icons[category as keyof typeof icons] || MessageSquare
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark-admin:text-slate-400">Cargando tickets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Soporte
          </h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
            Gestiona tickets y consultas de soporte
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Ticket</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Tickets</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600 dark-admin:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Abiertos</p>
              <p className="text-3xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">
                {stats.abiertos}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark-admin:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">En Progreso</p>
              <p className="text-3xl font-bold text-blue-600 dark-admin:text-blue-400 mt-1">
                {stats.en_progreso}
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
            <AlertCircle className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark-admin:text-yellow-300 mb-2">
                ⚠️ Tabla de Soporte No Configurada
              </h3>
              <p className="text-sm text-yellow-800 dark-admin:text-yellow-400 mb-3">
                La tabla <code className="px-2 py-1 bg-yellow-100 dark-admin:bg-yellow-900/40 rounded">support_tickets</code> no existe en la base de datos.
              </p>
              <div className="bg-yellow-100 dark-admin:bg-yellow-900/40 rounded p-4">
                <p className="text-sm font-medium text-yellow-900 dark-admin:text-yellow-300 mb-2">
                  📝 Para configurar el sistema de soporte:
                </p>
                <ol className="text-sm text-yellow-800 dark-admin:text-yellow-400 space-y-2 ml-4 list-decimal">
                  <li>Ve a Supabase → SQL Editor</li>
                  <li>Abre el archivo: <code className="px-1.5 py-0.5 bg-yellow-200 dark-admin:bg-yellow-900/60 rounded text-xs">c:\Padeliner\supabase\migrations\create_support_tickets_table.sql</code></li>
                  <li>Copia y ejecuta el contenido completo</li>
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
              placeholder="Buscar tickets..."
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
            <option value="abierto">Abiertos</option>
            <option value="en_progreso">En Progreso</option>
            <option value="resuelto">Resueltos</option>
            <option value="cerrado">Cerrados</option>
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todas las categorías</option>
            <option value="tecnico">Técnico</option>
            <option value="facturacion">Facturación</option>
            <option value="cuenta">Cuenta</option>
            <option value="general">General</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
          </select>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark-admin:divide-slate-700">
            <thead className="bg-neutral-50 dark-admin:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-300 uppercase tracking-wider">
                  Categoría
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
              </tr>
            </thead>
            <tbody className="bg-white dark-admin:bg-slate-800 divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category)
                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setShowDetailModal(true)
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                        {ticket.ticket_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {ticket.user.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={ticket.user.avatar_url}
                              alt={ticket.user.full_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 dark-admin:bg-green-900/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-green-600 dark-admin:text-green-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                            {ticket.user.full_name}
                          </div>
                          <div className="text-sm text-neutral-500 dark-admin:text-slate-400">
                            {ticket.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 dark-admin:text-slate-100">
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-neutral-500 dark-admin:text-slate-400">
                        <CategoryIcon className="w-4 h-4 mr-2" />
                        {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                      {format(new Date(ticket.created_at), 'dd MMM yyyy', { locale: es })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
            <p className="text-neutral-600 dark-admin:text-slate-400">
              No se encontraron tickets
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {showDetailModal && selectedTicket && (
        <TicketDetailModal
          ticketId={selectedTicket.id}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedTicket(null)
          }}
          onUpdate={loadTickets}
        />
      )}

      {/* Modal de crear ticket */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreate={loadTickets}
        />
      )}
    </div>
  )
}
