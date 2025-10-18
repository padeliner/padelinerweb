import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/finances - Obtener datos financieros del entrenador
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

    // Obtener parámetro del mes
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || new Date().toISOString().substring(0, 7)
    const [year, monthNumber] = month.split('-')

    // Fechas de inicio y fin del mes
    const startDate = `${year}-${monthNumber}-01`
    const endDate = new Date(parseInt(year), parseInt(monthNumber), 0)
      .toISOString()
      .split('T')[0]

    // Obtener todas las clases completadas del entrenador
    const { data: allBookings, error: allBookingsError } = await supabase
      .from('bookings')
      .select(
        `
        id,
        booking_date,
        total_price,
        status,
        payment_status,
        player:users!bookings_player_id_fkey (
          full_name
        )
      `
      )
      .eq('coach_id', user.id)
      .eq('status', 'completed')

    if (allBookingsError) {
      console.error('Error fetching all bookings:', allBookingsError)
      return NextResponse.json(
        { error: 'Error al obtener datos financieros' },
        { status: 500 }
      )
    }

    // Obtener clases del mes específico
    const { data: monthBookings, error: monthBookingsError } = await supabase
      .from('bookings')
      .select(
        `
        id,
        booking_date,
        total_price,
        status,
        payment_status,
        player:users!bookings_player_id_fkey (
          full_name
        )
      `
      )
      .eq('coach_id', user.id)
      .gte('booking_date', startDate)
      .lte('booking_date', endDate)
      .in('status', ['confirmed', 'completed'])
      .order('booking_date', { ascending: false })

    if (monthBookingsError) {
      console.error('Error fetching month bookings:', monthBookingsError)
      return NextResponse.json(
        { error: 'Error al obtener datos del mes' },
        { status: 500 }
      )
    }

    // Calcular estadísticas (comisión 15%)
    const COMMISSION = 0.15
    
    const totalEarnings =
      allBookings?.reduce(
        (sum, booking) => sum + parseFloat(booking.total_price.toString()) * (1 - COMMISSION),
        0
      ) || 0

    const monthlyEarnings =
      monthBookings
        ?.filter((b) => b.status === 'completed')
        .reduce((sum, booking) => sum + parseFloat(booking.total_price.toString()) * (1 - COMMISSION), 0) || 0

    const pendingPayments =
      monthBookings
        ?.filter((b) => b.status === 'confirmed' && b.payment_status === 'pending')
        .reduce((sum, booking) => sum + parseFloat(booking.total_price.toString()) * (1 - COMMISSION), 0) || 0

    const completedClasses =
      allBookings?.filter((b) => b.status === 'completed').length || 0

    const averagePerClass = completedClasses > 0 ? totalEarnings / completedClasses : 0

    // Formatear transacciones
    const transactions = monthBookings?.map((booking: any) => ({
      id: booking.id,
      booking_date: booking.booking_date,
      player_name: booking.player?.full_name || 'Desconocido',
      amount: parseFloat(booking.total_price.toString()) * (1 - COMMISSION),
      status: booking.status,
      payment_status: booking.payment_status,
    }))

    return NextResponse.json({
      stats: {
        total_earnings: totalEarnings,
        monthly_earnings: monthlyEarnings,
        pending_payments: pendingPayments,
        completed_classes: completedClasses,
        average_per_class: averagePerClass,
      },
      transactions: transactions || [],
      month,
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/finances:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
