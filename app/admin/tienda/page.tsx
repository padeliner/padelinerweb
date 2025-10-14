import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { StoreManagementClient } from '@/components/admin/StoreManagementClient'

export default async function StorePage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/tienda')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  // Por ahora usamos datos mock
  return <StoreManagementClient />
}
