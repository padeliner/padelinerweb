import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ClubsManagementClient } from '@/components/admin/ClubsManagementClient'

export default async function ClubsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/clubes')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  return <ClubsManagementClient />
}
