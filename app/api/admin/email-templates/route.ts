import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
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
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { data: templates, error: dbError } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.warn('Error obteniendo plantillas:', dbError)
      return NextResponse.json({
        templates: [],
        note: 'La tabla email_templates no está configurada',
      })
    }

    return NextResponse.json({ templates: templates || [] })
  } catch (error) {
    console.error('Error en API de plantillas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
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
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, subject, html_content, category } = body

    if (!name || !subject || !html_content) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, subject, html_content' },
        { status: 400 }
      )
    }

    const { data: template, error: dbError } = await supabase
      .from('email_templates')
      .insert({
        name,
        description,
        subject,
        html_content,
        category: category || 'general',
        created_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error creando plantilla:', dbError)
      return NextResponse.json(
        { error: 'Error al crear plantilla', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template,
      message: 'Plantilla creada correctamente',
    })
  } catch (error) {
    console.error('Error en API de plantillas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
