import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/profile - Obtener perfil completo del entrenador
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json(
        { error: 'Error al obtener usuario' },
        { status: 500 }
      )
    }

    // Obtener datos del coach
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (coachError && coachError.code !== 'PGRST116') {
      console.error('Error fetching coach:', coachError)
    }

    // Combinar datos
    return NextResponse.json({
      profile: {
        ...userData,
        ...coachData,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/profile:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/coaches/profile - Actualizar perfil del entrenador
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()

    // Campos de users
    const userFields = ['full_name', 'phone', 'avatar_url']
    const userData: any = {}
    for (const field of userFields) {
      if (body[field] !== undefined) {
        userData[field] = body[field]
      }
    }

    // Campos de coaches
    const coachFields = [
      'bio',
      'experience_years',
      'certifications',
      'specialties',
      'languages',
      'price_per_hour',
      'offers_home_service',
      'location',
      'location_city',
      'location_lat',
      'location_lng',
      'images',
    ]
    const coachData: any = {}
    for (const field of coachFields) {
      if (body[field] !== undefined) {
        coachData[field] = body[field]
      }
    }

    if (Object.keys(userData).length === 0 && Object.keys(coachData).length === 0) {
      return NextResponse.json(
        { error: 'No hay datos para actualizar' },
        { status: 400 }
      )
    }

    // Actualizar users
    if (Object.keys(userData).length > 0) {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)

      if (userUpdateError) {
        console.error('Error updating user:', userUpdateError)
        return NextResponse.json(
          { error: 'Error al actualizar usuario' },
          { status: 500 }
        )
      }
    }

    // Actualizar coaches
    if (Object.keys(coachData).length > 0) {
      const { error: coachUpdateError } = await supabase
        .from('coaches')
        .update(coachData)
        .eq('user_id', user.id)

      if (coachUpdateError) {
        console.error('Error updating coach:', coachUpdateError)
        return NextResponse.json(
          { error: 'Error al actualizar perfil de entrenador' },
          { status: 500 }
        )
      }
    }

    // Obtener datos actualizados
    const { data: updatedUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: updatedCoach } = await supabase
      .from('coaches')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      profile: {
        ...updatedUser,
        ...updatedCoach,
      },
      message: 'Perfil actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error in PUT /api/coaches/profile:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
