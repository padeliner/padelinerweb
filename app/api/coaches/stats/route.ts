import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/coaches/stats - Obtener estadísticas del entrenador
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

    // Obtener parámetros
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month'
    
    // Calcular fechas según el período
    const today = new Date()
    let fromDate: Date
    
    switch (period) {
      case 'today':
        fromDate = new Date(today)
        fromDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        fromDate = new Date(today)
        fromDate.setDate(today.getDate() - 7)
        break
      case 'month':
        fromDate = new Date(today)
        fromDate.setMonth(today.getMonth() - 1)
        break
      case 'year':
        fromDate = new Date(today)
        fromDate.setFullYear(today.getFullYear() - 1)
        break
      default:
        fromDate = new Date(today)
        fromDate.setMonth(today.getMonth() - 1)
    }

    const fromDateStr = fromDate.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]

    // 1. Total de alumnos únicos (históricamente)
    const { data: studentsData, error: studentsError } = await supabase
      .from('bookings')
      .select('player_id')
      .eq('coach_id', user.id)
      .eq('status', 'completed')

    const totalStudents = studentsData
      ? new Set(studentsData.map((b) => b.player_id)).size
      : 0

    // 2. Próximas clases esta semana
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + 7)
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0]

    const { data: upcomingClasses, error: upcomingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('coach_id', user.id)
      .in('status', ['confirmed', 'pending'])
      .gte('booking_date', todayStr)
      .lte('booking_date', endOfWeekStr)

    const upcomingCount = upcomingClasses?.length || 0

    // 3. Ingresos del período (después de comisión del 15%)
    const { data: earningsData, error: earningsError } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('coach_id', user.id)
      .eq('status', 'completed')
      .gte('booking_date', fromDateStr)
      .lte('booking_date', todayStr)

    const totalEarnings = earningsData
      ? earningsData.reduce((sum, b) => sum + parseFloat(b.total_price), 0) * 0.85 // 85% después de 15% comisión
      : 0

    // 4. Rating promedio
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('bookings')
      .select('rating')
      .eq('coach_id', user.id)
      .not('rating', 'is', null)

    const avgRating = ratingsData && ratingsData.length > 0
      ? ratingsData.reduce((sum, b) => sum + b.rating, 0) / ratingsData.length
      : 0

    const totalReviews = ratingsData?.length || 0

    // 5. Clases por día (últimos 30 días para el gráfico)
    const last30Days = new Date(today)
    last30Days.setDate(today.getDate() - 30)
    const last30DaysStr = last30Days.toISOString().split('T')[0]

    const { data: classesByDay, error: classesByDayError } = await supabase
      .from('bookings')
      .select('booking_date')
      .eq('coach_id', user.id)
      .eq('status', 'completed')
      .gte('booking_date', last30DaysStr)
      .lte('booking_date', todayStr)
      .order('booking_date')

    // Agrupar por fecha
    const classesCount: { [key: string]: number } = {}
    classesByDay?.forEach((booking) => {
      const date = booking.booking_date
      classesCount[date] = (classesCount[date] || 0) + 1
    })

    // Convertir a array para el gráfico
    const chartData = Object.entries(classesCount).map(([date, count]) => ({
      date,
      count,
    }))

    // 6. Ingresos mensuales (últimos 12 meses)
    const last12Months = new Date(today)
    last12Months.setMonth(today.getMonth() - 12)
    const last12MonthsStr = last12Months.toISOString().split('T')[0]

    const { data: monthlyEarnings, error: monthlyError } = await supabase
      .from('bookings')
      .select('booking_date, total_price')
      .eq('coach_id', user.id)
      .eq('status', 'completed')
      .gte('booking_date', last12MonthsStr)
      .lte('booking_date', todayStr)

    // Agrupar por mes
    const earningsByMonth: { [key: string]: number } = {}
    monthlyEarnings?.forEach((booking) => {
      const month = booking.booking_date.substring(0, 7) // YYYY-MM
      const earnings = parseFloat(booking.total_price) * 0.85
      earningsByMonth[month] = (earningsByMonth[month] || 0) + earnings
    })

    const monthlyChartData = Object.entries(earningsByMonth).map(([month, earnings]) => ({
      month,
      earnings: Math.round(earnings * 100) / 100,
    }))

    return NextResponse.json({
      kpis: {
        total_students: totalStudents,
        upcoming_classes: upcomingCount,
        earnings_period: Math.round(totalEarnings * 100) / 100,
        average_rating: Math.round(avgRating * 10) / 10,
        total_reviews: totalReviews,
      },
      charts: {
        classes_by_day: chartData,
        earnings_by_month: monthlyChartData,
      },
      period,
      from_date: fromDateStr,
      to_date: todayStr,
    })
  } catch (error) {
    console.error('Error in GET /api/coaches/stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
