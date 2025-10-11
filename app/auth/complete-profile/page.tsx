'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CompleteProfilePage() {
  const router = useRouter()
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const completeProfile = async () => {
      try {
        // Verificar si hay un rol pendiente (de OAuth flow)
        const pendingRole = localStorage.getItem('pending_role')
        
        if (pendingRole) {
          // Obtener el usuario actual
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Actualizar el metadata con el rol correcto
            await supabase.auth.updateUser({
              data: {
                role: pendingRole,
                full_name: user.user_metadata.full_name || user.email?.split('@')[0]
              }
            })

            // También actualizar directamente en la tabla users si ya existe
            await supabase
              .from('users')
              .update({ role: pendingRole })
              .eq('id', user.id)
            
            console.log('✅ Rol actualizado:', pendingRole)
          }
          
          // Limpiar el rol pendiente
          localStorage.removeItem('pending_role')
        }
        
        // Redirigir al dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Error completando perfil:', error)
        // Redirigir de todos modos
        router.push('/dashboard')
      } finally {
        setProcessing(false)
      }
    }

    completeProfile()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
        <p className="text-lg text-neutral-600">Completando tu perfil...</p>
      </div>
    </div>
  )
}
