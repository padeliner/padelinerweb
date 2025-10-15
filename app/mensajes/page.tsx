'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/Header'
import { Search, MessageCircle, ArrowLeft, Send, Loader2, Check, CheckCheck } from 'lucide-react'
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  delivered_at?: string | null
  read_at?: string | null
  sender?: {
    id: string
    full_name: string
    avatar_url: string
  }
}

interface Conversation {
  id: string
  name: string
  avatar: string
  role: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
}

export default function MensajesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [messageText, setMessageText] = useState('')
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Cargar usuario y conversaciones
  useEffect(() => {
    loadUser()
  }, [])

  // Suscribirse a actualizaciones de conversaciones en tiempo real
  useEffect(() => {
    if (!userId) return

    // Escuchar nuevos mensajes en cualquier conversación
    const conversationsChannel = supabase
      .channel('all-conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        () => {
          // Cuando llega un nuevo mensaje, actualizar la lista de conversaciones
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(conversationsChannel)
    }
  }, [userId])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)
    loadConversations()
  }

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations')
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (selectedConversationId) {
      setMessages([]) // Limpiar mensajes anteriores
      loadMessages(selectedConversationId)
    }
  }, [selectedConversationId])

  // Suscribirse a nuevos mensajes en tiempo real
  useEffect(() => {
    if (!selectedConversationId) return

    console.log('Suscribiendo a mensajes en tiempo real...')

    // Canal de Realtime para nuevos mensajes
    const channel = supabase
      .channel(`messages:${selectedConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${selectedConversationId}`
        },
        (payload: any) => {
          console.log('Nuevo mensaje recibido:', payload)
          const newMessage = payload.new as Message
          
          // Añadir mensaje si no existe
          setMessages(prev => {
            if (prev.find(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
          
          // Marcar como entregado si no somos el remitente
          if (newMessage.sender_id !== userId) {
            markAsDelivered(newMessage.id)
            
            // Marcar como leído automáticamente si estamos viendo el chat
            // Esperamos 1 segundo para que el usuario "vea" el mensaje
            setTimeout(() => {
              console.log('📖 Auto-marcando mensaje como leído (conversación abierta)')
              markConversationAsRead()
            }, 1000)
          }
          
          // Auto-scroll si el usuario no está scrolleando arriba
          setTimeout(() => {
            const element = messagesEndRef.current
            if (element) {
              const parent = element.parentElement
              if (parent) {
                const isNearBottom = parent.scrollHeight - parent.scrollTop - parent.clientHeight < 200
                if (isNearBottom) {
                  scrollToBottom()
                }
              }
            }
          }, 100)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${selectedConversationId}`
        },
        (payload: any) => {
          console.log('🔵 UPDATE recibido:', payload)
          console.log('🔵 Payload completo:', JSON.stringify(payload, null, 2))
          const updatedMessage = payload.new as Message
          
          console.log('🔵 Mensaje actualizado ID:', updatedMessage.id)
          console.log('🔵 delivered_at:', updatedMessage.delivered_at)
          console.log('🔵 read_at:', updatedMessage.read_at)
          
          // Actualizar el mensaje con los checks
          setMessages(prev => {
            const updated = prev.map(m => {
              if (m.id === updatedMessage.id) {
                console.log('✅ Actualizando mensaje en state:', m.id)
                return updatedMessage
              }
              return m
            })
            return updated
          })
        }
      )
      .subscribe((status: any) => {
        console.log('Estado suscripción mensajes:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversationId, userId])

  // Suscribirse a typing indicators
  useEffect(() => {
    if (!selectedConversationId || !userId) return

    let typingTimeout: NodeJS.Timeout | null = null

    const typingChannel = supabase
      .channel(`typing:${selectedConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_typing_indicators',
          filter: `conversation_id=eq.${selectedConversationId}`
        },
        (payload: any) => {
          console.log('Typing indicator INSERT:', payload)
          const indicator = payload.new
          // Solo mostrar si NO es el usuario actual
          if (indicator.user_id !== userId) {
            setIsOtherUserTyping(true)
            
            // Auto-limpiar después de 5 segundos (por si no llega DELETE)
            if (typingTimeout) clearTimeout(typingTimeout)
            typingTimeout = setTimeout(() => {
              setIsOtherUserTyping(false)
            }, 5000)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_typing_indicators',
          filter: `conversation_id=eq.${selectedConversationId}`
        },
        (payload: any) => {
          console.log('Typing indicator UPDATE:', payload)
          const indicator = payload.new
          if (indicator.user_id !== userId) {
            setIsOtherUserTyping(true)
            
            // Renovar timeout
            if (typingTimeout) clearTimeout(typingTimeout)
            typingTimeout = setTimeout(() => {
              setIsOtherUserTyping(false)
            }, 5000)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'direct_typing_indicators',
          filter: `conversation_id=eq.${selectedConversationId}`
        },
        (payload: any) => {
          console.log('Typing indicator DELETE:', payload)
          setIsOtherUserTyping(false)
          if (typingTimeout) clearTimeout(typingTimeout)
        }
      )
      .subscribe((status: any) => {
        console.log('Estado suscripción typing:', status)
      })

    return () => {
      supabase.removeChannel(typingChannel)
      setIsOtherUserTyping(false)
      if (typingTimeout) clearTimeout(typingTimeout)
    }
  }, [selectedConversationId, userId])

  // Marcar mensajes como leídos cuando se abre la conversación
  useEffect(() => {
    if (selectedConversationId && userId) {
      console.log('📖 Marcando conversación como leída:', selectedConversationId)
      markConversationAsRead()
    }
  }, [selectedConversationId, userId])

  // Auto-scroll cuando aparece "escribiendo..."
  useEffect(() => {
    if (isOtherUserTyping) {
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [isOtherUserTyping])

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/messages/${conversationId}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const scrollToBottom = () => {
    // Hacer scroll solo en el contenedor de mensajes, no en toda la página
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }

  // Marcar mensaje como entregado
  const markAsDelivered = async (messageId: string) => {
    if (!selectedConversationId) return
    
    try {
      await fetch(`/api/messages/${selectedConversationId}/mark-delivered`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      })
    } catch (error) {
      console.error('Error marking as delivered:', error)
    }
  }

  // Marcar conversación como leída
  const markConversationAsRead = async () => {
    if (!selectedConversationId) return
    
    console.log('📖 Llamando API mark-read para conversación:', selectedConversationId)
    
    try {
      const response = await fetch(`/api/messages/${selectedConversationId}/mark-read`, {
        method: 'POST'
      })
      
      const data = await response.json()
      console.log('📖 Respuesta mark-read:', data)
      
      if (!response.ok) {
        console.error('❌ Error en mark-read:', data)
      } else {
        console.log('✅ Mensajes marcados como leídos:', data.markedCount)
      }
    } catch (error) {
      console.error('❌ Error marking as read:', error)
    }
  }

  // Enviar indicador de escritura
  const sendTypingIndicator = async (isTyping: boolean) => {
    if (!selectedConversationId) return
    
    try {
      await fetch(`/api/messages/${selectedConversationId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping })
      })
    } catch (error) {
      console.error('Error sending typing indicator:', error)
    }
  }

  // Manejar cambio en el input (typing indicator)
  const handleMessageTextChange = (text: string) => {
    setMessageText(text)

    // Enviar "está escribiendo"
    if (text.trim() && !typingTimeoutRef.current) {
      sendTypingIndicator(true)
    }

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Si hay texto, programar "dejó de escribir" en 3 segundos
    if (text.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false)
        typingTimeoutRef.current = null
      }, 3000)
    } else {
      // Si borra todo, enviar inmediatamente "dejó de escribir"
      sendTypingIndicator(false)
      typingTimeoutRef.current = null
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    // Solo mostrar overlay en móvil
    if (window.innerWidth < 768) {
      setShowChatOnMobile(true)
    }
  }

  const handleBackToList = () => {
    setShowChatOnMobile(false)
    setSelectedConversationId(null)
  }

  // Prevenir scroll del body cuando el chat está abierto en móvil
  useEffect(() => {
    if (showChatOnMobile && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [showChatOnMobile])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId || sending) return

    // Detener indicador de escritura
    sendTypingIndicator(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    setSending(true)
    try {
      const res = await fetch(`/api/messages/${selectedConversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageText.trim() })
      })

      if (res.ok) {
        const { message } = await res.json()
        setMessages(prev => [...prev, message])
        setMessageText('')
        setTimeout(scrollToBottom, 100)
        // Actualizar conversaciones
        loadConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return 'Ayer'
    } else {
      return format(date, 'd MMM', { locale: es })
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full min-h-0">
        {/* Conversations List */}
        <div className={`w-full md:w-96 border-r border-neutral-200 flex flex-col bg-white min-h-0 ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-neutral-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-neutral-500">
                <MessageCircle className="w-12 h-12 mb-2 text-neutral-300" />
                <p className="text-sm">No hay conversaciones</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 ${
                    selectedConversationId === conversation.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-neutral-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">{formatTimestamp(conversation.timestamp)}</span>
                    </div>
                    <p className="text-sm text-neutral-500 mb-1">{conversation.role}</p>
                    <p className="text-sm text-neutral-600 truncate">{conversation.lastMessage}</p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0 ml-2">
                      <span className="w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div 
            className={`
              flex-1 flex-col bg-white min-h-0
              ${showChatOnMobile ? 'flex fixed inset-0 z-[9999]' : 'hidden'}
              md:flex md:relative md:z-auto
            `}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center space-x-3 flex-shrink-0 bg-white">
              {/* Back Button - Solo móvil */}
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors -ml-2"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-700" />
              </button>
              <div className="relative flex-shrink-0">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 truncate">{selectedConversation.name}</h3>
                <p className="text-sm text-neutral-500 truncate">{selectedConversation.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  <div className="flex flex-col items-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-sm">Cargando mensajes...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  <p className="text-sm">No hay mensajes aún</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] md:max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender_id === userId
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className={`text-xs ${message.sender_id === userId ? 'text-primary-100' : 'text-neutral-500'}`}>
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                        {/* Checks de WhatsApp - Solo para mensajes propios */}
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

              {/* Indicador de "escribiendo..." */}
              {isOtherUserTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-neutral-200 bg-white safe-area-bottom flex-shrink-0">
              <div className="p-3 md:p-4 max-w-full">
                <div className="flex items-end gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={messageText}
                    onChange={(e) => handleMessageTextChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                    disabled={sending}
                    className="flex-1 min-w-0 px-4 py-3 text-base md:text-sm border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none disabled:opacity-50"
                    style={{ fontSize: '16px' }}
                    autoComplete="off"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                    className="flex-shrink-0 w-11 h-11 md:w-auto md:h-auto md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:bg-neutral-300 text-white font-semibold rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed touch-manipulation"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden md:inline">Enviar</span>
                        <Send className="w-5 h-5 md:hidden" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center bg-neutral-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Selecciona una conversación para empezar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
