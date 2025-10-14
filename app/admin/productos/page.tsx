import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ProductsManagementClient } from '@/components/admin/ProductsManagementClient'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/productos')
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
  return <ProductsManagementClient />
}
