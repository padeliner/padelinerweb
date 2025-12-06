'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * PÁGINA ANTIGUA - REDIRECCIÓN AUTOMÁTICA
 * 
 * Esta página ha sido reemplazada por:
 * - /dashboard/jugador (dashboard privado con 8 tabs)
 * - /jugadores/[id] (perfil público)
 * 
 * Redirección automática al nuevo dashboard
 */
export default function MiPerfilRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redireccionar inmediatamente al nuevo dashboard
    router.push('/dashboard/jugador')
  }, [router])

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">Redirigiendo al nuevo dashboard...</p>
      </div>
    </div>
  )
}
