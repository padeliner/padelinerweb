'use client'

import { X, Mail, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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

interface EmailDetailModalProps {
  email: Email
  onClose: () => void
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  const getStatusIcon = () => {
    switch (email.status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-600 dark-admin:text-green-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600 dark-admin:text-red-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark-admin:text-yellow-400" />
    }
  }

  const getStatusText = () => {
    switch (email.status) {
      case 'sent':
        return 'Enviado'
      case 'failed':
        return 'Fallido'
      case 'pending':
        return 'Pendiente'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark-admin:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 dark-admin:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">
                Detalles del Email
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon()}
                <span className="text-sm text-neutral-600 dark-admin:text-slate-400">
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-neutral-400 dark-admin:text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-1">
                    Enviado por
                  </p>
                  <p className="font-medium text-neutral-900 dark-admin:text-slate-100">
                    {email.from_user?.full_name || 'Admin'}
                  </p>
                  <p className="text-sm text-neutral-600 dark-admin:text-slate-400">
                    {email.from_user?.email || 'admin@padeliner.com'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-neutral-400 dark-admin:text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-1">
                    Fecha de envío
                  </p>
                  <p className="font-medium text-neutral-900 dark-admin:text-slate-100">
                    {email.sent_at
                      ? format(new Date(email.sent_at), "dd 'de' MMMM, yyyy", { locale: es })
                      : 'No enviado'}
                  </p>
                  <p className="text-sm text-neutral-600 dark-admin:text-slate-400">
                    {email.sent_at
                      ? format(new Date(email.sent_at), 'HH:mm:ss', { locale: es })
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Destinatarios */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Destinatarios ({email.to_addresses.length})
            </h3>
            <div className="p-4 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {email.to_addresses.map((address, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark-admin:bg-blue-900/20 text-blue-800 dark-admin:text-blue-400 rounded-full text-sm"
                  >
                    {address}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Asunto */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Asunto
            </h3>
            <div className="p-4 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
              <p className="text-neutral-900 dark-admin:text-slate-100 font-medium">
                {email.subject}
              </p>
            </div>
          </div>

          {/* Email ID (si existe) */}
          {email.email_id && (
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                ID de Resend
              </h3>
              <div className="p-4 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                <code className="text-sm text-neutral-900 dark-admin:text-slate-100 font-mono">
                  {email.email_id}
                </code>
              </div>
            </div>
          )}

          {/* Contenido HTML */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Vista previa
            </h3>
            <div className="border border-neutral-200 dark-admin:border-slate-700 rounded-lg overflow-hidden">
              <div
                className="p-6 bg-white"
                dangerouslySetInnerHTML={{ __html: email.html_content }}
              />
            </div>
          </div>

          {/* Código HTML */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Código HTML
            </h3>
            <div className="p-4 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg overflow-x-auto">
              <pre className="text-xs text-neutral-900 dark-admin:text-slate-100 font-mono whitespace-pre-wrap">
                {email.html_content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-neutral-200 dark-admin:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 dark-admin:bg-slate-700 hover:bg-neutral-200 dark-admin:hover:bg-slate-600 text-neutral-700 dark-admin:text-slate-300 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
