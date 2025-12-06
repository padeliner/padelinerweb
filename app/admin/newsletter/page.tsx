'use client'

import { useState, useEffect } from 'react'
import { Send, Users, Mail, TrendingUp, Plus, Edit, Trash2, Eye } from 'lucide-react'
import CreateCampaignModal from '@/components/admin/newsletter/CreateCampaignModal'

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers')
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalCampaigns: 0,
    sentCampaigns: 0
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'subscribers') {
        await loadSubscribers()
      } else {
        await loadCampaigns()
      }
      await loadStats()
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubscribers = async () => {
    const res = await fetch('/api/admin/newsletter/subscribers')
    const data = await res.json()
    setSubscribers(data.subscribers || [])
  }

  const loadCampaigns = async () => {
    const res = await fetch('/api/admin/newsletter/campaigns')
    const data = await res.json()
    setCampaigns(data.campaigns || [])
  }

  const loadStats = async () => {
    const res = await fetch('/api/admin/newsletter/stats')
    const data = await res.json()
    setStats(data.stats || stats)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Newsletter</h1>
          <p className="text-neutral-600 mt-1">Gestiona tus suscriptores y campañas de email</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Campaña</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.totalSubscribers}</p>
          <p className="text-sm text-neutral-600">Total Suscriptores</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.activeSubscribers}</p>
          <p className="text-sm text-neutral-600">Activos</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.totalCampaigns}</p>
          <p className="text-sm text-neutral-600">Campañas Creadas</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats.sentCampaigns}</p>
          <p className="text-sm text-neutral-600">Campañas Enviadas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'subscribers'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Suscriptores
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'campaigns'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Campañas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-neutral-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-neutral-600 mt-4">Cargando...</p>
          </div>
        ) : activeTab === 'subscribers' ? (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Suscriptores</h3>
            {subscribers.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No hay suscriptores aún</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 text-sm">{sub.email}</td>
                        <td className="py-3 px-4 text-sm">{sub.name || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {sub.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600">{sub.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campañas de Newsletter</h3>
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Send className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-4">No hay campañas creadas</p>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Crear Primera Campaña
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{campaign.name}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{campaign.subject}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === 'sent'
                              ? 'bg-green-100 text-green-700'
                              : campaign.status === 'draft'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {campaign.status}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {campaign.sent_count || 0} enviados
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-neutral-100 rounded-lg">
                          <Eye className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button className="p-2 hover:bg-neutral-100 rounded-lg">
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadData()
          setActiveTab('campaigns')
        }}
      />
    </div>
  )
}
