import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PUT /api/coaches/locations/[id] - Actualizar ubicación
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

    const body = await request.json()
    const { name, address, type } = body

    const { data: location, error } = await supabase
      .from('coach_locations')
      .update({
        name,
        address,
        type,
      })
      .eq('id', params.id)
      .eq('coach_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating location:', error)
      return NextResponse.json(
        { error: 'Error al actualizar ubicación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location,
      message: 'Ubicación actualizada exitosamente',
    })
  } catch (error) {
    console.error('Error in PUT /api/coaches/locations/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/coaches/locations/[id] - Eliminar ubicación
export async function DELETE(
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

    // Verificar que no sea la ubicación predeterminada
    const { data: location } = await supabase
      .from('coach_locations')
      .select('is_default')
      .eq('id', params.id)
      .eq('coach_id', user.id)
      .single()

    if (location?.is_default) {
      return NextResponse.json(
        { error: 'No puedes eliminar la ubicación predeterminada' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('coach_locations')
      .delete()
      .eq('id', params.id)
      .eq('coach_id', user.id)

    if (error) {
      console.error('Error deleting location:', error)
      return NextResponse.json(
        { error: 'Error al eliminar ubicación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Ubicación eliminada exitosamente',
    })
  } catch (error) {
    console.error('Error in DELETE /api/coaches/locations/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
