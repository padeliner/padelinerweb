'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Dashboard
          </h1>
          <p className="text-neutral-600 mb-6">
            Bienvenido a Padeliner, {user?.email}
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">Email:</p>
              <p className="text-neutral-900">{user?.email}</p>
            </div>
            
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-semibold text-neutral-700">Usuario ID:</p>
              <p className="text-neutral-900 font-mono text-sm">{user?.id}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
            >
              Cerrar Sesión
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-semibold rounded-xl transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
