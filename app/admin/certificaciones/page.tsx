import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CertificationsManagementClient } from '@/components/admin/CertificationsManagementClient'

export default async function CertificationsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/certificaciones')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  // Por ahora usamos datos mock hasta que las tablas estén listas
  return <CertificationsManagementClient />
}
