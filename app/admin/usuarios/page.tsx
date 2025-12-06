import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { UsersManagementClient } from '@/components/admin/UsersManagementClient'

export default async function UsersManagementPage() {
  // Verificación de admin en el servidor
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/usuarios')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  // Obtener usuarios (primeros 50)
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // Obtener estadísticas
  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: adminCount }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).is('suspended_at', null),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin')
  ])

  const stats = {
    total: totalUsers || 0,
    active: activeUsers || 0,
    admins: adminCount || 0,
    suspended: (totalUsers || 0) - (activeUsers || 0)
  }

  return <UsersManagementClient initialUsers={users || []} stats={stats} />
}
