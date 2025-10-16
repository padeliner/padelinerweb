'use client'

import { useState, useEffect, Suspense } from 'react'
import { Header } from '@/components/Header'
import { Search, MessageCircle, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChatView } from './chat-modern'
import { VerifiedBadge } from '@/components/VerifiedBadge'

interface Conversation {
  id: string
  name: string
  avatar: string
  role: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  otherUserId: string  // ID del otro usuario en la conversación
  isVerified?: boolean  // Badge de verificación oficial
}

function MensajesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Cargar usuario
  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
    } else {
      router.push('/login')
    }
  }

  // Cargar conversaciones
  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations')
      const data = await res.json()
      
      // DEBUG: Log todas las conversaciones
      console.log('🔍 Conversaciones recibidas:', data.conversations)
      
      // DEBUG: Log específico del admin
      const adminConv = data.conversations?.find((c: any) => 
        c.name?.toLowerCase().includes('padeliner') || c.isVerified
      )
      if (adminConv) {
        console.log('👤 Conversación admin encontrada:', adminConv)
      } else {
        console.log('⚠️ NO se encontró conversación con admin')
      }
      
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Formatear timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es })
    } catch {
      return ''
    }
  }

  // Manejar selección de conversación
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
  }

  // Volver a lista
  const handleBackToList = () => {
    setSelectedConversationId(null)
    router.replace('/mensajes', { scroll: false })
  }

  // Cargar usuario y conversaciones al montar
  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (userId) {
      loadConversations()
    }
  }, [userId])

  // Abrir conversación desde URL
  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (conversationId && conversations.length > 0 && !selectedConversationId) {
      const exists = conversations.find(c => c.id === conversationId)
      if (exists) {
        setSelectedConversationId(conversationId)
        router.replace('/mensajes', { scroll: false })
      }
    }
  }, [searchParams, conversations, selectedConversationId, router])

  // Suscribirse a cambios de presencia en tiempo real
  useEffect(() => {
    if (conversations.length === 0) return

    const supabase = createClient()
    
    // Suscribirse a todos los cambios en user_presence
    const channel = supabase
      .channel('presence-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload: any) => {
          const presence = payload.new
          if (presence) {
            // Actualizar estado online de la conversación afectada
            setConversations(prev => 
              prev.map(conv => 
                conv.otherUserId === presence.user_id
                  ? { ...conv, isOnline: presence.status === 'online' }
                  : conv
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversations.length])

  // Realtime: Actualizar conversaciones
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages'
        },
        () => {
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  // Prevenir scroll del body en móvil cuando chat está abierto
  useEffect(() => {
    if (selectedConversationId && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [selectedConversationId])

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto flex h-[calc(100vh-80px)]">
        {/* Lista de conversaciones */}
        <div 
          className={`
            w-full md:w-96 bg-white border-r border-neutral-200
            ${selectedConversationId ? 'hidden md:block' : 'block'}
          `}
        >
          {/* Search */}
          <div className="p-4 border-b border-neutral-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Conversaciones */}
          <div className="overflow-y-auto h-[calc(100%-73px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle className="w-16 h-16 text-neutral-300 mb-4" />
                <p className="text-neutral-500">
                  {searchTerm ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`
                    w-full p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100
                    ${selectedConversationId === conversation.id ? 'bg-neutral-50' : ''}
                  `}
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
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral-900 truncate">{conversation.name}</h3>
                        <VerifiedBadge isVerified={conversation.isVerified} size="sm" />
                      </div>
                      <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                        {formatTimestamp(conversation.timestamp)}
                      </span>
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
        {selectedConversation && userId ? (
          <ChatView
            conversationId={selectedConversationId!}
            conversation={selectedConversation}
            userId={userId}
            onBack={handleBackToList}
          />
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

export default function MensajesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <MensajesPageContent />
    </Suspense>
  )
}
