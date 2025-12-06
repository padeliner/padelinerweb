'use client'

import { useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, UserPlus, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { USER_ROLES } from '@/lib/constants'

function RegisterProfessionalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') || 'entrenador'
  
  // Mapear el rol del URL al valor correcto en español
  const getRoleValue = (role: string) => {
    switch(role) {
      case 'coach': return USER_ROLES.COACH
      case 'club': return USER_ROLES.CLUB
      case 'academy': return USER_ROLES.ACADEMY
      default: return USER_ROLES.COACH
    }
  }
  
  const selectedRole = getRoleValue(roleParam)
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const roleTitle = useMemo(() => {
    switch (selectedRole) {
      case USER_ROLES.COACH:
        return 'Entrenador'
      case USER_ROLES.CLUB:
        return 'Club'
      case USER_ROLES.ACADEMY:
        return 'Academia'
      default:
        return 'Profesional'
    }
  }, [selectedRole])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validations
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    if (fullName.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName.trim(),
            role: selectedRole,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Este email ya está registrado')
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user) {
        // El trigger de Supabase creará el perfil automáticamente con el rol correcto
        setSuccess(true)
      }
    } catch (err) {
      setError('Hubo un problema al crear tu cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      // Guardar el rol en localStorage Y en el callback URL
      localStorage.setItem('pending_role', selectedRole)
      
      // Obtener el origin correcto
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
      // IMPORTANTE: Pasar el rol como query parameter
      const callbackUrl = `${currentOrigin}/auth/callback?role=${selectedRole}`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (err) {
      setError('Error al registrarse con Google')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 mb-3">
              ¡Cuenta Creada con Éxito!
            </h1>
            
            {/* Subtitle */}
            <p className="text-center text-neutral-600 mb-8">
              Ya casi está todo listo. Solo falta un paso más.
            </p>

            {/* Email Info */}
            <div className="bg-primary-50 border-2 border-primary-100 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Revisa tu correo electrónico
                  </h3>
                  <p className="text-sm text-neutral-700 mb-3">
                    Te hemos enviado un email de verificación a:
                  </p>
                  <p className="text-sm font-bold text-primary-600 bg-white px-3 py-2 rounded-lg border border-primary-200 break-all">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border-2 border-yellow-100 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Importante: Revisa tu bandeja de spam
                  </h3>
                  <p className="text-sm text-neutral-700">
                    Si no ves el correo en tu bandeja de entrada, por favor revisa la carpeta de <strong>spam</strong> o <strong>correo no deseado</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-8">
              <h3 className="font-semibold text-neutral-900 mb-3">Pasos a seguir:</h3>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-sm text-neutral-700">Abre el correo de verificación</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm text-neutral-700">Haz clic en el enlace de confirmación</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-primary-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm text-neutral-700">Inicia sesión y comienza a ofrecer tus servicios</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 text-center shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
              >
                Ir a Iniciar Sesión
              </Link>
              <Link
                href="/"
                className="block w-full py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors text-center"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/role-selection"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Atrás</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Registro {roleTitle}
            </h1>
            <p className="text-neutral-600">
              Crea tu cuenta profesional para ofrecer tus servicios
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 rounded-xl font-semibold text-neutral-700 transition-all duration-200 mb-6 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-neutral-200"></div>
            <span className="px-4 text-sm text-neutral-500">O regístrate con</span>
            <div className="flex-1 border-t border-neutral-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre o nombre del club"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors disabled:bg-neutral-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors disabled:bg-neutral-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors disabled:bg-neutral-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors disabled:bg-neutral-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-neutral-600">¿Ya tienes cuenta? </span>
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterProfessionalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-neutral-600">Cargando...</p>
        </div>
      </div>
    }>
      <RegisterProfessionalContent />
    </Suspense>
  )
}
