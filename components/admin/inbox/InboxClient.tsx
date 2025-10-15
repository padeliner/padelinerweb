'use client'

import { useState, useEffect } from 'react'
import InboxSidebar from './InboxSidebar'
import ConversationList from './ConversationList'
import ConversationDetail from './ConversationDetail'
import { Conversation } from './types'

export default function InboxClient() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('inbox')
  const [stats, setStats] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load stats
  useEffect(() => {
    fetchStats()
  }, [refreshTrigger])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/conversations/stats')
      const data = await res.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleConversationUpdate = () => {
    // Refresh stats and list
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="h-full flex bg-neutral-50">
      {/* Sidebar - 240px */}
      <InboxSidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        stats={stats}
      />

      {/* Conversation List - 400px */}
      <ConversationList
        filter={activeFilter}
        selectedId={selectedConversation?.id}
        onSelect={handleConversationSelect}
        refreshTrigger={refreshTrigger}
      />

      {/* Conversation Detail - Resto */}
      <ConversationDetail
        conversation={selectedConversation}
        onUpdate={handleConversationUpdate}
      />
    </div>
  )
}
