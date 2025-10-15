import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/admin/teams
 * Listar todos los equipos
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(
          id,
          role,
          is_active,
          user:users(id, full_name, email, avatar_url)
        ),
        conversation_count:conversations(count)
      `)
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Error fetching teams', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ teams: data })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/teams
 * Crear nuevo equipo
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, email, color, icon } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'name and slug are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name,
        slug,
        description,
        email,
        color: color || '#059669',
        icon: icon || 'mail'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Error creating team', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ team: data }, { status: 201 })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
