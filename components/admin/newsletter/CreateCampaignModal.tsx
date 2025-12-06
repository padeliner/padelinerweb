'use client'

import { useState } from 'react'
import { X, Send, Eye } from 'lucide-react'

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preview_text: '',
    content_html: '',
    target_all: true,
    target_tags: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/newsletter/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear campaña')
        return
      }

      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError('Error al crear campaña')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNow = async () => {
    if (!confirm('¿Estás seguro de enviar esta campaña ahora a todos los suscriptores activos?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/newsletter/campaigns/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          send_immediately: true
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al enviar campaña')
        return
      }

      alert(`✅ Campaña enviada a ${data.sent_count} suscriptores`)
      onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError('Error al enviar campaña')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      preview_text: '',
      content_html: '',
      target_all: true,
      target_tags: []
    })
    setError('')
  }

  const getDefaultTemplate = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.subject || 'Newsletter'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Padeliner</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 14px;">Tu plataforma de pádel</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">¡Hola!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Escribe aquí el contenido de tu newsletter...
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                ¡Nos vemos en la pista! 🎾
              </p>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #059669; border-radius: 6px; text-align: center;">
                    <a href="https://padeliner.com" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Ver más en Padeliner
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                © ${new Date().getFullYear()} Padeliner. Todos los derechos reservados.
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                <a href="{{unsubscribe_url}}" style="color: #9ca3af; text-decoration: underline;">Darse de baja</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-neutral-900">Crear Nueva Campaña</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Nombre de la Campaña (interno)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Ej: Newsletter Enero 2025"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Asunto del Email *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Ej: 🎾 Novedades de Padeliner - Enero 2025"
              required
            />
          </div>

          {/* Preview Text */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Texto de Preview (opcional)
            </label>
            <input
              type="text"
              value={formData.preview_text}
              onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Texto que aparece en la bandeja de entrada"
            />
          </div>

          {/* HTML Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-neutral-700">
                Contenido HTML *
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, content_html: getDefaultTemplate() })}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Usar plantilla
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-neutral-900"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'Ocultar' : 'Preview'}</span>
                </button>
              </div>
            </div>
            <textarea
              value={formData.content_html}
              onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono text-sm"
              rows={12}
              placeholder="<html>...</html>"
              required
            />
          </div>

          {/* Preview */}
          {showPreview && formData.content_html && (
            <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Preview:</h4>
              <div className="bg-white border rounded-lg overflow-auto max-h-96">
                <iframe
                  srcDoc={formData.content_html}
                  className="w-full h-96"
                  title="Email Preview"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50"
            >
              Guardar como Borrador
            </button>
            <button
              type="button"
              onClick={handleSendNow}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Ahora</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
