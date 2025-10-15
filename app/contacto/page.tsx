'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    console.log('📧 Enviando formulario...', formData)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      console.log('📬 Response status:', response.status)

      const data = await response.json()
      console.log('📬 Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (error: any) {
      console.error('❌ Error:', error)
      setError(error.message || 'Error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Contacta con Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Información de Contacto
                </h2>
                <p className="text-neutral-600 mb-8">
                  Puedes contactarnos a través de cualquiera de estos medios. Nuestro equipo está disponible de lunes a viernes.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                      <a href="mailto:contact@padeliner.com" className="text-primary-600 hover:text-primary-700">
                        contact@padeliner.com
                      </a>
                      <p className="text-sm text-neutral-500 mt-1">Respuesta en 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Teléfono</h3>
                      <a href="tel:+34900123456" className="text-primary-600 hover:text-primary-700">
                        +34 900 123 456
                      </a>
                      <p className="text-sm text-neutral-500 mt-1">Lun - Vie, 9:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Oficina</h3>
                      <p className="text-neutral-600">
                        Calle Serrano 123, 4º B<br />
                        28006 Madrid, España
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary-50 rounded-2xl">
                  <h3 className="font-bold text-neutral-900 mb-2">Horario de Atención</h3>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p><span className="font-semibold">Lunes - Viernes:</span> 9:00 - 18:00</p>
                    <p><span className="font-semibold">Sábados:</span> 10:00 - 14:00</p>
                    <p><span className="font-semibold">Domingos:</span> Cerrado</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Envíanos un Mensaje
                </h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      ¡Mensaje Enviado!
                    </h3>
                    <p className="text-neutral-600">
                      Gracias por contactarnos. Te responderemos pronto.
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="Tu nombre"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900 mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="+34 600 000 000"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-semibold text-neutral-900 mb-2">
                            Asunto *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                          >
                            <option value="">Selecciona un asunto</option>
                            <option value="general">Consulta general</option>
                            <option value="entrenador">Información sobre entrenadores</option>
                            <option value="club">Información sobre clubes</option>
                            <option value="academia">Información sobre academias</option>
                            <option value="tienda">Consulta sobre tienda</option>
                            <option value="soporte">Soporte técnico</option>
                            <option value="colaboracion">Propuesta de colaboración</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-neutral-900 mb-2">
                          Mensaje *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                          placeholder="Escribe tu mensaje aquí..."
                        />
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="privacy"
                          required
                          className="mt-1"
                        />
                        <label htmlFor="privacy" className="text-sm text-neutral-600">
                          Acepto la{' '}
                          <a href="/politica-privacidad" className="text-primary-600 hover:text-primary-700 font-semibold">
                            política de privacidad
                          </a>{' '}
                          y el tratamiento de mis datos personales.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Enviar Mensaje</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-neutral-600">
              Antes de contactarnos, quizás encuentres tu respuesta aquí
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: '¿Cómo puedo registrarme como entrenador?',
                answer: 'Puedes registrarte enviándonos un email a contact@padeliner.com con tu información profesional y certificaciones.'
              },
              {
                question: '¿Cuánto cuesta usar Padeliner?',
                answer: 'El registro y búsqueda son completamente gratuitos. Solo pagas cuando reservas una clase o pista.'
              },
              {
                question: '¿Cómo funciona el proceso de reserva?',
                answer: 'Busca el entrenador o club, selecciona fecha y hora, y completa el pago de forma segura. Recibirás confirmación inmediata.'
              },
              {
                question: '¿Puedo cancelar una reserva?',
                answer: 'Sí, puedes cancelar hasta 24 horas antes de la clase sin coste adicional.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-50 p-6 rounded-xl"
              >
                <h3 className="font-bold text-neutral-900 mb-2">{faq.question}</h3>
                <p className="text-neutral-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
