'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Search, MessageCircle, Clock, CheckCheck, Circle } from 'lucide-react'

interface Message {
  id: number
  senderId: number
  text: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: number
  name: string
  avatar: string
  role: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Carlos Martínez",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop",
    role: "Entrenador",
    lastMessage: "Perfecto, nos vemos el lunes a las 17:00 entonces 👍",
    timestamp: "10:30",
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: 1, senderId: 1, text: "Hola! Vi tu perfil y me gustaría tomar clases de pádel", timestamp: "10:15", isRead: true },
      { id: 2, senderId: 2, text: "¡Hola! Encantado de ayudarte. ¿Qué nivel tienes?", timestamp: "10:17", isRead: true },
      { id: 3, senderId: 1, text: "Soy principiante, nunca he jugado antes", timestamp: "10:20", isRead: true },
      { id: 4, senderId: 2, text: "Perfecto, me especializo en iniciación. ¿Te viene bien el lunes por la tarde?", timestamp: "10:25", isRead: true },
      { id: 5, senderId: 1, text: "Sí, me viene genial. ¿A qué hora?", timestamp: "10:28", isRead: true },
      { id: 6, senderId: 2, text: "Perfecto, nos vemos el lunes a las 17:00 entonces 👍", timestamp: "10:30", isRead: false },
    ]
  },
  {
    id: 2,
    name: "Laura Sánchez",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    role: "Entrenadora",
    lastMessage: "Claro, el precio es 40€/hora. ¿Te interesa?",
    timestamp: "Ayer",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, senderId: 1, text: "Hola Laura, ¿das clases grupales?", timestamp: "Ayer 16:30", isRead: true },
      { id: 2, senderId: 2, text: "¡Hola! Sí, tengo grupos los miércoles y viernes", timestamp: "Ayer 17:15", isRead: true },
      { id: 3, senderId: 1, text: "Genial, ¿cuál es el precio?", timestamp: "Ayer 17:20", isRead: true },
      { id: 4, senderId: 2, text: "Claro, el precio es 40€/hora. ¿Te interesa?", timestamp: "Ayer 17:25", isRead: true },
    ]
  },
  {
    id: 3,
    name: "Padel Pro Madrid",
    avatar: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100&h=100&fit=crop",
    role: "Club",
    lastMessage: "Tenemos disponibilidad en horario de mañana",
    timestamp: "Mar 15",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, senderId: 1, text: "Hola, ¿tienen clases disponibles para adultos?", timestamp: "Mar 15 11:00", isRead: true },
      { id: 2, senderId: 2, text: "¡Hola! Sí, tenemos varios horarios disponibles", timestamp: "Mar 15 11:30", isRead: true },
      { id: 3, senderId: 2, text: "Tenemos disponibilidad en horario de mañana", timestamp: "Mar 15 11:32", isRead: true },
    ]
  },
  {
    id: 4,
    name: "Miguel Ángel Torres",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "Entrenador",
    lastMessage: "Mi especialidad es entrenamiento de alto rendimiento",
    timestamp: "Mar 10",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, senderId: 1, text: "Hola Miguel, ¿entrenas para competición?", timestamp: "Mar 10 09:00", isRead: true },
      { id: 2, senderId: 2, text: "Mi especialidad es entrenamiento de alto rendimiento", timestamp: "Mar 10 09:15", isRead: true },
    ]
  },
]

export default function MensajesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [messageText, setMessageText] = useState('')

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // Aquí se enviaría el mensaje en la implementación real
      console.log('Enviando mensaje:', messageText)
      setMessageText('')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="bg-white border-b border-neutral-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900">Mensajes</h1>
            <p className="text-neutral-600 mt-1">Chatea con entrenadores y clubes</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden h-[calc(100vh-280px)] flex">
            {/* Conversations List */}
            <div className="w-full md:w-96 border-r border-neutral-200 flex flex-col">
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
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex items-start space-x-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 ${
                      selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
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
                        <span className="text-xs text-neutral-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
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
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col hidden md:flex">
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200 flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{selectedConversation.name}</h3>
                    <p className="text-sm text-neutral-500">{selectedConversation.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === 1
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className={`text-xs ${message.senderId === 1 ? 'text-primary-100' : 'text-neutral-500'}`}>
                            {message.timestamp}
                          </span>
                          {message.senderId === 1 && (
                            message.isRead ? (
                              <CheckCheck className="w-3 h-3 text-primary-100" />
                            ) : (
                              <CheckCheck className="w-3 h-3 text-primary-200" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-neutral-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Enviar
                    </button>
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
      </div>

      <Footer />
    </div>
  )
}
