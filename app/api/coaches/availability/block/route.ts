import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/availability/blocked - Obtener fechas bloqueadas
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

    // Obtener fechas bloqueadas
    const { data: blockedDates, error } = await supabase
      .from('coach_blocked_dates')
      .select('*')
      .eq('coach_id', user.id)
      .gte('blocked_date', new Date().toISOString().split('T')[0])
      .order('blocked_date')

    if (error) {
      console.error('Error fetching blocked dates:', error)
      return NextResponse.json(
        { error: 'Error al obtener fechas bloqueadas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      blockedDates: blockedDates || [],
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/availability/blocked:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/coaches/availability/block - Bloquear una fecha
export async function POST(request: NextRequest) {
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
    const { blocked_date, start_time, end_time, reason } = body

    if (!blocked_date) {
      return NextResponse.json(
        { error: 'La fecha es obligatoria' },
        { status: 400 }
      )
    }

    // Verificar que la fecha no sea en el pasado
    const blockDate = new Date(blocked_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (blockDate < today) {
      return NextResponse.json(
        { error: 'No puedes bloquear fechas en el pasado' },
        { status: 400 }
      )
    }

    // Verificar si hay bookings confirmados en esa fecha
    let bookingsQuery = supabase
      .from('bookings')
      .select('id, booking_date, start_time, end_time, player:users!bookings_player_id_fkey(nombre, apellido)')
      .eq('coach_id', user.id)
      .eq('booking_date', blocked_date)
      .in('status', ['confirmed', 'pending'])

    // Si se especifica rango horario, verificar solo ese rango
    if (start_time && end_time) {
      // TODO: Filtrar por overlap de horarios
      // Por ahora, obtenemos todos los bookings del día y validamos después
    }

    const { data: existingBookings, error: bookingsError } = await bookingsQuery

    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Error al verificar reservas existentes' },
        { status: 500 }
      )
    }

    // Insertar fecha bloqueada
    const dataToInsert: any = {
      coach_id: user.id,
      blocked_date,
      reason: reason || null,
    }

    if (start_time && end_time) {
      dataToInsert.start_time = start_time
      dataToInsert.end_time = end_time
    }

    const { data: blockedDate, error: insertError } = await supabase
      .from('coach_blocked_dates')
      .insert(dataToInsert)
      .select()
      .single()

    if (insertError) {
      console.error('Error blocking date:', insertError)
      return NextResponse.json(
        { error: 'Error al bloquear fecha' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      blocked_date: blockedDate,
      existing_bookings: existingBookings || [],
      warning: existingBookings && existingBookings.length > 0 
        ? `Hay ${existingBookings.length} reserva(s) en esta fecha. Deberás cancelarlas manualmente.`
        : null,
    })
  } catch (error) {
    console.error('Error in POST /api/coaches/availability/block:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/coaches/availability/block - Desbloquear una fecha
export async function DELETE(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'El ID es obligatorio' },
        { status: 400 }
      )
    }

    // Eliminar fecha bloqueada (solo si pertenece al coach)
    const { error: deleteError } = await supabase
      .from('coach_blocked_dates')
      .delete()
      .eq('id', id)
      .eq('coach_id', user.id)

    if (deleteError) {
      console.error('Error unblocking date:', deleteError)
      return NextResponse.json(
        { error: 'Error al desbloquear fecha' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Fecha desbloqueada exitosamente',
    })
  } catch (error) {
    console.error('Error in DELETE /api/coaches/availability/block:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
