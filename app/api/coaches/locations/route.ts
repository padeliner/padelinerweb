import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/locations - Obtener ubicaciones del entrenador
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: locations, error } = await supabase
      .from('coach_locations')
      .select('*')
      .eq('coach_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching locations:', error)
      return NextResponse.json(
        { error: 'Error al obtener ubicaciones' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      locations: locations || [],
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/locations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/coaches/locations - Crear nueva ubicación
export async function POST(request: NextRequest) {
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

    if (!name || !address) {
      return NextResponse.json(
        { error: 'Nombre y dirección son requeridos' },
        { status: 400 }
      )
    }

    // Si es la primera ubicación, hacerla predeterminada
    const { data: existing } = await supabase
      .from('coach_locations')
      .select('id')
      .eq('coach_id', user.id)

    const isFirst = !existing || existing.length === 0

    const { data: location, error } = await supabase
      .from('coach_locations')
      .insert({
        coach_id: user.id,
        name,
        address,
        type: type || 'both',
        is_default: isFirst,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating location:', error)
      return NextResponse.json(
        { error: 'Error al crear ubicación' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location,
      message: 'Ubicación creada exitosamente',
    })
  } catch (error) {
    console.error('Error in POST /api/coaches/locations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
