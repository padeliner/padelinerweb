import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export default async function AdminDashboard() {
  // Verificación en el SERVIDOR (100% segura)
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Si no hay usuario, redirigir al login
  if (error || !user) {
    redirect('/login?redirectTo=/admin')
  }

  // Verificar si el usuario es admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Si no es admin, redirigir a home
  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  // Obtener estadísticas en el servidor
  const [
    { count: totalUsers },
    { count: trainers },
    { count: academies },
    { count: clubs },
    { count: students },
    { count: newUsersWeek }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'entrenador'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'academia'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'club'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'alumno'),
    supabase.from('users').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ])

  const stats = {
    totalUsers: totalUsers || 0,
    trainers: trainers || 0,
    academies: academies || 0,
    clubs: clubs || 0,
    students: students || 0,
    monthRevenue: 0, // TODO: Implementar cuando tengamos transacciones
    monthReservations: 0, // TODO: Implementar cuando tengamos reservas
    newUsersWeek: newUsersWeek || 0,
  }

  // Renderizar el componente cliente con los datos del servidor
  return <AdminDashboardClient stats={stats} />
}
