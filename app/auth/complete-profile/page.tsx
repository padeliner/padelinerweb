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

        if (pendingRole) {
          // PASO 1: Actualizar el metadata del usuario
          const { error: updateMetadataError } = await supabase.auth.updateUser({
            data: {
              role: pendingRole,
              full_name: user.user_metadata.full_name || user.email?.split('@')[0]
            }
          })
          
          if (updateMetadataError) {
            // Error actualizando metadata
          }

          // PASO 2: Esperar un momento para que se procese
          await new Promise(resolve => setTimeout(resolve, 500))

          // PASO 3: Verificar el perfil en la tabla users
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
          
          if (fetchError && fetchError.code !== 'PGRST116') {
            // Error consultando usuario
          }

          if (existingUser) {
            // Usuario YA existe - ACTUALIZAR el rol (el trigger lo creó con rol incorrecto)
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                role: pendingRole,
                full_name: user.user_metadata.full_name || user.email?.split('@')[0],
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id)
            
            if (updateError) {
              // Error actualizando perfil
            }
          } else {
            // Usuario NO existe - CREAR con el rol correcto
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
            
            if (insertError) {
              // Error creando perfil
            }
          }
          
          // Limpiar el rol pendiente
          localStorage.removeItem('pending_role')
        }
        
        // Pequeño delay para que se apliquen los cambios
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirigir al home
        router.push('/')
      } catch (error) {
        // Error completando perfil - redirigir de todos modos
        router.push('/')
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
