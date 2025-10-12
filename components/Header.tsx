'use client'

import { useState, useEffect } from 'react'
import { Menu, X, User, CircleDot, ShoppingCart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

// Mock data simplificado - en producción esto vendría de una API/estado global
const getUnreadMessagesCount = () => {
  // Simulamos el conteo de mensajes no leídos
  // En producción esto vendría de tu estado global o API
  return 2 // Carlos Martínez tiene 2 mensajes sin leer
}

interface HeaderProps {
  showCart?: boolean
  onCartClick?: () => void
  cartItemsCount?: number
}

export function Header({ showCart = false, onCartClick, cartItemsCount = 0 }: HeaderProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Obtener mensajes no leídos
  const unreadMessagesCount = getUnreadMessagesCount()

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
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-xl transition-transform group-hover:scale-110">
                <CircleDot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-neutral-900">
                Padeliner
              </span>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/entrenadores">Entrenadores</NavLink>
              <NavLink href="/clubes">Clubes</NavLink>
              <NavLink href="/academias">Academias</NavLink>
              <NavLink href="/tienda">Tienda</NavLink>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Messages Button */}
              <Link 
                href="/mensajes"
                className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Mensajes"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </Link>

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

              {/* Acceder Button */}
              <Link href="/welcome">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Menú"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-neutral-700" />
                ) : (
                  <Menu className="w-6 h-6 text-neutral-700" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden bg-white border-t border-neutral-200 transition-all duration-300 ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            <MobileNavLink href="/entrenadores" onClick={() => setIsOpen(false)}>
              Entrenadores
            </MobileNavLink>
            <MobileNavLink href="/clubes" onClick={() => setIsOpen(false)}>
              Clubes
            </MobileNavLink>
            <MobileNavLink href="/academias" onClick={() => setIsOpen(false)}>
              Academias
            </MobileNavLink>
            <MobileNavLink href="/tienda" onClick={() => setIsOpen(false)}>
              Tienda
            </MobileNavLink>
          </div>
        </div>
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

function MobileNavLink({ 
  href, 
  children, 
  onClick 
}: { 
  href: string
  children: React.ReactNode
  onClick: () => void 
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors">
        <span className="text-lg font-medium text-neutral-900">{children}</span>
        <span className="text-neutral-400">→</span>
      </div>
    </Link>
  )
}
