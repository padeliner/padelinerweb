'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const accessToken = searchParams.get('access_token')
        const type = searchParams.get('type')

        if (accessToken && type === 'signup') {
          // Email verificado correctamente
          setLoading(false)
          
          // Auto redirect después de 3 segundos
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else if (!accessToken) {
          setError('Link de verificación inválido')
          setLoading(false)
        }
      } catch (err) {
        setError('Error al verificar el email')
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-neutral-600">Verificando tu email...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Error de Verificación
            </h1>
            <p className="text-neutral-600 mb-6">
              {error}
            </p>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            ¡Email Verificado!
          </h1>
          <p className="text-neutral-600 mb-6">
            Tu cuenta ha sido activada exitosamente. Serás redirigido al login en un momento.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
          >
            Ir al Login
          </Link>
        </div>
      </div>
    </div>
  )
}
