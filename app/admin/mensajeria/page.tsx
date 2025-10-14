import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { MessagingClient } from '@/components/admin/MessagingClient'

export default async function MessagingPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login?redirectTo=/admin/mensajeria')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  return <MessagingClient />
}
