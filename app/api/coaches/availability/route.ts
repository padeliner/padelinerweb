import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/availability - Obtener disponibilidad del entrenador
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener horarios semanales
    const { data: weeklySchedule, error: scheduleError } = await supabase
      .from('coach_availability')
      .select('*')
      .eq('coach_id', user.id)
      .eq('is_available', true)
      .order('day_of_week')
      .order('start_time')

    if (scheduleError) {
      console.error('Error fetching availability:', scheduleError)
      return NextResponse.json(
        { error: 'Error al obtener disponibilidad' },
        { status: 500 }
      )
    }

    // Obtener fechas bloqueadas (futuras)
    const { data: blockedDates, error: blockedError } = await supabase
      .from('coach_blocked_dates')
      .select('*')
      .eq('coach_id', user.id)
      .gte('blocked_date', new Date().toISOString().split('T')[0])
      .order('blocked_date')

    if (blockedError) {
      console.error('Error fetching blocked dates:', blockedError)
      return NextResponse.json(
        { error: 'Error al obtener fechas bloqueadas' },
        { status: 500 }
      )
    }

    // Agrupar horarios por día de la semana
    const scheduleByDay: { [key: number]: any[] } = {}
    weeklySchedule?.forEach((slot) => {
      if (!scheduleByDay[slot.day_of_week]) {
        scheduleByDay[slot.day_of_week] = []
      }
      scheduleByDay[slot.day_of_week].push({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
      })
    })

    return NextResponse.json({
      weekly_schedule: scheduleByDay,
      blocked_dates: blockedDates || [],
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/availability:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/coaches/availability - Actualizar disponibilidad semanal
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { weekly_schedule } = body

    if (!weekly_schedule || typeof weekly_schedule !== 'object') {
      return NextResponse.json(
        { error: 'Formato de horario inválido' },
        { status: 400 }
      )
    }

    // Verificar que no haya clases confirmadas en los horarios que se van a quitar
    // TODO: Implementar validación de conflictos con bookings existentes

    // Eliminar todos los horarios actuales del entrenador
    const { error: deleteError } = await supabase
      .from('coach_availability')
      .delete()
      .eq('coach_id', user.id)

    if (deleteError) {
      console.error('Error deleting old availability:', deleteError)
      return NextResponse.json(
        { error: 'Error al actualizar disponibilidad' },
        { status: 500 }
      )
    }

    // Insertar nuevos horarios
    const slotsToInsert = []

    for (const [dayOfWeek, slots] of Object.entries(weekly_schedule)) {
      const day = parseInt(dayOfWeek)

      if (Array.isArray(slots)) {
        for (const slot of slots) {
          if (slot.start_time && slot.end_time) {
            slotsToInsert.push({
              coach_id: user.id,
              day_of_week: day,
              start_time: slot.start_time,
              end_time: slot.end_time,
              is_available: true,
            })
          }
        }
      }
    }

    if (slotsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('coach_availability')
        .insert(slotsToInsert)

      if (insertError) {
        console.error('Error inserting new availability:', insertError)
        return NextResponse.json(
          { error: 'Error al guardar nuevos horarios' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Disponibilidad actualizada exitosamente',
    })
  } catch (error) {
    console.error('Error in PUT /api/coaches/availability:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
