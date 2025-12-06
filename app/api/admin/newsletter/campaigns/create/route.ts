import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar que es admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, subject, preview_text, content_html, target_all, target_tags } = body

    // Validar campos requeridos
    if (!name || !subject || !content_html) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Generar versión texto plano del HTML
    const content_text = content_html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Crear campaña
    const { data: campaign, error } = await supabase
      .from('newsletter_campaigns')
      .insert({
        name,
        subject,
        preview_text: preview_text || null,
        content_html,
        content_text,
        status: 'draft',
        target_all: target_all ?? true,
        target_tags: target_tags || [],
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      campaign
    })

  } catch (error: any) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Error al crear campaña' },
      { status: 500 }
    )
  }
}
