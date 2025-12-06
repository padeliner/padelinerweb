import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET - Listar todos los blogs (incluye borradores para admin)
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'all', 'published', 'draft'
    const category = searchParams.get('category')

    let query = supabase
      .from('blogs')
      .select(`
        *,
        author:users(id, full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (status === 'published') {
      query = query.eq('published', true)
    } else if (status === 'draft') {
      query = query.eq('published', false)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: blogs, error: dbError } = await query

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al obtener blogs', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({ blogs: blogs || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo blog
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
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category,
      tags,
      published,
      seo_title,
      seo_description,
    } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, slug, content' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    const { data: existingBlog } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingBlog) {
      return NextResponse.json(
        { error: 'Ya existe un blog con ese slug' },
        { status: 400 }
      )
    }

    const { data: blog, error: dbError } = await supabase
      .from('blogs')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content,
        cover_image: cover_image || null,
        author_id: user.id,
        category: category || 'general',
        tags: tags || [],
        published: published || false,
        published_at: published ? new Date().toISOString() : null,
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt || '',
      })
      .select(`
        *,
        author:users(id, full_name, email, avatar_url)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear blog', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      blog,
      message: 'Blog creado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar blog
export async function PATCH(request: NextRequest) {
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del blog' },
        { status: 400 }
      )
    }

    const { data: blog, error: dbError } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        author:users(id, full_name, email, avatar_url)
      `)
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al actualizar blog', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      blog,
      message: 'Blog actualizado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar blog
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del blog' },
        { status: 400 }
      )
    }

    const { error: dbError } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al eliminar blog', details: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog eliminado correctamente',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
