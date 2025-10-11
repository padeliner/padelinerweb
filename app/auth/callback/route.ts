import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // Verificar si hay un rol pendiente de asignar (OAuth flow)
    // Nota: Este código se ejecuta server-side, necesitamos manejarlo client-side
  }

  // Redirigir a una página que maneje la actualización del rol
  return NextResponse.redirect(new URL('/auth/complete-profile', requestUrl.origin))
}
