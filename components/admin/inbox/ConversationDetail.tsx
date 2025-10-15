'use client'

import { useState, useEffect } from 'react'
import { Conversation, Message } from './types'
import { User, Mail, Phone, Clock, Tag, ChevronDown, Send, StickyNote, X } from 'lucide-react'
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

      if (res.ok) {
        setReplyContent('')
        await loadMessages()
        onUpdate()
      }
    } catch (error) {
      console.error('Error sending reply:', error)
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
      <div className="border-b p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">
              {conversation.subject}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{conversation.contact_name || conversation.contact_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{conversation.contact_email}</span>
              </div>
              {conversation.contact_phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{conversation.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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

          {/* Team Badge */}
          {conversation.team && (
            <span 
              className="px-3 py-1.5 rounded text-sm font-medium"
              style={{ 
                backgroundColor: `${conversation.team.color}20`,
                color: conversation.team.color 
              }}
            >
              {conversation.team.name}
            </span>
          )}
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
            <div key={message.id} className={`${message.is_internal ? 'bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-neutral-900">
                        {message.from_name || message.from_email}
                      </span>
                      {message.is_internal && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          Nota Interna
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-700">
                    {message.html_content ? (
                      <div dangerouslySetInnerHTML={{ __html: message.html_content }} />
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
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
    </div>
  )
}
