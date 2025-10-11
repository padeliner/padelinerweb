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
        // Obtener el usuario actual
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Verificar si hay un rol pendiente (de OAuth flow)
        const pendingRole = localStorage.getItem('pending_role')
        
        console.log('👤 Usuario:', user.email)
        console.log('🎭 Rol pendiente:', pendingRole)

        if (pendingRole) {
          // Actualizar el metadata con el rol correcto
          await supabase.auth.updateUser({
            data: {
              role: pendingRole,
              full_name: user.user_metadata.full_name || user.email?.split('@')[0]
            }
          })

          // IMPORTANTE: Crear o actualizar el perfil en la tabla users
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          console.log('📊 Usuario existente:', existingUser)
          console.log('❌ Error fetch:', fetchError)

          if (existingUser) {
            // Usuario ya existe, actualizar el rol
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                role: pendingRole,
                full_name: user.user_metadata.full_name || user.email?.split('@')[0],
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id)
            
            console.log('✅ Perfil actualizado:', pendingRole, updateError)
          } else {
            // Usuario no existe, crearlo
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email!,
                role: pendingRole,
                full_name: user.user_metadata.full_name || user.email?.split('@')[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            
            console.log('✅ Perfil creado:', pendingRole, insertError)
          }
          
          // Limpiar el rol pendiente
          localStorage.removeItem('pending_role')
        }
        
        // Pequeño delay para que se apliquen los cambios
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirigir al dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('❌ Error completando perfil:', error)
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
        <p className="text-sm text-neutral-500 mt-2">Esto puede tardar unos segundos</p>
      </div>
    </div>
  )
}
