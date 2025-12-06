'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Mail,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Filter,
  Plus,
  Eye,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ComposeEmailModal } from './ComposeEmailModal'
import { EmailDetailModal } from './EmailDetailModal'
import { EmailTemplatesTab } from './EmailTemplatesTab'
import { EmailInboxTab } from './EmailInboxTab'

interface Email {
  id: string
  email_id: string | null
  from_user_id: string
  to_addresses: string[]
  subject: string
  html_content: string
  status: 'sent' | 'failed' | 'pending'
  sent_at: string | null
  created_at: string
  from_user?: {
    id: string
    email: string
    full_name: string
  }
}

// Mock data para desarrollo
const mockEmails: Email[] = [
  {
    id: '1',
    email_id: 're_abc123',
    from_user_id: 'admin1',
    to_addresses: ['usuario1@example.com', 'usuario2@example.com'],
    subject: 'Bienvenidos a Padeliner - Nuevos usuarios',
    html_content: '<p>Hola, bienvenidos a nuestra plataforma...</p>',
    status: 'sent',
    sent_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z',
    from_user: {
      id: 'admin1',
      email: 'admin@padeliner.com',
      full_name: 'Admin Padeliner',
    },
  },
  {
    id: '2',
    email_id: 're_def456',
    from_user_id: 'admin1',
    to_addresses: ['entrenador@example.com'],
    subject: 'Verificación de perfil completada',
    html_content: '<p>Tu perfil ha sido verificado correctamente...</p>',
    status: 'sent',
    sent_at: '2024-01-14T15:20:00Z',
    created_at: '2024-01-14T15:20:00Z',
    from_user: {
      id: 'admin1',
      email: 'admin@padeliner.com',
      full_name: 'Admin Padeliner',
    },
  },
  {
    id: '3',
    email_id: null,
    from_user_id: 'admin1',
    to_addresses: ['usuario3@example.com'],
    subject: 'Error en el pago - Requiere atención',
    html_content: '<p>Hemos detectado un problema con tu pago...</p>',
    status: 'failed',
    sent_at: null,
    created_at: '2024-01-13T09:15:00Z',
    from_user: {
      id: 'admin1',
      email: 'admin@padeliner.com',
      full_name: 'Admin Padeliner',
    },
  },
]

export function MessagingClient() {
  const [activeTab, setActiveTab] = useState<'sent' | 'templates' | 'inbox'>('sent')
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'failed' | 'pending'>('all')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Cargar emails al montar el componente
  useEffect(() => {
    if (activeTab === 'sent') {
      loadEmails()
    }
  }, [activeTab])

  const stats = useMemo(() => {
    return {
      total: emails.length,
      sent: emails.filter((e) => e.status === 'sent').length,
      failed: emails.filter((e) => e.status === 'failed').length,
      pending: emails.filter((e) => e.status === 'pending').length,
      recipients: emails.reduce((sum, e) => sum + e.to_addresses.length, 0),
    }
  }, [emails])

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch =
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.to_addresses.some((addr) => addr.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === 'all' || email.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [emails, searchTerm, filterStatus])

  const loadEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
      }
    } catch (error) {
      // Error cargando emails
    } finally {
      setLoading(false)
    }
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
      
      // Recargar emails
      await loadEmails()
      
      setShowComposeModal(false)
      
      alert('✅ Email enviado correctamente')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el email'
      alert(`❌ ${errorMessage}`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark-admin:bg-green-900/20 text-green-800 dark-admin:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enviado
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark-admin:bg-red-900/20 text-red-800 dark-admin:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Fallido
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark-admin:bg-yellow-900/20 text-yellow-800 dark-admin:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        )
      default:
        return null
    }
  }

  const handleViewEmail = (email: Email) => {
    setSelectedEmail(email)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Mensajería
          </h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
            Envía y gestiona emails a los usuarios de la plataforma
          </p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Email</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark-admin:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'sent'
                ? 'border-green-600 text-green-600 dark-admin:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark-admin:text-slate-400 dark-admin:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Emails Enviados</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'templates'
                ? 'border-green-600 text-green-600 dark-admin:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark-admin:text-slate-400 dark-admin:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Plantillas</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'inbox'
                ? 'border-green-600 text-green-600 dark-admin:text-green-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark-admin:text-slate-400 dark-admin:hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4" />
              <span>Emails Recibidos</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Contenido según tab activa */}
      {activeTab === 'sent' && (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Emails</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 dark-admin:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Enviados</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.sent}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
              <Send className="w-6 h-6 text-green-600 dark-admin:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Fallidos</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.failed}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark-admin:bg-red-900/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark-admin:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark-admin:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Destinatarios</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.recipients}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark-admin:bg-purple-900/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark-admin:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark-admin:text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por asunto o destinatario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos los estados</option>
              <option value="sent">Enviados</option>
              <option value="failed">Fallidos</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>

        {/* Lista de emails */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-y border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Destinatarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Enviado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredEmails.map((email) => (
                <tr
                  key={email.id}
                  className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                      {email.subject}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-600 dark-admin:text-slate-400">
                      {email.to_addresses.length === 1 ? (
                        <p>{email.to_addresses[0]}</p>
                      ) : (
                        <p>{email.to_addresses.length} destinatarios</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-neutral-900 dark-admin:text-slate-100">
                        {email.from_user?.full_name || 'Admin'}
                      </p>
                      <p className="text-neutral-500 dark-admin:text-slate-400 text-xs">
                        {email.from_user?.email || 'admin@padeliner.com'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">
                      {email.sent_at
                        ? format(new Date(email.sent_at), 'dd/MM/yyyy HH:mm', { locale: es })
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(email.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewEmail(email)}
                      className="p-2 text-blue-600 dark-admin:text-blue-400 hover:bg-blue-50 dark-admin:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <Inbox className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
            <p className="text-neutral-600 dark-admin:text-slate-400">
              No se encontraron emails
            </p>
          </div>
        )}
      </div>
        </>
      )}

      {/* Tab de Plantillas */}
      {activeTab === 'templates' && <EmailTemplatesTab />}

      {/* Tab de Inbox */}
      {activeTab === 'inbox' && <EmailInboxTab />}

      {/* Modales */}
      {showComposeModal && (
        <ComposeEmailModal
          onSend={handleSendEmail}
          onClose={() => setShowComposeModal(false)}
        />
      )}

      {showDetailModal && selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedEmail(null)
          }}
        />
      )}
    </div>
  )
}
