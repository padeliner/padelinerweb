import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CommentsModerationClient from '@/components/admin/CommentsModerationClient'

export default async function ModerationPage() {
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

  return <CommentsModerationClient />
}
