import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET - Obtener configuración actual
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener configuración
    const { data: config, error } = await supabase
      .from('blog_config')
      .select('*')
      .single()

    if (error) {
      // Si no existe, crear configuración por defecto
      const { data: newConfig, error: createError } = await supabase
        .from('blog_config')
        .insert({ auto_generate_enabled: false })
        .select()
        .single()

      if (createError) {
        return NextResponse.json(
          { error: 'Error al crear configuración', details: createError },
          { status: 500 }
        )
      }

      return NextResponse.json(newConfig)
    }

    return NextResponse.json(config)

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al obtener configuración', details: error?.message },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar configuración
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos del body
    const body = await request.json()
    const { auto_generate_enabled } = body

    if (typeof auto_generate_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'auto_generate_enabled debe ser un booleano' },
        { status: 400 }
      )
    }

    // Obtener ID de la configuración
    const { data: currentConfig } = await supabase
      .from('blog_config')
      .select('id')
      .single()

    if (!currentConfig) {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar configuración
    const { data: config, error } = await supabase
      .from('blog_config')
      .update({ auto_generate_enabled })
      .eq('id', currentConfig.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error al actualizar configuración', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      config,
      message: `Auto-generación ${auto_generate_enabled ? 'activada' : 'desactivada'}`
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al actualizar configuración', details: error?.message },
      { status: 500 }
    )
  }
}
