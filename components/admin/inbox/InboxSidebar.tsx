'use client'

import { useState } from 'react'
import { Search, Inbox, User, Users, FolderOpen, Circle, Mail, MessageSquare, Briefcase, AlertCircle, Star, Archive, ChevronDown, ChevronRight } from 'lucide-react'
import { ConversationStats, FilterType } from './types'

interface InboxSidebarProps {
  activeFilter: string
  onFilterChange: (filter: FilterType) => void
  stats: ConversationStats | null
}

export default function InboxSidebar({ activeFilter, onFilterChange, stats }: InboxSidebarProps) {
  const mainFilters = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: stats?.byStatus.new || 0, color: 'text-blue-600' },
    { id: 'mine', label: 'Asignados a Mí', icon: User, count: stats?.myConversations || 0, color: 'text-green-600' },
    { id: 'unassigned', label: 'Sin Asignar', icon: FolderOpen, count: stats?.unassigned || 0, color: 'text-orange-600' },
    { id: 'urgent', label: 'Urgentes', icon: AlertCircle, count: stats?.byPriority?.urgent || 0, color: 'text-red-600' },
  ]

  // NUEVAS SECCIONES POR CANAL/FUENTE
  const channelFilters = [
    { id: 'source:email', label: 'Formulario Contacto', icon: Mail, count: stats?.bySource?.email || 0, emoji: '📧', hasSubcategories: true },
    { id: 'source:chatbot', label: 'Chatbot', icon: MessageSquare, count: stats?.bySource?.chatbot || 0, emoji: '🤖', hasSubcategories: false },
    { id: 'source:form', label: 'Solicitudes Empleo', icon: Briefcase, count: stats?.bySource?.form || 0, emoji: '💼', hasSubcategories: false },
  ]

  // Subcategorías del formulario de contacto
  const contactSubcategories = [
    { id: 'category:general', label: 'Consultas Generales', count: stats?.byCategory?.general || 0, emoji: '💬' },
    { id: 'category:entrenador', label: 'Entrenadores', count: stats?.byCategory?.entrenador || 0, emoji: '🎾' },
    { id: 'category:club', label: 'Clubes', count: stats?.byCategory?.club || 0, emoji: '🏢' },
    { id: 'category:academia', label: 'Academias', count: stats?.byCategory?.academia || 0, emoji: '🎓' },
    { id: 'category:tienda', label: 'Tienda', count: stats?.byCategory?.tienda || 0, emoji: '🛒' },
    { id: 'category:soporte', label: 'Soporte Técnico', count: stats?.byCategory?.soporte || 0, emoji: '🔧' },
    { id: 'category:colaboracion', label: 'Colaboraciones', count: stats?.byCategory?.colaboracion || 0, emoji: '🤝' },
  ]
  
  const [expandedChannels, setExpandedChannels] = useState<Record<string, boolean>>({
    'source:email': false
  })

  const statusFilters = [
    { id: 'new', label: 'Nuevos', count: stats?.byStatus.new || 0, color: 'bg-blue-500' },
    { id: 'open', label: 'Abiertos', count: stats?.byStatus.open || 0, color: 'bg-green-500' },
    { id: 'pending', label: 'Pendientes', count: stats?.byStatus.pending || 0, color: 'bg-orange-500' },
    { id: 'solved', label: 'Resueltos', count: stats?.byStatus.solved || 0, color: 'bg-emerald-500' },
    { id: 'closed', label: 'Cerrados', count: stats?.byStatus.closed || 0, color: 'bg-gray-500' },
  ]

  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Main Filters */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Principal</h3>
          <div className="space-y-1">
            {mainFilters.map(filter => {
              const Icon = filter.icon
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${filter.color}`} />
                    <span className="text-sm font-medium">{filter.label}</span>
                  </div>
                  {filter.count > 0 && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Channel Filters */}
        <div className="p-4 border-t">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Por Canal</h3>
          <div className="space-y-1">
            {channelFilters.map(channel => {
              const Icon = channel.icon
              const isActive = activeFilter === channel.id
              const isExpanded = expandedChannels[channel.id]
              
              return (
                <div key={channel.id}>
                  <button
                    onClick={() => {
                      if (channel.hasSubcategories) {
                        setExpandedChannels({...expandedChannels, [channel.id]: !isExpanded})
                      } else {
                        onFilterChange(channel.id)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-600'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {channel.hasSubcategories && (
                        isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                      )}
                      <span className="text-lg">{channel.emoji}</span>
                      <span className="text-sm font-medium">{channel.label}</span>
                    </div>
                    {channel.count > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {channel.count}
                      </span>
                    )}
                  </button>

                  {/* Subcategorías */}
                  {channel.hasSubcategories && isExpanded && channel.id === 'source:email' && (
                    <div className="ml-6 mt-1 space-y-1">
                      {contactSubcategories.map(subcategory => {
                        const isSubActive = activeFilter === subcategory.id
                        return (
                          <button
                            key={subcategory.id}
                            onClick={() => onFilterChange(subcategory.id)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-sm ${
                              isSubActive
                                ? 'bg-primary-100 text-primary-700'
                                : 'hover:bg-neutral-50 text-neutral-600'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{subcategory.emoji}</span>
                              <span>{subcategory.label}</span>
                            </div>
                            {subcategory.count > 0 && (
                              <span className="text-xs text-neutral-500">{subcategory.count}</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Estados */}
        <div className="p-4 border-t">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Estados</h3>
          <div className="space-y-1">
            {statusFilters.map(status => {
              const isActive = activeFilter === status.id
              return (
                <button
                  key={status.id}
                  onClick={() => onFilterChange(status.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-100'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Circle className={`w-2 h-2 fill-current ${status.color}`} />
                    <span className="text-sm">{status.label}</span>
                  </div>
                  {status.count > 0 && (
                    <span className="text-xs text-neutral-500">{status.count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Teams */}
        {stats?.byTeam && Object.keys(stats.byTeam).length > 0 && (
          <div className="p-4 border-t">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Equipos</h3>
            <div className="space-y-1">
              {Object.entries(stats.byTeam).map(([slug, team]) => {
                const isActive = activeFilter === `team:${slug}`
                return (
                  <button
                    key={slug}
                    onClick={() => onFilterChange(`team:${slug}`)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-neutral-100'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-sm">{team.name}</span>
                    {team.count > 0 && (
                      <span className="text-xs text-neutral-500">{team.count}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
