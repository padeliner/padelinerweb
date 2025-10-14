'use client'

import { useEffect, useState } from 'react'

export function useAdminTheme() {
  // Modo oscuro por defecto
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Leer preferencia guardada o usar oscuro por defecto
    const savedTheme = localStorage.getItem('admin-theme')
    if (savedTheme === 'light') {
      setIsDark(false)
    } else {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    // Aplicar tema al body solo cuando estamos en admin
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      if (isDark) {
        document.documentElement.classList.add('dark-admin')
        localStorage.setItem('admin-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark-admin')
        localStorage.setItem('admin-theme', 'light')
      }
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return { isDark, toggleTheme }
}
