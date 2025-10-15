'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle } from 'lucide-react'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setEmail('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(data.error || 'Error al suscribirse')
      }
    } catch (err) {
      setError('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-primary-600 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-3">
        <Mail className="w-6 h-6 text-white" />
        <h3 className="text-lg font-bold text-white">Newsletter</h3>
      </div>
      <p className="text-primary-100 text-sm mb-4">
        Recibe las últimas novedades de pádel y ofertas exclusivas
      </p>

      {success ? (
        <div className="bg-green-500 text-white p-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">¡Suscripción exitosa!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-4 py-2 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          {error && (
            <p className="text-red-300 text-xs">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-primary-600 font-semibold py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Enviando...' : 'Suscribirse'}</span>
          </button>
        </form>
      )}
    </div>
  )
}
