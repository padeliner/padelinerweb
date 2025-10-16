import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Actualizar presencia llamando a la función
    const { error } = await supabase.rpc('update_user_presence', {
      p_status: 'online'
    })

    if (error) {
      console.error('Error updating presence:', error)
      return NextResponse.json(
        { error: 'Error al actualizar presencia' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in heartbeat:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET para obtener presencia de un usuario
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_presence')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching presence:', error)
      return NextResponse.json(
        { error: 'Error al obtener presencia' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      presence: data || { status: 'offline', last_seen: null }
    })

  } catch (error) {
    console.error('Error in GET presence:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
