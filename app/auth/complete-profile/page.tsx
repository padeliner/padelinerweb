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
        
        console.log('========================================')
        console.log('👤 Usuario:', user.email)
        console.log('🔑 User ID:', user.id)
        console.log('🎭 Rol pendiente (localStorage):', pendingRole)
        console.log('📋 Metadata actual:', user.user_metadata)
        console.log('========================================')

        if (pendingRole) {
          console.log('⏳ Aplicando rol pendiente:', pendingRole)
          
          // PASO 1: Actualizar el metadata del usuario
          const { error: updateMetadataError } = await supabase.auth.updateUser({
            data: {
              role: pendingRole,
              full_name: user.user_metadata.full_name || user.email?.split('@')[0]
            }
          })
          
          if (updateMetadataError) {
            console.error('❌ Error actualizando metadata:', updateMetadataError)
          } else {
            console.log('✅ Metadata actualizado con rol:', pendingRole)
          }

          // PASO 2: Esperar un momento para que se procese
          await new Promise(resolve => setTimeout(resolve, 500))

          // PASO 3: Verificar el perfil en la tabla users
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          console.log('📊 Usuario existente en DB:', existingUser)
          
          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('❌ Error consultando usuario:', fetchError)
          }

          if (existingUser) {
            // Usuario YA existe - ACTUALIZAR el rol (el trigger lo creó con rol incorrecto)
            console.log('🔄 Usuario existe con rol:', existingUser.role, '→ Actualizando a:', pendingRole)
            
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                role: pendingRole,
                full_name: user.user_metadata.full_name || user.email?.split('@')[0],
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id)
            
            if (updateError) {
              console.error('❌ Error actualizando perfil:', updateError)
            } else {
              console.log('✅✅✅ Perfil actualizado correctamente a rol:', pendingRole)
            }
          } else {
            // Usuario NO existe - CREAR con el rol correcto
            console.log('➕ Usuario no existe, creando con rol:', pendingRole)
            
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
              console.error('❌ Error creando perfil:', insertError)
            } else {
              console.log('✅✅✅ Perfil creado correctamente con rol:', pendingRole)
            }
          }
          
          // PASO 4: Verificar que el rol se guardó correctamente
          const { data: finalUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()
          
          console.log('🎯 Rol final en DB:', finalUser?.role)
          console.log('========================================')
          
          // Limpiar el rol pendiente
          localStorage.removeItem('pending_role')
        } else {
          console.log('⚠️ No hay rol pendiente en localStorage')
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
