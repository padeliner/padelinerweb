import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { FinancesManagementClient } from '@/components/admin/FinancesManagementClient'

export default async function FinancesPage() {
  // Verificación de admin en el servidor
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/finanzas')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  // Por ahora usamos datos mock hasta que la tabla esté lista
  return <FinancesManagementClient />
}
