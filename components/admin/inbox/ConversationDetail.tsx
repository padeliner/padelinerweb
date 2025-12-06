'use client'

import { useState, useEffect } from 'react'
import { Conversation, Message } from './types'
import { User, Mail, Phone, Clock, Tag, ChevronDown, ChevronUp, Send, StickyNote, X, Maximize2, Minimize2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface ConversationDetailProps {
  conversation: Conversation | null
  onUpdate: () => void
}

export default function ConversationDetail({ conversation, onUpdate }: ConversationDetailProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [sending, setSending] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [teams, setTeams] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isContactInfoExpanded, setIsContactInfoExpanded] = useState(false)
  const [fullscreenMessage, setFullscreenMessage] = useState<Message | null>(null)

  // Load teams and users for assignment
  useEffect(() => {
    loadTeamsAndUsers()
  }, [])

  const loadTeamsAndUsers = async () => {
    try {
      // Load teams
      const teamsRes = await fetch('/api/admin/teams')
      const teamsData = await teamsRes.json()
      setTeams(teamsData.teams || [])

      // Load users (agentes)
      const usersRes = await fetch('/api/admin/users?role=admin')
      const usersData = await usersRes.json()
      setUsers(usersData.users || [])
    } catch (error) {
      console.error('Error loading teams/users:', error)
    }
  }

  useEffect(() => {
    if (conversation) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [conversation?.id])

  const loadMessages = async () => {
    if (!conversation) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}/messages`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async (andClose = false) => {
    if (!replyContent.trim() || !conversation) return

    setSending(true)
    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          is_internal: false,
          update_status: andClose ? 'closed' : conversation.status === 'new' ? 'open' : undefined
        })
      })

      const data = await res.json()

      if (res.ok) {
        setReplyContent('')
        await loadMessages()
        onUpdate()
        alert('✅ Respuesta enviada al cliente correctamente')
      } else {
        console.error('Error response:', data)
        alert(`❌ Error: ${data.message || data.error || 'No se pudo enviar el email'}`)
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('❌ Error al enviar la respuesta')
    } finally {
      setSending(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteContent.trim() || !conversation) return

    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteContent })
      })

      if (res.ok) {
        setNoteContent('')
        setShowNoteForm(false)
        await loadMessages()
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!conversation) return

    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handlePriorityChange = async (priority: string) => {
    if (!conversation) return

    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      })

      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const handleTeamChange = async (teamId: string) => {
    if (!conversation) return

    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId })
      })

      if (res.ok) {
        const team = teams.find(t => t.id === teamId)
        alert(`✅ Conversación derivada a ${team?.name}`)
        onUpdate()
      }
    } catch (error) {
      console.error('Error changing team:', error)
      alert('❌ Error al derivar conversación')
    }
  }

  const handleAssignUser = async (userId: string | null) => {
    if (!conversation) return

    try {
      const res = await fetch(`/api/admin/conversations/${conversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: userId })
      })

      if (res.ok) {
        if (userId) {
          const user = users.find(u => u.id === userId)
          alert(`✅ Asignado a ${user?.full_name}`)
        } else {
          alert('✅ Asignación eliminada')
        }
        onUpdate()
      }
    } catch (error) {
      console.error('Error assigning user:', error)
      alert('❌ Error al asignar')
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="text-center text-neutral-500">
          <Mail className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <p>Selecciona una conversación para ver los detalles</p>
        </div>
      </div>
    )
  }

  const statusOptions = [
    { value: 'new', label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
    { value: 'open', label: 'Abierto', color: 'bg-green-100 text-green-700' },
    { value: 'pending', label: 'Pendiente', color: 'bg-orange-100 text-orange-700' },
    { value: 'solved', label: 'Resuelto', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'closed', label: 'Cerrado', color: 'bg-gray-100 text-gray-700' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'bg-blue-100 text-blue-700' },
    { value: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-700' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700' }
  ]

  const currentStatus = statusOptions.find(s => s.value === conversation.status)
  const currentPriority = priorityOptions.find(p => p.value === conversation.priority)

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="p-4">
          {/* Subject with toggle button */}
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-bold text-neutral-900 flex-1">
              {conversation.subject}
            </h2>
            <button
              onClick={() => setIsContactInfoExpanded(!isContactInfoExpanded)}
              className="ml-4 p-2 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
              title={isContactInfoExpanded ? "Ocultar información" : "Ver información del contacto"}
            >
              {isContactInfoExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Contact Info Card - Colapsable */}
          {isContactInfoExpanded && (
            <div className="bg-neutral-50 rounded-lg p-4 mb-3">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-3">Información del Contacto</h3>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-xs text-neutral-500">Nombre</span>
                    <p className="font-medium text-neutral-900">
                      {conversation.contact_name || 'Sin nombre'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-xs text-neutral-500">Email</span>
                    <p className="font-medium text-neutral-900">{conversation.contact_email}</p>
                  </div>
                </div>
              </div>
              {conversation.contact_phone && (
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <div>
                      <span className="text-xs text-neutral-500">Teléfono</span>
                      <p className="font-medium text-neutral-900">{conversation.contact_phone}</p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-xs text-neutral-500">Primer mensaje</span>
                    <p className="font-medium text-neutral-900">
                      {formatDistanceToNow(new Date(conversation.first_message_at), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* Actions - Row 1 */}
          <div className="flex items-center space-x-2 mb-3">
            {/* Status Selector */}
            <select
              value={conversation.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${currentStatus?.color}`}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* Priority Selector */}
            <select
              value={conversation.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${currentPriority?.color}`}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Actions - Row 2: Derivación y Asignación */}
          <div className="flex items-center space-x-2">
            {/* Team Selector (Derivar) */}
            <div className="flex-1">
              <label className="text-xs text-neutral-500 mb-1 block">Equipo</label>
              <select
                value={conversation.team_id || ''}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded text-sm border border-neutral-200 focus:ring-2 focus:ring-primary-500"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Selector (Asignar) */}
            <div className="flex-1">
              <label className="text-xs text-neutral-500 mb-1 block">Asignar a</label>
              <select
                value={conversation.assigned_to || ''}
                onChange={(e) => handleAssignUser(e.target.value || null)}
                className="w-full px-3 py-1.5 rounded text-sm border border-neutral-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sin asignar</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-neutral-500">Cargando mensajes...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-neutral-500">No hay mensajes</div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`rounded-lg border ${message.is_internal ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-neutral-200'}`}>
              <div className="p-4">
                {/* Message Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.is_from_customer ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <User className={`w-5 h-5 ${
                        message.is_from_customer ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-neutral-900">
                          {message.from_name || 'Cliente'}
                        </span>
                        {message.is_internal && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-medium">
                            🔒 Nota Interna
                          </span>
                        )}
                        {message.is_from_customer && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                            Cliente
                          </span>
                        )}
                      </div>
                      {!message.is_internal && (
                        <span className="text-xs text-neutral-500">{message.from_email}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-neutral-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: es })}
                    </span>
                    <button
                      onClick={() => setFullscreenMessage(message)}
                      className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
                      title="Ver en pantalla completa"
                    >
                      <Maximize2 className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="prose prose-sm max-w-none">
                  {message.html_content ? (
                    <div dangerouslySetInnerHTML={{ __html: message.html_content }} />
                  ) : (
                    <div className="whitespace-pre-wrap text-neutral-700">{message.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Box */}
      <div className="border-t p-4 bg-neutral-50">
        {showNoteForm ? (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <StickyNote className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">Nota Interna</span>
              </div>
              <button onClick={() => setShowNoteForm(false)}>
                <X className="w-4 h-4 text-yellow-600" />
              </button>
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Escribe una nota interna (solo visible para el equipo)..."
              className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm font-medium"
              >
                Añadir Nota
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNoteForm(true)}
            className="mb-2 text-sm text-neutral-600 hover:text-neutral-900 flex items-center space-x-1"
          >
            <StickyNote className="w-4 h-4" />
            <span>Añadir nota interna</span>
          </button>
        )}

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-neutral-500">
            El mensaje se enviará a {conversation.contact_email}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSendReply(false)}
              disabled={sending || !replyContent.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
            <button
              onClick={() => handleSendReply(true)}
              disabled={sending || !replyContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Enviar y Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Message Modal */}
      {fullscreenMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-neutral-900">
                  {fullscreenMessage.from_name || 'Mensaje'}
                </h3>
                <p className="text-sm text-neutral-500">{fullscreenMessage.from_email}</p>
                <p className="text-xs text-neutral-400">
                  {formatDistanceToNow(new Date(fullscreenMessage.created_at), { addSuffix: true, locale: es })}
                </p>
              </div>
              <button
                onClick={() => setFullscreenMessage(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Message */}
            <div className="flex-1 overflow-y-auto p-6 border-b">
              <h4 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Mensaje Original</h4>
              <div className="prose prose-sm max-w-none">
                {fullscreenMessage.html_content ? (
                  <div dangerouslySetInnerHTML={{ __html: fullscreenMessage.html_content }} />
                ) : (
                  <div className="whitespace-pre-wrap text-neutral-700">{fullscreenMessage.content}</div>
                )}
              </div>
            </div>

            {/* Modal Footer - Reply Area */}
            <div className="p-4 bg-neutral-50">
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Responder</h4>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                rows={4}
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  El mensaje se enviará a {conversation.contact_email}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFullscreenMessage(null)}
                    className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleSendReply(false)
                      setFullscreenMessage(null)
                    }}
                    disabled={sending || !replyContent.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSendReply(true)
                      setFullscreenMessage(null)
                    }}
                    disabled={sending || !replyContent.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar y Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
