'use client'

import { useState, useEffect } from 'react'
import { Plus, Send, FileText, Inbox as InboxIcon } from 'lucide-react'
import InboxSidebar from './InboxSidebar'
import ConversationList from './ConversationList'
import ConversationDetail from './ConversationDetail'
import { Conversation } from './types'
import { ComposeEmailModal } from '../ComposeEmailModal'
import { EmailTemplatesTab } from '../EmailTemplatesTab'
import { SentEmailsTab } from './SentEmailsTab'

export default function InboxClient() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'templates'>('inbox')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('inbox')
  const [stats, setStats] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showComposeModal, setShowComposeModal] = useState(false)

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
    setRefreshTrigger(prev => prev + 1)
  }

  const handleSendEmail = async (emailData: {
    from: string
    to: string[]
    subject: string
    html: string
    replyTo?: string
  }) => {
    try {
      const response = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMsg = result.error || result.details?.message || 'Error desconocido'
        throw new Error(errorMsg)
      }
      
      setShowComposeModal(false)
      alert('✅ Email enviado correctamente')
      
      // Refresh if on sent tab
      if (activeTab === 'sent') {
        setRefreshTrigger(prev => prev + 1)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el email'
      alert(`❌ ${errorMessage}`)
    }
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Mensajería</h1>
              <p className="text-sm text-neutral-600">Gestiona conversaciones y envía emails</p>
            </div>
            <button
              onClick={() => setShowComposeModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Email</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b -mb-px">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'inbox'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <InboxIcon className="w-4 h-4" />
                <span>Conversaciones</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sent'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Emails Enviados</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'templates'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Plantillas</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'inbox' && (
          <div className="h-full flex">
            <InboxSidebar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              stats={stats}
            />
            <ConversationList
              filter={activeFilter}
              selectedId={selectedConversation?.id}
              onSelect={handleConversationSelect}
              refreshTrigger={refreshTrigger}
            />
            <ConversationDetail
              conversation={selectedConversation}
              onUpdate={handleConversationUpdate}
            />
          </div>
        )}

        {activeTab === 'sent' && (
          <SentEmailsTab refreshTrigger={refreshTrigger} />
        )}

        {activeTab === 'templates' && (
          <EmailTemplatesTab />
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <ComposeEmailModal
          onSend={handleSendEmail}
          onClose={() => setShowComposeModal(false)}
        />
      )}
    </div>
  )
}
