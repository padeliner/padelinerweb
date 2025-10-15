'use client'

import { Search, Inbox, User, Users, FolderOpen, Circle } from 'lucide-react'
import { ConversationStats, FilterType } from './types'

interface InboxSidebarProps {
  activeFilter: string
  onFilterChange: (filter: FilterType) => void
  stats: ConversationStats | null
}

export default function InboxSidebar({ activeFilter, onFilterChange, stats }: InboxSidebarProps) {
  const filters = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: stats?.byStatus.new || 0 },
    { id: 'mine', label: 'Míos', icon: User, count: stats?.myConversations || 0 },
    { id: 'team', label: 'Mi Equipo', icon: Users, count: 0 },
    { id: 'unassigned', label: 'Sin Asignar', icon: FolderOpen, count: stats?.unassigned || 0 },
  ]

  const statusFilters = [
    { id: 'new', label: 'Nuevos', count: stats?.byStatus.new || 0, color: 'text-blue-600' },
    { id: 'open', label: 'Abiertos', count: stats?.byStatus.open || 0, color: 'text-green-600' },
    { id: 'pending', label: 'Pendientes', count: stats?.byStatus.pending || 0, color: 'text-orange-600' },
    { id: 'solved', label: 'Resueltos', count: stats?.byStatus.solved || 0, color: 'text-emerald-600' },
    { id: 'closed', label: 'Cerrados', count: stats?.byStatus.closed || 0, color: 'text-gray-600' },
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
          <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Vistas</h3>
          <div className="space-y-1">
            {filters.map(filter => {
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
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{filter.label}</span>
                  </div>
                  {filter.count > 0 && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary-100' : 'bg-neutral-100'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
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
