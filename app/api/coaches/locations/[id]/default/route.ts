import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PUT /api/coaches/locations/[id]/default - Establecer como predeterminada
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Primero, quitar is_default de todas las ubicaciones
    await supabase
      .from('coach_locations')
      .update({ is_default: false })
      .eq('coach_id', user.id)

    // Luego, establecer esta como predeterminada
    const { data: location, error } = await supabase
      .from('coach_locations')
      .update({ is_default: true })
      .eq('id', params.id)
      .eq('coach_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error setting default location:', error)
      return NextResponse.json(
        { error: 'Error al establecer ubicación predeterminada' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location,
      message: 'Ubicación predeterminada actualizada',
    })
  } catch (error) {
    console.error('Error in PUT /api/coaches/locations/[id]/default:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
