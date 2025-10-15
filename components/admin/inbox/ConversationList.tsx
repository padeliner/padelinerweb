'use client'

import { useState, useEffect } from 'react'
import { Conversation, ConversationFilters } from './types'
import ConversationItem from './ConversationItem'
import { Loader2 } from 'lucide-react'

interface ConversationListProps {
  filter: string
  selectedId?: string
  onSelect: (conversation: Conversation) => void
  refreshTrigger: number
}

export default function ConversationList({ filter, selectedId, onSelect, refreshTrigger }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [filter, refreshTrigger])

  const loadConversations = async (pageNum = 1) => {
    setLoading(true)
    try {
      const filters: ConversationFilters = buildFilters(filter)
      const params = new URLSearchParams({
        ...filters,
        page: pageNum.toString(),
        limit: '20'
      } as any)

      const res = await fetch(`/api/admin/conversations?${params}`)
      const data = await res.json()

      if (pageNum === 1) {
        setConversations(data.conversations || [])
        // Auto-select first if none selected
        if (data.conversations?.length > 0 && !selectedId) {
          onSelect(data.conversations[0])
        }
      } else {
        setConversations(prev => [...prev, ...(data.conversations || [])])
      }

      setHasMore(data.pagination.page < data.pagination.totalPages)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const buildFilters = (filterString: string): ConversationFilters => {
    const filters: ConversationFilters = {}

    if (filterString === 'inbox') {
      filters.status = 'new'
    } else if (filterString === 'mine') {
      filters.assigned_to = 'me'
    } else if (filterString === 'unassigned') {
      filters.assigned_to = 'unassigned'
    } else if (filterString === 'urgent') {
      filters.priority = 'urgent'
    } else if (filterString.startsWith('source:')) {
      // Extract source (email, chatbot, form)
      const source = filterString.split(':')[1]
      filters.source = source
    } else if (filterString.startsWith('team:')) {
      // Extract team slug
      const teamSlug = filterString.split(':')[1]
      filters.team = teamSlug
    } else if (['new', 'open', 'pending', 'solved', 'closed'].includes(filterString)) {
      filters.status = filterString
    }

    return filters
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadConversations(page + 1)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="w-96 border-r bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="w-96 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-neutral-900">
          Conversaciones
          <span className="ml-2 text-sm text-neutral-500">({conversations.length})</span>
        </h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <p>No hay conversaciones</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedId}
                onClick={() => onSelect(conversation)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="p-4">
            <button
              onClick={loadMore}
              className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Cargar más
            </button>
          </div>
        )}

        {loading && page > 1 && (
          <div className="p-4 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
          </div>
        )}
      </div>
    </div>
  )
}
