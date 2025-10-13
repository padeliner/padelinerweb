'use client'

import { Home, Dumbbell, GraduationCap, Building2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/entrenadores', icon: Dumbbell, label: 'Entrenador' },
    { href: '/academias', icon: GraduationCap, label: 'Academia' },
    { href: '/clubes', icon: Building2, label: 'Club' },
    { href: '/tienda', icon: ShoppingBag, label: 'Tienda' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50"
      style={{
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
      }}
    >
      <div className="grid grid-cols-5 h-14">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] leading-tight font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
