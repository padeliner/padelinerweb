'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Mail, Send, CheckCircle, XCircle, Clock, Users, Eye, Inbox } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EmailDetailModal } from '../EmailDetailModal'

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

interface SentEmailsTabProps {
  refreshTrigger: number
}

export function SentEmailsTab({ refreshTrigger }: SentEmailsTabProps) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'failed' | 'pending'>('all')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    loadEmails()
  }, [refreshTrigger])

  const loadEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Error loading emails:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enviado
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Fallido
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Emails</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Enviados</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.sent}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Send className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Fallidos</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.failed}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pendientes</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Destinatarios</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{stats.recipients}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por asunto o destinatario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500"
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
            <thead className="bg-neutral-50 border-y">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Destinatarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Enviado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEmails.map((email) => (
                <tr key={email.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-neutral-900">{email.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-600">
                      {email.to_addresses.length === 1 ? (
                        <p>{email.to_addresses[0]}</p>
                      ) : (
                        <p>{email.to_addresses.length} destinatarios</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-neutral-900">{email.from_user?.full_name || 'Admin'}</p>
                      <p className="text-neutral-500 text-xs">
                        {email.from_user?.email || 'admin@padeliner.com'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {email.sent_at
                        ? format(new Date(email.sent_at), 'dd/MM/yyyy HH:mm', { locale: es })
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(email.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewEmail(email)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
            <Inbox className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No se encontraron emails</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
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
