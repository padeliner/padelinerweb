'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, Download, Gift } from 'lucide-react'

export function AppDownloadPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verificar si ya se mostró el popup
    const popupShown = localStorage.getItem('appPopupShown')
    if (popupShown) return

    // Mostrar después de 20 segundos
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 20000) // 20 segundos

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Guardar que ya se mostró (válido por 7 días)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)
    localStorage.setItem('appPopupShown', expiryDate.toISOString())
  }

  const handleAppStoreClick = () => {
    // Aquí va el link real de la App Store
    window.open('https://apps.apple.com/app/padeliner', '_blank')
    handleClose()
  }

  const handlePlayStoreClick = () => {
    // Aquí va el link real de Google Play
    window.open('https://play.google.com/store/apps/details?id=com.padeliner', '_blank')
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors z-10"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>

              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Smartphone className="w-8 h-8" />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                    ¡Descarga la App!
                  </h2>
                  <p className="text-primary-100 text-center text-sm md:text-base">
                    Y lleva Padeliner siempre contigo
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Discount Badge */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg">
                    <Gift className="w-5 h-5" />
                    <span className="font-bold text-lg">10% DE DESCUENTO</span>
                  </div>
                </div>

                <p className="text-neutral-600 text-center mb-6">
                  Descarga nuestra app y obtén un <strong className="text-primary-600">10% de descuento</strong> en tu primera reserva. ¡No te lo pierdas!
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  {[
                    'Reserva clases en segundos',
                    'Notificaciones instantáneas',
                    'Acceso offline a tu calendario',
                    'Ofertas exclusivas de la app'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Download className="w-4 h-4 text-primary-600" />
                      </div>
                      <p className="text-sm text-neutral-700">{benefit}</p>
                    </div>
                  ))}
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAppStoreClick}
                    className="w-full bg-black hover:bg-neutral-900 text-white py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-colors group"
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-xs opacity-80">Descargar en</p>
                      <p className="text-base font-semibold">App Store</p>
                    </div>
                  </button>

                  <button
                    onClick={handlePlayStoreClick}
                    className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-colors group"
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-xs opacity-80">Consíguelo en</p>
                      <p className="text-base font-semibold">Google Play</p>
                    </div>
                  </button>
                </div>

                {/* Fine print */}
                <p className="text-xs text-neutral-500 text-center mt-4">
                  *Código de descuento aplicado automáticamente en la app
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
