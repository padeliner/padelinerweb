'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { USER_ROLES } from '@/lib/constants'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Obtener el rol del usuario desde la tabla users
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error || !userData) {
          router.push('/login')
          return
        }

        const userRole = userData.role

        // Redirigir al dashboard específico según el rol
        switch (userRole) {
          case USER_ROLES.ADMIN:
            router.push('/dashboard/admin')
            break
          case USER_ROLES.STUDENT:
            router.push('/dashboard/alumno')
            break
          case USER_ROLES.COACH:
            router.push('/dashboard/entrenador')
            break
          case USER_ROLES.CLUB:
            router.push('/dashboard/club')
            break
          case USER_ROLES.ACADEMY:
            router.push('/dashboard/academia')
            break
          default:
            // Si no tiene rol válido, ir al dashboard de alumno por defecto
            router.push('/dashboard/alumno')
        }
      } catch (error) {
        router.push('/login')
      }
    }

    redirectToDashboard()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
        <p className="text-lg text-neutral-600">Redirigiendo a tu dashboard...</p>
      </div>
    </div>
  )
}
