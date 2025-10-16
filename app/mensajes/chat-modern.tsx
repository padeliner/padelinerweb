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
        setMessageText(textToSend)
      }
    } catch {
      setMessageText(textToSend)
    } finally {
      setSending(false)
    }
  }, [messageText, sending, conversationId, scrollToBottom, sendTypingIndicator])

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

  return (
    <div className="flex flex-col h-full bg-white fixed inset-0 z-[9999] md:relative md:z-auto md:flex-1">
      <div className="flex-shrink-0 p-4 border-b border-neutral-200 flex items-center gap-3 bg-white">
        <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-neutral-700" />
        </button>
        <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 truncate">{conversation.name}</h3>
          <p className="text-sm text-neutral-500 truncate">{conversation.role}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
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
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.sender_id === userId ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
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

      <div className="flex-shrink-0 border-t border-neutral-200 p-4 bg-white">
        <div className="flex items-end gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={messageText}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
            disabled={sending}
            className="flex-1 px-4 py-3 text-base border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none disabled:opacity-50"
            style={{ fontSize: '16px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
            className="flex-shrink-0 w-11 h-11 md:w-auto md:h-auto md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white rounded-xl flex items-center justify-center transition-all"
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
  )
}
