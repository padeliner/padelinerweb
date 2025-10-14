import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SettingsManagementClient } from '@/components/admin/SettingsManagementClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/configuracion')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  return <SettingsManagementClient />
}
