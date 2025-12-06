import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AcademiesManagementClient } from '@/components/admin/AcademiesManagementClient'

export default async function AcademiesPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/academias')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  return <AcademiesManagementClient />
}
