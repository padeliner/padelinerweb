'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Bell, LogOut, User, Sun, Moon } from 'lucide-react'
import { useAdminTheme } from '@/hooks/useAdminTheme'

export function AdminHeader() {
  const { isDark, toggleTheme } = useAdminTheme()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', user.id)
          .single()
        
        setUser({ ...user, ...profile })
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700 flex items-center justify-between px-6 transition-colors">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100">Panel de Administración</h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-800 rounded-lg transition-colors"
          title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-neutral-700 dark-admin:text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 px-3 py-2 bg-neutral-50 dark-admin:bg-slate-800 rounded-lg">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {!loading && user && (
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                {user.full_name || 'Admin'}
              </p>
              <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Administrador</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark-admin:bg-red-900/20 text-red-600 dark-admin:text-red-400 hover:bg-red-100 dark-admin:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">Salir</span>
        </button>
      </div>
    </header>
  )
}
