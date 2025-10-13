'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, User, Bot, Star, MapPin, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  coaches?: any[] // Para mostrar tarjetas de entrenadores
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente virtual de Padeliner. ¿En qué puedo ayudarte hoy? Puedo ayudarte a encontrar entrenadores, responder preguntas sobre nuestros servicios o conectarte con nuestro equipo de soporte.',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, profile } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Prevenir scroll del body cuando el chat está abierto en móvil
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  // Scroll automático cuando el input obtiene focus (móvil)
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        scrollToBottom()
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          conversationId,
          userId: user?.id,
          userEmail: user?.email,
          userName: profile?.full_name || 'Usuario',
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        coaches: data.coaches,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Si se detecta intención de contacto humano
      if (data.needsHumanSupport) {
        setTimeout(() => {
          const supportMessage: Message = {
            id: `assistant_${Date.now()}_support`,
            role: 'assistant',
            content: '📧 He notificado a nuestro equipo de soporte. Te contactarán pronto por email. ¿Hay algo más en lo que pueda ayudarte mientras tanto?',
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, supportMessage])
        }, 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:bottom-6 md:right-6 md:left-auto md:top-auto z-[9999] w-full md:w-96 h-full md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 md:border md:border-neutral-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Asistente Padeliner</h3>
                <p className="text-xs text-primary-100">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-neutral-50" style={{ WebkitOverflowScrolling: 'touch' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white border-2 border-primary-500 text-primary-600'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-neutral-900 border border-neutral-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Coach Cards */}
                    {message.coaches && message.coaches.length > 0 && (
                      <div className="mt-2 space-y-3">
                        {message.coaches.map((coach) => (
                          <Link
                            key={coach.id}
                            href={`/entrenador/${coach.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                          >
                            {/* Image */}
                            <div className="relative h-32 overflow-hidden">
                              <img
                                src={coach.imageUrl}
                                alt={coach.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Entrenador'
                                }}
                              />
                              {coach.isFeatured && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center">
                                  <Star className="w-3 h-3 mr-1 fill-yellow-900" />
                                  DESTACADO
                                </div>
                              )}
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-white rounded-lg shadow-lg">
                                <p className="text-xs font-bold text-primary-600">{coach.pricePerHour}€/h</p>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                              <h4 className="text-sm font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                                {coach.name}
                              </h4>
                              
                              <div className="flex items-center space-x-1 mb-2">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-semibold text-neutral-900">{coach.rating}</span>
                                <span className="text-xs text-neutral-500">({coach.reviewsCount})</span>
                              </div>

                              <div className="flex items-center text-xs text-neutral-600 mb-2">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{coach.city}</span>
                              </div>

                              <div className="flex flex-wrap gap-1 mb-2">
                                {coach.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                                {coach.specialties.length > 2 && (
                                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                                    +{coach.specialties.length - 2}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <p className="text-neutral-500">
                                  {coach.experience} años exp.
                                </p>
                                {coach.offersHomeService && (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    <span className="font-medium">Desplazamiento</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-neutral-400 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-primary-500 text-primary-600">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 border border-neutral-200">
                    <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neutral-200 p-3 md:p-4 bg-white safe-area-bottom">
            <div className="flex items-end space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none px-4 py-3 text-base md:text-sm disabled:bg-neutral-50 disabled:cursor-not-allowed max-h-32 min-h-[44px]"
                style={{ fontSize: '16px' }} // Previene zoom en iOS
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-11 h-11 md:w-10 md:h-10 bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:bg-neutral-300 text-white rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed touch-manipulation"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center hidden md:block">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}
