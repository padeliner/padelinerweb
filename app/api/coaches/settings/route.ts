import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/settings - Obtener configuración del entrenador
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

    const { data: settings, error } = await supabase
      .from('coach_settings')
      .select('*')
      .eq('coach_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error)
      return NextResponse.json(
        { error: 'Error al obtener configuración' },
        { status: 500 }
      )
    }

    // Si no existe, devolver valores por defecto
    if (!settings) {
      return NextResponse.json({
        settings: {
          class_duration: 60,
          buffer_time: 0,
          min_advance_hours: 2,
          max_advance_days: 30,
        },
      })
    }

    return NextResponse.json({
      settings,
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/settings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/coaches/settings - Actualizar configuración
export async function PUT(request: NextRequest) {
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
    const { class_duration, buffer_time, min_advance_hours, max_advance_days } = body

    // Verificar si ya existe configuración
    const { data: existing } = await supabase
      .from('coach_settings')
      .select('id')
      .eq('coach_id', user.id)
      .single()

    let settings
    let error

    if (existing) {
      // Actualizar
      const result = await supabase
        .from('coach_settings')
        .update({
          class_duration,
          buffer_time,
          min_advance_hours,
          max_advance_days,
        })
        .eq('coach_id', user.id)
        .select()
        .single()

      settings = result.data
      error = result.error
    } else {
      // Crear
      const result = await supabase
        .from('coach_settings')
        .insert({
          coach_id: user.id,
          class_duration,
          buffer_time,
          min_advance_hours,
          max_advance_days,
        })
        .select()
        .single()

      settings = result.data
      error = result.error
    }

    if (error) {
      console.error('Error saving settings:', error)
      return NextResponse.json(
        { error: 'Error al guardar configuración' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings,
      message: 'Configuración guardada exitosamente',
    })
  } catch (error) {
    console.error('Error in PUT /api/coaches/settings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
