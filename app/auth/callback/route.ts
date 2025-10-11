import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('🔄 Callback ejecutándose...')
  console.log('🔑 Code:', code ? 'presente' : 'ausente')
  console.log('🌐 Origin:', requestUrl.origin)

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error en exchange:', error)
        return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
      }
      
      console.log('✅ Sesión intercambiada exitosamente')
      console.log('👤 Usuario:', data?.user?.email)
    } catch (err) {
      console.error('❌ Error en callback:', err)
      return NextResponse.redirect(new URL('/login?error=callback_error', requestUrl.origin))
    }
  }

  // IMPORTANTE: Redirigir a complete-profile para aplicar el rol
  const redirectUrl = new URL('/auth/complete-profile', requestUrl.origin)
  console.log('➡️  Redirigiendo a:', redirectUrl.toString())
  
  return NextResponse.redirect(redirectUrl)
}
