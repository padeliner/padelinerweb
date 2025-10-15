'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Award,
  CreditCard,
  ShoppingBag,
  Calendar,
  MapPin,
  Star,
  Shield,
  Bell,
  Settings,
  FileText,
  Home,
  ArrowLeft,
  DollarSign,
  Mail,
  Headphones,
  Ticket,
  BookOpen,
  MessageCircle,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Usuarios',
    href: '/admin/usuarios',
    icon: Users,
  },
  {
    name: 'Certificaciones',
    href: '/admin/certificaciones',
    icon: Award,
  },
  {
    name: 'Reservas',
    href: '/admin/reservas',
    icon: Calendar,
  },
  {
    name: 'Finanzas',
    href: '/admin/finanzas',
    icon: DollarSign,
  },
  {
    name: 'Tienda',
    href: '/admin/tienda',
    icon: ShoppingBag,
  },
  {
    name: 'Códigos Descuento',
    href: '/admin/codigos-descuento',
    icon: Ticket,
  },
  {
    name: 'Mensajería',
    href: '/admin/mensajeria',
    icon: Mail,
  },
  {
    name: 'Newsletter',
    href: '/admin/newsletter',
    icon: Send,
  },
  {
    name: 'Soporte',
    href: '/admin/soporte',
    icon: Headphones,
  },
  {
    name: 'Moderación',
    href: '/admin/moderacion',
    icon: MessageCircle,
  },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: BookOpen,
  },
  {
    name: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
  },
  {
    name: 'Logs',
    href: '/admin/logs',
    icon: FileText,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark-admin:bg-slate-900 border-r border-neutral-200 dark-admin:border-slate-700 flex flex-col transition-colors">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark-admin:border-slate-700">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-neutral-900 dark-admin:text-slate-100">Padeliner</h1>
            <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-green-50 dark-admin:bg-green-900/20 text-green-700 dark-admin:text-green-400 font-medium'
                      : 'text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-50 dark-admin:hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 dark-admin:border-slate-700 space-y-3">
        {/* Botón Volver a Home */}
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-neutral-100 dark-admin:bg-slate-800 hover:bg-neutral-200 dark-admin:hover:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Volver a Home</span>
        </Link>
        
        <p className="text-xs text-neutral-500 dark-admin:text-slate-400 text-center">
          v1.0.0 • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
