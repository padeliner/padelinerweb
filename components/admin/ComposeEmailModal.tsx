'use client'

import { useState } from 'react'
import { X, Mail, Users, FileText, Code } from 'lucide-react'

interface ComposeEmailModalProps {
  onSend: (data: { from: string; to: string[]; subject: string; html: string; replyTo?: string }) => void
  onClose: () => void
}

// Direcciones de correo disponibles
const EMAIL_ADDRESSES = [
  { value: 'noreply@padeliner.com', label: 'No Reply', description: 'Para notificaciones automáticas' },
  { value: 'soporte@padeliner.com', label: 'Soporte', description: 'Para consultas de soporte' },
  { value: 'info@padeliner.com', label: 'Info', description: 'Para información general' },
  { value: 'ventas@padeliner.com', label: 'Ventas', description: 'Para temas comerciales' },
  { value: 'marketing@padeliner.com', label: 'Marketing', description: 'Para campañas de marketing' },
]

export function ComposeEmailModal({ onSend, onClose }: ComposeEmailModalProps) {
  const [formData, setFormData] = useState({
    from: 'noreply@padeliner.com',
    to: '',
    subject: '',
    message: '',
    replyTo: 'soporte@padeliner.com',
  })
  const [useHtml, setUseHtml] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Procesar destinatarios (separados por comas o saltos de línea)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const recipients = formData.to
        .split(/[,\n]/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      if (recipients.length === 0) {
        alert('❌ Debes especificar al menos un destinatario')
        setLoading(false)
        return
      }

      // Validar que todos sean emails válidos
      const invalidEmails = recipients.filter(email => !emailRegex.test(email))
      if (invalidEmails.length > 0) {
        alert(`❌ Los siguientes emails no son válidos:\n${invalidEmails.join('\n')}\n\nEjemplo correcto: usuario@example.com`)
        setLoading(false)
        return
      }

      // Convertir mensaje a HTML si no está en modo HTML
      const htmlContent = useHtml
        ? formData.message
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Padeliner</h1>
            </div>
            <div style="padding: 30px; background: white;">
              ${formData.message.split('\n').map(p => `<p style="color: #374151; line-height: 1.6;">${p}</p>`).join('')}
            </div>
            <div style="padding: 20px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Padeliner. Todos los derechos reservados.
              </p>
            </div>
          </div>
        `

      await onSend({
        from: formData.from,
        to: recipients,
        subject: formData.subject,
        html: htmlContent,
        replyTo: formData.replyTo,
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark-admin:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
              <Mail className="w-5 h-5 text-green-600 dark-admin:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
              Nuevo Email
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Remitente */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Enviar desde *
              </label>
              <select
                value={formData.from}
                onChange={(e) => handleChange('from', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                {EMAIL_ADDRESSES.map((addr) => (
                  <option key={addr.value} value={addr.value}>
                    {addr.label} ({addr.value}) - {addr.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Destinatarios */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Destinatarios *
              </label>
              <textarea
                value={formData.to}
                onChange={(e) => handleChange('to', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                rows={3}
                placeholder="email1@example.com, email2@example.com&#10;o uno por línea"
                required
              />
              <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                Separa múltiples destinatarios con comas o saltos de línea
              </p>
            </div>

            {/* Reply To */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Responder a
              </label>
              <input
                type="email"
                value={formData.replyTo}
                onChange={(e) => handleChange('replyTo', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="soporte@padeliner.com"
              />
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Asunto *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Asunto del email"
                required
              />
            </div>

            {/* Modo HTML toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="use-html"
                checked={useHtml}
                onChange={(e) => setUseHtml(e.target.checked)}
                className="w-4 h-4 text-green-600 border-neutral-300 rounded focus:ring-green-500"
              />
              <label htmlFor="use-html" className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Usar HTML personalizado</span>
              </label>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                {useHtml ? 'Contenido HTML *' : 'Mensaje *'}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                rows={12}
                placeholder={
                  useHtml
                    ? '<div style="padding: 20px;">\n  <h1>Título</h1>\n  <p>Contenido...</p>\n</div>'
                    : 'Escribe tu mensaje aquí...'
                }
                required
              />
              {!useHtml && (
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                  Se aplicará un diseño automático con el estilo de Padeliner
                </p>
              )}
            </div>

            {/* Plantillas rápidas */}
            {!useHtml && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Plantillas rápidas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        'message',
                        'Hola,\n\nGracias por registrarte en Padeliner. Estamos encantados de tenerte en nuestra comunidad.\n\nSi tienes alguna duda, no dudes en contactarnos.\n\nSaludos,\nEquipo Padeliner'
                      )
                    }
                    className="px-3 py-2 text-sm border border-neutral-200 dark-admin:border-slate-700 hover:bg-neutral-50 dark-admin:hover:bg-slate-700 rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Bienvenida
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        'message',
                        'Hola,\n\nTu perfil ha sido verificado correctamente y ya está visible en nuestra plataforma.\n\n¡Buena suerte con tus clases!\n\nSaludos,\nEquipo Padeliner'
                      )
                    }
                    className="px-3 py-2 text-sm border border-neutral-200 dark-admin:border-slate-700 hover:bg-neutral-50 dark-admin:hover:bg-slate-700 rounded-lg transition-colors text-left"
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    Verificación
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-200 dark-admin:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            <span>{loading ? 'Enviando...' : 'Enviar Email'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
