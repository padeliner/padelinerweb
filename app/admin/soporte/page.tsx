import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SupportManagementClient } from '@/components/admin/SupportManagementClient'

export default async function SupportPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <SupportManagementClient />
}
