import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CoachesManagementClient } from '@/components/admin/CoachesManagementClient'

export default async function CoachesPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/entrenadores')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  // Obtener entrenadores desde la base de datos
  const { data: coaches } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'entrenador')
    .order('created_at', { ascending: false })

  return <CoachesManagementClient initialCoaches={coaches || []} />
}
