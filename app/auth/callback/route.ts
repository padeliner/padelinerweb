import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const role = requestUrl.searchParams.get('role')

  // Si no hay code pero hay rol, redirigir a complete-profile
  if (!code && role) {
    return NextResponse.redirect(new URL('/auth/complete-profile', requestUrl.origin))
  }

  if (code) {
    try {
      const supabase = await createClient()
      
      // PASO 1: Intercambiar código por sesión
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
      }
      
      // PASO 2: Si hay un rol, actualizar metadata y crear perfil
      if (role && data.user) {
        
        // Actualizar metadata del usuario
        await supabase.auth.updateUser({
          data: {
            role: role,
            full_name: data.user.user_metadata.full_name || data.user.email?.split('@')[0]
          }
        })
        
        // Crear o actualizar perfil en public.users
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle()
        
        if (existingUser) {
          // Actualizar
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
      } else if (data.user) {
        // No hay rol en query param, redirigir a complete-profile
        return NextResponse.redirect(new URL('/auth/complete-profile', requestUrl.origin))
      }
      
    } catch (err) {
      return NextResponse.redirect(new URL('/login?error=callback_error', requestUrl.origin))
    }
  }

  // Leer redirect URL de query params
  const redirectUrl = requestUrl.searchParams.get('redirect') || '/'
  return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
}
