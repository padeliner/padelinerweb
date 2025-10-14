import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Intentar obtener emails del historial con relación a users
    const { data: emails, error: dbError, count } = await supabase
      .from('admin_emails')
      .select(`
        *,
        from_user:users!admin_emails_from_user_id_fkey(id, email, full_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Si hay error de DB, devolver array vacío (tabla no existe aún)
    if (dbError) {
      return NextResponse.json({
        emails: [],
        total: 0,
        limit,
        offset,
        note: 'La tabla admin_emails no está configurada en Supabase',
      })
    }

    return NextResponse.json({
      emails: emails || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
