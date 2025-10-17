'use client'

import { useState, useEffect } from 'react'
import { User, ShoppingCart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useUnreadMessages } from '@/hooks/useUnreadMessages'
import NotificationBell from '@/components/NotificationBell'

interface HeaderProps {
  showCart?: boolean
  onCartClick?: () => void
  cartItemsCount?: number
  hideMessages?: boolean
}

export function Header({ showCart = false, onCartClick, cartItemsCount = 0, hideMessages = false }: HeaderProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Autenticación
  const { user, profile, isAuthenticated } = useAuth()
  
  // Obtener mensajes no leídos REALES con actualización automática
  const { unreadCount: unreadMessagesCount } = useUnreadMessages()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Detectar si ha scrolleado más de 20px
      setIsScrolled(currentScrollY > 20)
      
      // Mostrar/ocultar header según dirección del scroll
      if (currentScrollY < 10) {
        // Siempre visible al inicio
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down & past threshold - hide
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    // Check initial scroll position
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled 
            ? 'shadow-md' 
            : 'shadow-sm'
        } ${
          isVisible ? 'top-0' : '-top-24'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image 
                src="/padeliner-logo.png" 
                alt="Padeliner" 
                width={150} 
                height={40}
                className="h-10 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/entrenadores">Entrenadores</NavLink>
              <NavLink href="/clubes">Clubes</NavLink>
              <NavLink href="/academias">Academias</NavLink>
              <NavLink href="/tienda">Tienda</NavLink>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {/* Notification Bell - Solo para usuarios autenticados */}
              {isAuthenticated && <NotificationBell />}

              {/* Messages Button - Solo para usuarios autenticados */}
              {!hideMessages && isAuthenticated && (
                <Link 
                  href="/mensajes"
                  className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Mensajes"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Button (Only in shop pages) */}
              {showCart && (
                <button
                  onClick={onCartClick}
                  className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Carrito"
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Admin Panel Button - Solo para admins */}
              {isAuthenticated && profile && profile.role === 'admin' && (
                <Link href="/admin">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg"
                    aria-label="Panel Admin"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="hidden md:inline">Admin</span>
                  </button>
                </Link>
              )}

              {/* Acceder / Perfil Button */}
              {isAuthenticated && profile ? (
                <Link href={(() => {
                  // Redirigir al dashboard correspondiente según el rol
                  switch (profile.role) {
                    case 'entrenador':
                    case 'coach':
                      return '/dashboard/entrenador'
                    case 'academia':
                    case 'academy':
                      return '/dashboard/academia'
                    case 'club':
                      return '/dashboard/club'
                    case 'admin':
                      return '/admin'
                    case 'jugador':
                    case 'player':
                    default:
                      return '/dashboard/jugador'
                  }
                })()}>
                  <button
                    className="flex items-center space-x-2 px-2 py-2 hover:bg-neutral-100 rounded-full transition-all duration-200"
                    aria-label="Mi Dashboard"
                  >
                    {(() => {
                      // Prioridad: 1. avatar_url del perfil, 2. avatar de Google, 3. inicial
                      const avatarUrl = profile.avatar_url || user?.user_metadata?.avatar_url || null
                      
                      if (avatarUrl) {
                        return (
                          <img
                            src={avatarUrl}
                            alt={profile.full_name || 'Usuario'}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-primary-500"
                          />
                        )
                      }
                      
                      return (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                          {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )
                    })()}
                    <span className="hidden sm:inline text-sm font-medium text-neutral-900">
                      {profile.full_name || 'Mi Perfil'}
                    </span>
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    className={`
                      flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2.5
                      bg-primary-500 hover:bg-primary-600 active:scale-95
                      text-white font-semibold rounded-full
                      transition-all duration-200
                      shadow-lg shadow-primary-500/30
                      hover:shadow-xl hover:shadow-primary-500/40
                    `}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Acceder</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer */}
      <div className="h-16 sm:h-20" />
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <span className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 relative group hover:-translate-y-0.5">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
      </span>
    </Link>
  )
}
