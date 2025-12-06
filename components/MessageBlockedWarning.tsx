'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MessageBlockedWarningProps {
  reason: string
  onClose: () => void
}

export function MessageBlockedWarning({ reason, onClose }: MessageBlockedWarningProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-cerrar después de 8 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Esperar animación
    }, 8000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[10000]
        w-[90%] max-w-md
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          {/* Icono de advertencia */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-red-900 text-sm mb-1">
              ⚠️ Mensaje bloqueado
            </h3>
            <p className="text-red-800 text-sm mb-2">
              {reason}
            </p>
            <div className="bg-red-100 rounded-lg p-3 mb-2">
              <p className="text-xs text-red-900 font-medium">
                🚫 <strong>Política de uso:</strong>
              </p>
              <ul className="text-xs text-red-800 mt-1 space-y-0.5 ml-4">
                <li>• No se permiten compartir datos de contacto externo</li>
                <li>• No se permiten URLs o enlaces externos*</li>
                <li>• No se permite lenguaje inapropiado</li>
              </ul>
              <p className="text-xs text-red-700 mt-1.5 italic">
                *Se permiten: Google Maps y enlaces de Padeliner.com
              </p>
            </div>
            <div className="bg-red-200 rounded-lg p-2.5 mb-2 border border-red-300">
              <p className="text-xs text-red-900 font-bold">
                🔍 <strong>Monitoreo activo:</strong>
              </p>
              <p className="text-xs text-red-800 mt-1">
                Realizamos <strong>estudios periódicos</strong> de todas las conversaciones para detectar intentos de evasión y garantizar el cumplimiento de nuestras políticas.
              </p>
            </div>
            <p className="text-xs text-red-700 font-semibold">
              ⚡ <strong>Advertencia:</strong> El incumplimiento reiterado puede resultar en la <strong>suspensión permanente</strong> de tu cuenta sin previo aviso.
            </p>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
