'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar email
      if (!email || !email.includes('@')) {
        setError('Por favor ingresa un email válido')
        setLoading(false)
        return
      }

      // Aquí puedes integrar con tu servicio de email
      // Por ahora solo simulamos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Integrar con Resend, Mailchimp, etc.
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      setSubscribed(true)
      setEmail('')
      
      // Opcional: Enviar evento de analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'newsletter_subscribe', {
          method: 'blog_footer'
        })
      }
    } catch (error) {
      setError('Error al suscribirse. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center border-2 border-green-200 dark:border-green-800">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
          ¡Gracias por suscribirte!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Recibirás nuestros mejores artículos de pádel en tu email
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-white rounded-2xl border-2 border-neutral-200 dark:border-neutral-300 p-8 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-neutral-800 dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
          <Mail className="w-6 h-6 text-white dark:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-900 mb-2">
          📧 No te pierdas ningún artículo
        </h3>
        <p className="text-neutral-600 dark:text-neutral-600">
          Recibe contenido exclusivo de pádel, técnicas, noticias y consejos directamente en tu email. 
          <strong className="text-neutral-900 dark:text-neutral-900"> ¡Únete a más de 1,000 jugadores!</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 px-4 py-3 rounded-lg border-2 border-neutral-200 dark:border-neutral-300 focus:border-neutral-400 focus:outline-none bg-white dark:bg-white text-neutral-900 dark:text-neutral-900 placeholder:text-neutral-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Suscribiendo...' : 'Suscribirse'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs text-neutral-500 dark:text-slate-400">
        ✅ Sin spam. Cancela cuando quieras. Respetamos tu privacidad.
      </p>
    </div>
  )
}
