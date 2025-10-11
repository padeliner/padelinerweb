import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const role = requestUrl.searchParams.get('role') // Leer el rol del query param

  console.log('========================================')
  console.log('🔄 Callback ejecutándose...')
  console.log('🔑 Code:', code ? 'presente' : 'ausente')
  console.log('🎭 Rol recibido:', role)
  console.log('🌐 Origin:', requestUrl.origin)
  console.log('========================================')

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // PASO 1: Intercambiar código por sesión
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error en exchange:', error)
        return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
      }
      
      console.log('✅ Sesión intercambiada exitosamente')
      console.log('👤 Usuario:', data?.user?.email)
      console.log('🆔 User ID:', data?.user?.id)
      
      // PASO 2: Si hay un rol, actualizar metadata y crear perfil
      if (role && data.user) {
        console.log('⏳ Aplicando rol:', role)
        
        // Actualizar metadata del usuario
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            role: role,
            full_name: data.user.user_metadata.full_name || data.user.email?.split('@')[0]
          }
        })
        
        if (updateError) {
          console.error('❌ Error actualizando metadata:', updateError)
        } else {
          console.log('✅ Metadata actualizado con rol:', role)
        }
        
        // Crear o actualizar perfil en public.users
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle()
        
        if (existingUser) {
          // Actualizar
          console.log('🔄 Actualizando perfil existente con rol:', role)
          await supabase
            .from('users')
            .update({ 
              role: role,
              full_name: data.user.user_metadata.full_name || data.user.email?.split('@')[0],
              updated_at: new Date().toISOString()
            })
            .eq('id', data.user.id)
        } else {
          // Crear
          console.log('➕ Creando perfil nuevo con rol:', role)
          await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              role: role,
              full_name: data.user.user_metadata.full_name || data.user.email?.split('@')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
        }
        
        console.log('✅✅✅ Perfil procesado con rol:', role)
      }
      
    } catch (err) {
      console.error('❌ Error en callback:', err)
      return NextResponse.redirect(new URL('/login?error=callback_error', requestUrl.origin))
    }
  }

  // Redirigir al dashboard
  console.log('➡️  Redirigiendo a: /dashboard')
  console.log('========================================')
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
