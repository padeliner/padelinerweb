'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Briefcase, Upload, CheckCircle, AlertCircle, User, Mail, Phone, FileText, Send } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function TrabajaConNosotrosPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    cvFile: null as File | null,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setIsAuthenticated(true)
      // Pre-fill user data
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || ''
        }))
      }
    }
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo y tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no puede superar los 5MB')
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('word') && !file.type.includes('document')) {
        setError('Solo se aceptan archivos PDF o Word')
        return
      }
      setFormData(prev => ({ ...prev, cvFile: file }))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cvFile) {
      setError('Por favor adjunta tu currículum')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(formData.cvFile)
      
      reader.onload = async () => {
        const base64 = reader.result as string
        
        const response = await fetch('/api/careers/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            message: formData.message,
            cvFile: base64,
            fileName: formData.cvFile?.name
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al enviar la solicitud')
        }

        setSuccess(true)
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          position: '',
          message: '',
          cvFile: null
        })
      }

      reader.onerror = () => {
        throw new Error('Error al leer el archivo')
      }
    } catch (error: any) {
      setError(error.message || 'Error al enviar la solicitud')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Trabaja con Nosotros
              </h1>
            </div>
            <p className="text-xl text-primary-100">
              Únete al equipo que está revolucionando el mundo del pádel en España
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!isAuthenticated ? (
          // Not Authenticated
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <User className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Inicia sesión para aplicar
            </h2>
            <p className="text-neutral-600 mb-8 text-lg">
              Necesitas tener una cuenta en Padeliner para enviar tu solicitud
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        ) : success ? (
          // Success Message
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              ¡Solicitud Enviada!
            </h2>
            <p className="text-neutral-600 mb-8 text-lg">
              Hemos recibido tu solicitud. Revisaremos tu perfil y nos pondremos en contacto contigo pronto.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Enviar Otra Solicitud
            </button>
          </div>
        ) : (
          // Application Form
          <>
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Innovación</h3>
                <p className="text-neutral-600 text-sm">
                  Trabaja en una startup tecnológica en crecimiento
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎾</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Pasión por el Pádel</h3>
                <p className="text-neutral-600 text-sm">
                  Combina tu trabajo con tu deporte favorito
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Crecimiento</h3>
                <p className="text-neutral-600 text-sm">
                  Oportunidades de desarrollo profesional
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Envía tu solicitud
              </h2>
              <p className="text-neutral-600 mb-8">
                Completa el formulario y adjunta tu currículum
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Puesto de Interés *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Ej: Desarrollador, Marketing..."
                        className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Mensaje / Carta de Presentación *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      placeholder="Cuéntanos por qué quieres trabajar con nosotros..."
                      className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Currículum (PDF o Word) *
                  </label>
                  <div className="relative border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    {formData.cvFile ? (
                      <p className="text-primary-600 font-semibold">
                        {formData.cvFile.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-neutral-600 mb-2">
                          Arrastra tu CV aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-neutral-400">
                          Máximo 5MB - PDF o Word
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
