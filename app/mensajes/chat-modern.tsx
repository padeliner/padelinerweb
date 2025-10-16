'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Send, Loader2, CheckCheck, Check, MoreVertical, User, BellOff, Bell, Trash2, AlertCircle, Reply, Copy } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/utils/supabase/client'
import { UserPresenceIndicator } from '@/components/UserPresenceIndicator'
import { useUserPresence } from '@/hooks/useUserPresence'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { validateMessage } from '@/utils/messageValidation'
import { MessageBlockedWarning } from '@/components/MessageBlockedWarning'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  delivered_at?: string | null
  read_at?: string | null
}

interface ChatViewProps {
  conversationId: string
  conversation: {
    id: string
    name: string
    avatar: string
    role: string
    otherUserId: string  // ID del otro usuario para mostrar presencia
    isVerified?: boolean  // Badge de verificación oficial
  }
  userId: string
  userRole: string  // Para detectar si es admin
  onBack: () => void
}

export function ChatView({ conversationId, conversation, userId, userRole, onBack }: ChatViewProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const [blockedWarning, setBlockedWarning] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string; content: string } | null>(null)
  const [replyingTo, setReplyingTo] = useState<{ id: string; content: string; senderName: string } | null>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = useCallback((smooth = false) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    })
  }, [])

  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/messages/${conversationId}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setTimeout(() => scrollToBottom(false), 100)
    } finally {
      setLoading(false)
    }
  }, [conversationId, scrollToBottom])

  const markAsRead = useCallback(async () => {
    try {
      await fetch(`/api/messages/${conversationId}/mark-read`, { method: 'POST' })
    } catch {}
  }, [conversationId])

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    try {
      await fetch(`/api/messages/${conversationId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping })
      })
    } catch {}
  }, [conversationId])

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || sending) return

    const textToSend = messageText.trim()
    const isAdmin = userRole === 'admin'
    
    // 🛡️ VALIDACIÓN: Prevenir teléfonos, URLs, insultos, etc. (excepto admins)
    const validation = validateMessage(textToSend, isAdmin)
    if (!validation.isValid) {
      setBlockedWarning(validation.reason || 'Mensaje no permitido')
      return
    }
    
    setMessageText('')
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    
    sendTypingIndicator(false)
    setSending(true)

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textToSend })
      })

      if (res.ok) {
        setTimeout(() => scrollToBottom(true), 100)
      } else {
        const error = await res.json()
        setBlockedWarning(error.error || 'Error al enviar mensaje')
        setMessageText(textToSend)
      }
    } catch {
      setBlockedWarning('Error de conexión. Intenta nuevamente.')
      setMessageText(textToSend)
    } finally {
      setSending(false)
    }
  }, [messageText, sending, conversationId, scrollToBottom, sendTypingIndicator, userRole])

  const handleTextChange = useCallback((text: string) => {
    setMessageText(text)

    if (text.trim()) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      sendTypingIndicator(true)
      typingTimeoutRef.current = setTimeout(() => sendTypingIndicator(false), 3000)
    } else {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      sendTypingIndicator(false)
    }
  }, [sendTypingIndicator])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  useEffect(() => {
    markAsRead()
  }, [markAsRead])

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        const newMessage = payload.new as Message
        setMessages(prev => prev.find(m => m.id === newMessage.id) ? prev : [...prev, newMessage])
        if (newMessage.sender_id !== userId) setTimeout(() => markAsRead(), 1000)
        setTimeout(() => scrollToBottom(true), 100)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'direct_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as Message : m))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId, supabase, markAsRead, scrollToBottom])

  useEffect(() => {
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_typing_indicators',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        if (payload.new.user_id !== userId) setIsOtherUserTyping(true)
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'direct_typing_indicators',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        if (payload.old.user_id !== userId) setIsOtherUserTyping(false)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId, supabase])

  useEffect(() => {
    if (isOtherUserTyping) setTimeout(() => scrollToBottom(true), 100)
  }, [isOtherUserTyping, scrollToBottom])

  useEffect(() => {
    if (messages.length > 0) setTimeout(() => scrollToBottom(true), 100)
  }, [messages, scrollToBottom])

  useEffect(() => {
    return () => {
      sendTypingIndicator(false)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [sendTypingIndicator])

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  // Cerrar menú contextual al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null)
      }
    }

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contextMenu])

  // Handlers del menú
  const handleViewProfile = () => {
    setShowMenu(false)
    window.location.href = `/entrenador/${conversation.otherUserId}`
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    setShowMenu(false)
    // TODO: Guardar preferencia en localStorage o DB
  }

  const handleDeleteConversation = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.')) {
      return
    }
    
    setShowMenu(false)
    
    try {
      // TODO: Implementar endpoint para eliminar conversación
      onBack()
    } catch (error) {
      alert('Error al eliminar la conversación')
    }
  }

  const handleReport = () => {
    setShowMenu(false)
    if (confirm('¿Quieres reportar este usuario por comportamiento inapropiado?')) {
      // TODO: Implementar sistema de reportes
      alert('Gracias por tu reporte. Lo revisaremos pronto.')
    }
  }

  // Handlers del menú contextual de mensajes
  const handleContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      messageId: message.id,
      content: message.content
    })
  }

  const handleTouchStart = (message: Message) => {
    longPressTimerRef.current = setTimeout(() => {
      // Vibración táctil si está disponible
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      // Centrar el menú en la pantalla para móvil
      setContextMenu({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        messageId: message.id,
        content: message.content
      })
    }, 500) // 500ms para long press
  }

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleCopyMessage = async () => {
    if (!contextMenu) return
    
    try {
      await navigator.clipboard.writeText(contextMenu.content)
      setContextMenu(null)
    } catch (error) {
      console.error('Error al copiar:', error)
    }
  }

  const handleReplyMessage = () => {
    if (!contextMenu) return
    
    const message = messages.find(m => m.id === contextMenu.messageId)
    if (message) {
      setReplyingTo({
        id: message.id,
        content: message.content,
        senderName: message.sender_id === userId ? 'Tú' : conversation.name
      })
      inputRef.current?.focus()
    }
    setContextMenu(null)
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  // Scroll cuando el input recibe focus (teclado aparece) - igual que WhatsApp
  const handleInputFocus = useCallback(() => {
    // Delay para dar tiempo a que el teclado aparezca
    setTimeout(() => {
      scrollToBottom(true)
    }, 300)
  }, [scrollToBottom])

  // Configurar VirtualKeyboard API (solo móvil)
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return
    
    // @ts-ignore - VirtualKeyboard API
    if ('virtualKeyboard' in navigator) {
      // @ts-ignore
      navigator.virtualKeyboard.overlaysContent = true
    }

    return () => {
      // @ts-ignore
      if ('virtualKeyboard' in navigator) {
        // @ts-ignore
        navigator.virtualKeyboard.overlaysContent = false
      }
    }
  }, [])

  return (
    <div 
      className="chat-container"
    >
      {/* Header */}
      <div className="chat-header">
        <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-neutral-700" />
        </button>
        <div className="relative">
          <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover" />
          <UserPresenceIndicator userId={conversation.otherUserId} showText={false} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-neutral-900 truncate">{conversation.name}</h3>
            <VerifiedBadge isVerified={conversation.isVerified} size="sm" />
          </div>
          <UserPresenceIndicator userId={conversation.otherUserId} showText={true} showLastSeen={true} />
        </div>

        {/* Menú de 3 puntos */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Más opciones"
          >
            <MoreVertical className="w-5 h-5 text-neutral-700" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Si el otro usuario NO es admin, mostrar todas las opciones */}
              {conversation.role !== 'admin' && (
                <>
                  <button
                    onClick={handleViewProfile}
                    className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4 text-neutral-600" />
                    <span className="text-sm text-neutral-900">Ver perfil</span>
                  </button>

                  <button
                    onClick={handleToggleMute}
                    className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                  >
                    {isMuted ? (
                      <>
                        <Bell className="w-4 h-4 text-neutral-600" />
                        <span className="text-sm text-neutral-900">Activar notificaciones</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4 text-neutral-600" />
                        <span className="text-sm text-neutral-900">Silenciar notificaciones</span>
                      </>
                    )}
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-600">Reportar usuario</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />
                </>
              )}

              {/* Eliminar conversación siempre disponible */}
              <button
                onClick={handleDeleteConversation}
                className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Eliminar conversación</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <p className="text-sm">No hay mensajes aún</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-2 cursor-pointer select-none ${message.sender_id === userId ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-900'}`}
                onContextMenu={(e) => handleContextMenu(e, message)}
                onTouchStart={() => handleTouchStart(message)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                <p className="text-sm break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-xs ${message.sender_id === userId ? 'text-primary-100' : 'text-neutral-500'}`}>
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                  {message.sender_id === userId && (
                    <span className="flex-shrink-0">
                      {message.read_at ? (
                        <CheckCheck className="w-4 h-4 text-blue-400" />
                      ) : message.delivered_at ? (
                        <CheckCheck className="w-4 h-4 text-primary-100" />
                      ) : (
                        <Check className="w-4 h-4 text-primary-100" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isOtherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Spacer for keyboard */}
      <div className="chat-keyboard-spacer" />

      {/* Input */}
      <div className="chat-input">
        {/* Barra de respuesta */}
        {replyingTo && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Reply className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-medium text-primary-600">Respondiendo a {replyingTo.senderName}</span>
              </div>
              <p className="text-sm text-neutral-600 truncate">{replyingTo.content}</p>
            </div>
            <button
              onClick={cancelReply}
              className="p-1 hover:bg-neutral-200 rounded-full transition-colors ml-2"
              aria-label="Cancelar respuesta"
            >
              <AlertCircle className="w-5 h-5 text-neutral-500 rotate-45" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 p-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe un mensaje..."
            value={messageText}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !sending) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            onFocus={handleInputFocus}
            disabled={sending}
            className="flex-1 px-4 py-3 text-base border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none disabled:opacity-50"
            style={{ fontSize: '16px' }}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            className="flex-shrink-0 w-11 h-11 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white rounded-xl flex items-center justify-center transition-all"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: grid;
          height: 100dvh;
          grid-template-rows: auto 1fr auto env(keyboard-inset-height, 0px);
          grid-template-areas:
            "header"
            "messages"
            "input"
            "keyboard";
          background: white;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }

        @media (min-width: 768px) {
          .chat-container {
            position: relative;
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
        }

        .chat-header {
          grid-area: header;
          padding: 1rem;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
        }

        .chat-messages {
          grid-area: messages;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }

        .chat-keyboard-spacer {
          grid-area: keyboard;
        }

        .chat-input {
          grid-area: input;
          border-top: 1px solid #e5e5e5;
          background: white;
          padding-bottom: max(env(safe-area-inset-bottom), 0px);
        }

        @media (min-width: 768px) {
          .chat-header {
            flex-shrink: 0;
          }

          .chat-messages {
            flex: 1;
            min-height: 0;
          }

          .chat-keyboard-spacer {
            display: none;
          }

          .chat-input {
            flex-shrink: 0;
          }
        }
      `}</style>

      {/* Advertencia de mensaje bloqueado */}
      {blockedWarning && (
        <MessageBlockedWarning
          reason={blockedWarning}
          onClose={() => setBlockedWarning(null)}
        />
      )}

      {/* Menú contextual de mensajes */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-2xl border border-neutral-200 py-1 z-[10000] min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${Math.min(contextMenu.x, window.innerWidth - 200)}px`,
            top: `${Math.min(contextMenu.y, window.innerHeight - 150)}px`,
          }}
        >
          <button
            onClick={handleReplyMessage}
            className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
          >
            <Reply className="w-4 h-4 text-neutral-600" />
            <span className="text-sm text-neutral-900">Responder</span>
          </button>
          
          <button
            onClick={handleCopyMessage}
            className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors"
          >
            <Copy className="w-4 h-4 text-neutral-600" />
            <span className="text-sm text-neutral-900">Copiar</span>
          </button>
        </div>
      )}
    </div>
  )
}
