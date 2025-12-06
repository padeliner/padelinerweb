import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DiscountCodesManagementClient } from '@/components/admin/DiscountCodesManagementClient'

export default async function DiscountCodesPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/codigos-descuento')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  return <DiscountCodesManagementClient />
}
