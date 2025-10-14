'use client'

import { useState, useEffect } from 'react'
import { Inbox, Mail, Reply, Trash2, Archive, Star } from 'lucide-react'

// NOTA: Resend no proporciona función de recibir emails
// Para recibir emails necesitarías:
// 1. Configurar MX records en tu dominio
// 2. Usar un servicio como SendGrid Inbound Parse, Mailgun Routes, o AWS SES
// 3. Crear un webhook que reciba los emails y los guarde en tu DB

interface IncomingEmail {
  id: string
  from: string
  subject: string
  body: string
  received_at: string
  is_read: boolean
  is_starred: boolean
}

const mockInbox: IncomingEmail[] = [
  {
    id: '1',
    from: 'usuario@example.com',
    subject: '¿Cómo puedo cambiar mi email?',
    body: 'Hola, necesito ayuda para cambiar mi dirección de email en mi perfil. No encuentro la opción.',
    received_at: '2024-01-15T14:30:00Z',
    is_read: false,
    is_starred: false,
  },
  {
    id: '2',
    from: 'entrenador@example.com',
    subject: 'Problema con el pago',
    body: 'Buenos días, no he recibido el pago de este mes. ¿Podrían revisar mi cuenta?',
    received_at: '2024-01-14T09:15:00Z',
    is_read: true,
    is_starred: true,
  },
]

export function EmailInboxTab() {
  const [emails, setEmails] = useState<IncomingEmail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInbox()
  }, [])

  const loadInbox = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/incoming-emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Error cargando inbox:', error)
      // Si falla, usar mock
      setEmails(mockInbox)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Emails Recibidos
          </h2>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
            {emails.filter(e => !e.is_read).length} emails sin leer
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 dark-admin:bg-blue-900/20 border border-blue-200 dark-admin:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-blue-600 dark-admin:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 dark-admin:text-blue-300 mb-1">
              Configuración de Inbox
            </h3>
            <p className="text-sm text-blue-700 dark-admin:text-blue-400">
              Para recibir emails necesitas configurar:
            </p>
            <ul className="text-sm text-blue-700 dark-admin:text-blue-400 mt-2 ml-4 list-disc space-y-1">
              <li>MX records en tu dominio (padeliner.com)</li>
              <li>Webhook para procesar emails entrantes (SendGrid, Mailgun, etc.)</li>
              <li>Tabla en DB para almacenar emails recibidos</li>
            </ul>
            <p className="text-sm text-blue-600 dark-admin:text-blue-300 mt-2">
              Por ahora, se muestran emails de ejemplo.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de emails */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700">
        {emails.map((email, index) => (
          <div
            key={email.id}
            className={`p-6 border-b border-neutral-200 dark-admin:border-slate-700 last:border-b-0 hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors ${
              !email.is_read ? 'bg-blue-50/50 dark-admin:bg-blue-900/10' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {email.is_starred && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                  <p className={`font-medium ${!email.is_read ? 'text-neutral-900 dark-admin:text-slate-100 font-semibold' : 'text-neutral-700 dark-admin:text-slate-300'}`}>
                    {email.from}
                  </p>
                  {!email.is_read && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>
                <h3 className={`text-lg mb-2 ${!email.is_read ? 'font-semibold text-neutral-900 dark-admin:text-slate-100' : 'text-neutral-800 dark-admin:text-slate-200'}`}>
                  {email.subject}
                </h3>
                <p className="text-sm text-neutral-600 dark-admin:text-slate-400 line-clamp-2">
                  {email.body}
                </p>
                <p className="text-xs text-neutral-500 dark-admin:text-slate-500 mt-2">
                  {new Date(email.received_at).toLocaleString('es-ES')}
                </p>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  className="p-2 text-blue-600 dark-admin:text-blue-400 hover:bg-blue-50 dark-admin:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Responder"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-neutral-600 dark-admin:text-slate-400 hover:bg-neutral-100 dark-admin:hover:bg-slate-600 rounded-lg transition-colors"
                  title="Archivar"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-red-600 dark-admin:text-red-400 hover:bg-red-50 dark-admin:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {emails.length === 0 && (
        <div className="text-center py-12 bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700">
          <Inbox className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
          <p className="text-neutral-600 dark-admin:text-slate-400">
            No hay emails recibidos
          </p>
        </div>
      )}
    </div>
  )
}
