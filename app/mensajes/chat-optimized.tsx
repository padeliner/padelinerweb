'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Send, Loader2, Check, CheckCheck } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/utils/supabase/client'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  delivered_at?: string | null
  read_at?: string | null
  sender?: {
    full_name: string
    avatar_url: string
  }
}

interface ChatViewProps {
  conversationId: string
  conversation: {
    id: string
    name: string
    avatar: string
    role: string
  }
  userId: string
  onBack: () => void
}

export function ChatView({ conversationId, conversation, userId, onBack }: ChatViewProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Estado para manejar el viewport móvil
  const [viewportHeight, setViewportHeight] = useState(0)

  // Scroll al final (optimizado)
  const scrollToBottom = useCallback((smooth = false) => {
    const container = messagesEndRef.current?.parentElement
    if (!container) return

    const shouldScroll = container.scrollHeight > container.clientHeight
    if (!shouldScroll) return

    if (smooth) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    } else {
      container.scrollTop = container.scrollHeight
    }
  }, [])

  // Cargar mensajes
  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/messages/${conversationId}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setTimeout(() => scrollToBottom(false), 100)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [conversationId, scrollToBottom])

  // Marcar como leído
  const markAsRead = useCallback(async () => {
    try {
      await fetch(`/api/messages/${conversationId}/mark-read`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }, [conversationId])

  // Typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    try {
      await fetch(`/api/messages/${conversationId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping })
      })
    } catch (error) {
      console.error('Error sending typing indicator:', error)
    }
  }, [conversationId])

  // Enviar mensaje
  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || sending) return

    // Detener typing indicator
    sendTypingIndicator(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    const textToSend = messageText.trim()
    setSending(true)
    
    // Limpiar input ANTES de enviar (previene cierre de teclado)
    setMessageText('')

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textToSend })
      })

      if (res.ok) {
        setTimeout(() => scrollToBottom(false), 100)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Restaurar mensaje si falla
      setMessageText(textToSend)
    } finally {
      setSending(false)
    }
  }, [messageText, sending, conversationId, sendTypingIndicator, scrollToBottom])

  // Manejar cambio de texto con typing indicator
  const handleTextChange = useCallback((text: string) => {
    setMessageText(text)

    if (text.trim()) {
      sendTypingIndicator(true)
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false)
      }, 3000)
    } else {
      sendTypingIndicator(false)
    }
  }, [sendTypingIndicator])

  // Visual Viewport API para móviles (Android/iOS)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewportHeight(window.visualViewport?.height || 0)
      }
    }

    handleResize()
    window.visualViewport.addEventListener('resize', handleResize)
    window.visualViewport.addEventListener('scroll', handleResize)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('scroll', handleResize)
    }
  }, [])

  // Cargar mensajes al montar
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Marcar como leído al montar
  useEffect(() => {
    markAsRead()
  }, [markAsRead])

  // Realtime: Mensajes
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          const newMessage = payload.new as Message
          setMessages(prev => {
            if (prev.find(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
          
          if (newMessage.sender_id !== userId) {
            setTimeout(() => markAsRead(), 1000)
          }
          
          setTimeout(() => scrollToBottom(true), 100)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          const updated = payload.new as Message
          setMessages(prev => prev.map(m => m.id === updated.id ? updated : m))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId, supabase, markAsRead, scrollToBottom])

  // Realtime: Typing indicator
  useEffect(() => {
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_typing_indicators',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          if (payload.new.user_id !== userId) {
            setIsOtherUserTyping(true)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'direct_typing_indicators',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          if (payload.old.user_id !== userId) {
            setIsOtherUserTyping(false)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId, supabase])

  // Scroll cuando aparece typing indicator
  useEffect(() => {
    if (isOtherUserTyping) {
      setTimeout(() => scrollToBottom(true), 100)
    }
  }, [isOtherUserTyping, scrollToBottom])

  // Cleanup typing indicator al desmontar
  useEffect(() => {
    return () => {
      sendTypingIndicator(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [sendTypingIndicator])

  // Calcular altura del contenedor
  const containerHeight = viewportHeight > 0 && window.innerWidth < 768
    ? `${viewportHeight}px`
    : '100dvh'

  return (
    <div 
      ref={containerRef}
      className="flex flex-col bg-white fixed inset-0 z-[9999] md:relative md:z-auto md:flex-1"
      style={{ height: containerHeight, maxHeight: containerHeight }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-200 flex items-center gap-3 bg-white">
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-700" />
        </button>
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 truncate">{conversation.name}</h3>
          <p className="text-sm text-neutral-500 truncate">{conversation.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
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
            <div
              key={message.id}
              className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender_id === userId
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
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

        {/* Typing indicator */}
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

      {/* Input */}
      <div 
        className="flex-shrink-0 border-t border-neutral-200 bg-white p-3 md:p-4"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-end gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe un mensaje..."
            value={messageText}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={sending}
            className="flex-1 min-w-0 px-4 py-3 text-base border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none disabled:opacity-50 transition-colors"
            style={{ fontSize: '16px' }}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="flex-shrink-0 w-11 h-11 md:w-auto md:h-auto md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:bg-neutral-300 text-white font-semibold rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed"
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
        </form>
      </div>
    </div>
  )
}
