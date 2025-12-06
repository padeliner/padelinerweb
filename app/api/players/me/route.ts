import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/players/me
 * Obtener perfil completo del jugador actual
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener perfil completo
    const { data: profile, error: profileError } = await supabase
      .from('player_profiles')
      .select(`
        *,
        user:users!player_profiles_user_id_fkey(
          id,
          email,
          full_name,
          avatar_url,
          phone,
          role,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .single()

    // Si no existe perfil, crear uno básico
    if (profileError) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!userData) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      // Crear perfil básico
      const { data: newProfile, error: createError } = await supabase
        .from('player_profiles')
        .insert({
          user_id: user.id,
          display_name: userData.full_name
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating profile:', createError)
        return NextResponse.json(
          { error: 'Error al crear perfil' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        ...newProfile,
        user: userData
      })
    }

    // Obtener estadísticas adicionales
    const { data: reviewsData } = await supabase
      .from('player_reviews')
      .select('rating, is_public')
      .eq('player_id', user.id)

    const publicReviews = reviewsData?.filter(r => r.is_public) || []
    const averageRating = publicReviews.length > 0
      ? publicReviews.reduce((acc, r) => acc + r.rating, 0) / publicReviews.length
      : null

    const { count: achievementsCount } = await supabase
      .from('player_achievement_unlocks')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', user.id)

    const { count: sessionsCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)

    return NextResponse.json({
      ...profile,
      stats: {
        average_rating: averageRating,
        total_reviews: reviewsData?.length || 0,
        public_reviews: publicReviews.length,
        achievements_unlocked: achievementsCount || 0,
        total_sessions: sessionsCount || 0
      }
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/players/me
 * Actualizar perfil del jugador actual
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      display_name,
      bio,
      avatar_url,
      skill_level,
      years_playing,
      favorite_position,
      preferred_training_type,
      goals,
      profile_visibility,
      show_stats,
      show_reviews,
      show_coaches,
      phone,
      city,
      location_formatted,
      location_lat,
      location_lng,
      country,
      birth_date
    } = body

    // Validar y actualizar datos en tabla users (avatar y phone)
    const userUpdateData: any = {}
    if (phone !== undefined) userUpdateData.phone = phone
    if (avatar_url !== undefined) userUpdateData.avatar_url = avatar_url
    
    if (Object.keys(userUpdateData).length > 0) {
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('id', user.id)
      
      if (userError) {
        console.error('Error updating users:', userError)
        return NextResponse.json(
          { error: 'Error al actualizar datos del usuario', details: userError.message },
          { status: 500 }
        )
      }
    }

    // Validar datos del perfil (públicos)
    const updateData: any = {}
    
    // Ubicación completa (en player_profiles)
    if (city !== undefined) updateData.city = city
    if (location_formatted !== undefined) updateData.location_formatted = location_formatted
    if (location_lat !== undefined) updateData.location_lat = location_lat
    if (location_lng !== undefined) updateData.location_lng = location_lng
    if (country !== undefined) updateData.country = country
    if (birth_date !== undefined) updateData.birth_date = birth_date
    
    if (display_name !== undefined) updateData.display_name = display_name
    if (bio !== undefined) updateData.bio = bio
    if (skill_level !== undefined) updateData.skill_level = skill_level
    if (years_playing !== undefined) updateData.years_playing = years_playing
    if (favorite_position !== undefined) updateData.favorite_position = favorite_position
    if (preferred_training_type !== undefined) updateData.preferred_training_type = preferred_training_type
    if (goals !== undefined) updateData.goals = goals
    if (profile_visibility !== undefined) updateData.profile_visibility = profile_visibility
    if (show_stats !== undefined) updateData.show_stats = show_stats
    if (show_reviews !== undefined) updateData.show_reviews = show_reviews
    if (show_coaches !== undefined) updateData.show_coaches = show_coaches

    // Actualizar perfil solo si hay datos
    if (Object.keys(updateData).length > 0) {
      const { data, error } = await supabase
        .from('player_profiles')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
          { error: 'Error al actualizar perfil', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data })
    }

    // Si solo se actualizó users (avatar/phone), retornar éxito
    return NextResponse.json({ success: true, message: 'Perfil actualizado' })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', message: error.message },
      { status: 500 }
    )
  }
}
