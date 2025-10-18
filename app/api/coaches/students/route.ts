import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/students - Obtener lista de alumnos del entrenador
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

    // Obtener alumnos únicos del entrenador desde las reservas
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(
        `
        player_id,
        status,
        booking_date,
        player:users!bookings_player_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq('coach_id', user.id)
      .in('status', ['confirmed', 'completed'])

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Error al obtener alumnos' },
        { status: 500 }
      )
    }

    // Agrupar por alumno y calcular estadísticas
    const studentsMap = new Map()

    bookings?.forEach((booking: any) => {
      const playerId = booking.player_id
      if (!studentsMap.has(playerId)) {
        studentsMap.set(playerId, {
          id: playerId,
          full_name: booking.player?.full_name || 'Desconocido',
          avatar_url: booking.player?.avatar_url || null,
          total_classes: 0,
          completed_classes: 0,
          pending_classes: 0,
          last_class_date: null,
          notes: '',
        })
      }

      const student = studentsMap.get(playerId)
      student.total_classes++

      if (booking.status === 'completed') {
        student.completed_classes++
        if (
          !student.last_class_date ||
          booking.booking_date > student.last_class_date
        ) {
          student.last_class_date = booking.booking_date
        }
      } else if (booking.status === 'confirmed') {
        student.pending_classes++
      }
    })

    const students = Array.from(studentsMap.values())

    return NextResponse.json({
      students,
      count: students.length,
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/students:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
