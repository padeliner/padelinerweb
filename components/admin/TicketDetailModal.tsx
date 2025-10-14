'use client'

import { useState, useEffect } from 'react'
import {
  X,
  User,
  Calendar,
  Flag,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TicketDetailModalProps {
  ticketId: string
  onClose: () => void
  onUpdate: () => void
}

interface Message {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_internal: boolean
  created_at: string
  user: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
    role: string
  }
}

interface TicketDetail {
  id: string
  ticket_number: string
  user_id: string
  subject: string
  category: string
  priority: string
  status: string
  description: string
  assigned_to: string | null
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

export function TicketDetailModal({ ticketId, onClose, onUpdate }: TicketDetailModalProps) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [admins, setAdmins] = useState<Array<{ id: string; full_name: string }>>([])

  useEffect(() => {
    loadTicketDetail()
    loadAdmins()
  }, [ticketId])

  const loadTicketDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data.ticket)
        setMessages(data.messages || [])
      }
    } catch (error) {
      // Error cargando ticket
    } finally {
      setLoading(false)
    }
  }

  const loadAdmins = async () => {
    try {
      const response = await fetch('/api/admin/users?role=admin')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.users || [])
      }
    } catch (error) {
      // Error cargando admins
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch('/api/admin/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          message: newMessage,
          is_internal: isInternal,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        setIsInternal(false)
        await loadTicketDetail()
        onUpdate()
      } else {
        alert('Error al enviar mensaje')
      }
    } catch (error) {
      alert('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await loadTicketDetail()
        onUpdate()
        alert('✅ Estado actualizado')
      }
    } catch (error) {
      alert('❌ Error al actualizar estado')
    }
  }

  const handleUpdatePriority = async (priority: string) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      })

      if (response.ok) {
        await loadTicketDetail()
        onUpdate()
        alert('✅ Prioridad actualizada')
      }
    } catch (error) {
      alert('❌ Error al actualizar prioridad')
    }
  }

  const handleAssign = async (adminId: string | null) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: adminId }),
      })

      if (response.ok) {
        await loadTicketDetail()
        onUpdate()
        alert('✅ Ticket asignado')
      }
    } catch (error) {
      alert('❌ Error al asignar ticket')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      abierto: 'text-yellow-600 bg-yellow-100 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400',
      en_progreso: 'text-blue-600 bg-blue-100 dark-admin:bg-blue-900/20 dark-admin:text-blue-400',
      resuelto: 'text-green-600 bg-green-100 dark-admin:bg-green-900/20 dark-admin:text-green-400',
      cerrado: 'text-gray-600 bg-gray-100 dark-admin:bg-gray-900/20 dark-admin:text-gray-400',
    }
    return colors[status as keyof typeof colors] || colors.abierto
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      baja: 'text-gray-600',
      media: 'text-blue-600',
      alta: 'text-orange-600',
      urgente: 'text-red-600',
    }
    return colors[priority as keyof typeof colors] || colors.media
  }

  if (loading || !ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg p-6">
          <p className="text-neutral-900 dark-admin:text-slate-100">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark-admin:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
              {ticket.ticket_number}
            </h2>
            <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
              {ticket.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Ticket Info y Controles */}
        <div className="p-6 border-b border-neutral-200 dark-admin:border-slate-700 bg-neutral-50 dark-admin:bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Usuario */}
            <div className="flex items-center space-x-3">
              {ticket.user.avatar_url ? (
                <img
                  src={ticket.user.avatar_url}
                  alt={ticket.user.full_name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 dark-admin:bg-green-900/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600 dark-admin:text-green-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                  {ticket.user.full_name}
                </p>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400">
                  {ticket.user.email}
                </p>
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-center space-x-2 text-sm text-neutral-600 dark-admin:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(ticket.created_at), "d 'de' MMMM, yyyy HH:mm", { locale: es })}</span>
            </div>
          </div>

          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Estado
              </label>
              <select
                value={ticket.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 text-sm"
              >
                <option value="abierto">Abierto</option>
                <option value="en_progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Prioridad
              </label>
              <select
                value={ticket.priority}
                onChange={(e) => handleUpdatePriority(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 text-sm"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            {/* Asignado a */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Asignado a
              </label>
              <select
                value={ticket.assigned_to || ''}
                onChange={(e) => handleAssign(e.target.value || null)}
                className="w-full px-3 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 text-sm"
              >
                <option value="">Sin asignar</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción del problema */}
          <div className="mt-4 p-4 bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700">
            <p className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Descripción del problema:
            </p>
            <p className="text-sm text-neutral-600 dark-admin:text-slate-400 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Conversación */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
              <p className="text-neutral-600 dark-admin:text-slate-400">
                No hay mensajes aún. Sé el primero en responder.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user.role === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.user.role === 'admin'
                      ? 'bg-green-100 dark-admin:bg-green-900/20'
                      : 'bg-neutral-100 dark-admin:bg-slate-700'
                  } rounded-lg p-4`}
                >
                  {message.is_internal && (
                    <div className="flex items-center space-x-2 text-orange-600 dark-admin:text-orange-400 text-xs mb-2">
                      <Lock className="w-3 h-3" />
                      <span>Nota interna - Solo visible para admins</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                      {message.user.full_name}
                    </p>
                    <span className="text-xs text-neutral-500 dark-admin:text-slate-400">
                      {format(new Date(message.created_at), 'HH:mm', { locale: es })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark-admin:text-slate-300 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input de respuesta */}
        <div className="p-6 border-t border-neutral-200 dark-admin:border-slate-700">
          <div className="flex items-start space-x-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={3}
              className="flex-1 px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 resize-none"
              disabled={sending}
            />
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
              <label className="flex items-center space-x-2 text-sm text-neutral-600 dark-admin:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded"
                />
                <Lock className="w-4 h-4" />
                <span>Nota interna</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
