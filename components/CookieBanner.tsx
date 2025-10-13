'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Settings, Shield } from 'lucide-react'
import Link from 'next/link'

type CookieConsent = {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Siempre activas
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Comprobar si ya existe consentimiento
    const savedConsent = localStorage.getItem('cookie_consent')
    if (!savedConsent) {
      // Mostrar banner después de un pequeño delay
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (consentData: CookieConsent) => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      ...consentData,
      timestamp: new Date().toISOString(),
    }))
    
    // Aquí puedes inicializar Google Analytics u otras herramientas según el consentimiento
    if (consentData.analytics) {
      // window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
    
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    saveConsent(allConsent)
  }

  const acceptEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    })
  }

  const acceptCustom = () => {
    saveConsent(consent)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay semi-transparente */}
      <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" />

      {/* Banner principal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
          {!showSettings ? (
            // Vista simple
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Cookie className="w-8 h-8 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                    Configuración de Cookies
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 mb-4">
                    Utilizamos cookies esenciales para el funcionamiento de la web y, con tu consentimiento, 
                    cookies analíticas para mejorar tu experiencia. Puedes aceptar todas, solo las esenciales 
                    o personalizar tu elección.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Aceptar todas
                    </button>
                    <button
                      onClick={acceptEssential}
                      className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold rounded-lg transition-colors"
                    >
                      Solo esenciales
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-3 border-2 border-neutral-300 hover:border-neutral-400 text-neutral-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Configurar
                    </button>
                  </div>

                  <p className="text-xs text-neutral-500 mt-4">
                    Al continuar navegando aceptas nuestra{' '}
                    <Link href="/politica-privacidad" className="text-primary-600 hover:underline">
                      Política de Privacidad
                    </Link>
                    {' '}y{' '}
                    <Link href="/politica-cookies" className="text-primary-600 hover:underline">
                      Política de Cookies
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Vista de configuración detallada
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h3 className="text-xl font-bold text-neutral-900">
                    Configuración de Cookies
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-neutral-600 mb-6">
                Las cookies nos permiten ofrecer nuestros servicios. Al utilizar nuestros servicios, 
                aceptas el uso de cookies. Puedes configurar qué tipos de cookies deseas permitir.
              </p>

              <div className="space-y-4 mb-6">
                {/* Cookies Esenciales */}
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900">
                        Cookies Esenciales
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        Necesarias para el funcionamiento básico del sitio web. No se pueden desactivar.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="px-3 py-1 bg-neutral-200 text-neutral-600 text-sm font-semibold rounded">
                        Siempre activas
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies Analíticas */}
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900">
                        Cookies Analíticas
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        Nos ayudan a entender cómo los visitantes interactúan con el sitio web 
                        recopilando y reportando información de forma anónima.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.analytics}
                          onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cookies de Marketing */}
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900">
                        Cookies de Marketing
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        Se utilizan para rastrear a los visitantes a través de sitios web. 
                        Se usan para mostrar anuncios relevantes y atractivos.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.marketing}
                          onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cookies Funcionales */}
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900">
                        Cookies Funcionales
                      </h4>
                      <p className="text-sm text-neutral-600 mt-1">
                        Permiten proporcionar funcionalidades mejoradas y personalización, 
                        como recordar tus preferencias y configuración.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consent.functional}
                          onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={acceptCustom}
                  className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Guardar preferencias
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold rounded-lg transition-colors"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
