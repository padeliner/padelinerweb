'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login?redirectTo=/admin')
          return
        }

        const { data: profile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          setIsAdmin(false)
          return
        }

        const adminStatus = profile?.role === 'admin'
        setIsAdmin(adminStatus)

        if (!adminStatus) {
          router.push('/')
        }
      } catch (error) {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [supabase, router])

  return { isAdmin, loading }
}
