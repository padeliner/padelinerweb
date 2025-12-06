'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, ChevronDown, X } from 'lucide-react'

interface TimeSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimeSelector({ value, onChange, className = '' }: TimeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generar horas del día (00:00 a 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelectHour = (hour: string) => {
    onChange(hour)
    const delay = isMobile ? 300 : 50
    setTimeout(() => {
      setIsOpen(false)
    }, delay)
  }

  // Ocultar el botón del chatbot cuando el modal está abierto
  useEffect(() => {
    if (isOpen && isMobile) {
      const chatButton = document.querySelector('button[aria-label="Abrir chat"]') as HTMLElement
      if (chatButton) {
        chatButton.style.display = 'none'
      }
      
      return () => {
        const chatBtn = document.querySelector('button[aria-label="Abrir chat"]') as HTMLElement
        if (chatBtn) {
          chatBtn.style.display = 'flex'
        }
      }
    }
  }, [isOpen, isMobile])

  const getDisplayValue = () => {
    return value === 'all' ? 'Cualquier hora' : value
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 z-10 pointer-events-none" />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left appearance-none pl-10 pr-10 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white cursor-pointer text-neutral-900 transition-colors ${className}`}
          style={{ fontSize: '16px' }}
        >
          {getDisplayValue()}
        </button>
        
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />

        {/* Dropdown Desktop */}
        {isOpen && !isMobile && (
          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-neutral-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSelectHour('all')
              }}
              className={`w-full text-left px-4 py-3 transition-colors ${value === 'all' ? 'font-semibold' : 'hover:bg-neutral-50'}`}
              style={{
                backgroundColor: value === 'all' ? 'var(--datepicker-primary)' : undefined,
                color: value === 'all' ? 'white' : undefined
              }}
            >
              Cualquier hora
            </button>
            {hours.map(hour => (
              <button
                key={hour}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelectHour(hour)
                }}
                className={`w-full text-left px-4 py-3 transition-colors border-t border-neutral-100 ${value === hour ? 'font-semibold' : 'hover:bg-neutral-50'}`}
                style={{
                  backgroundColor: value === hour ? 'var(--datepicker-primary)' : undefined,
                  color: value === hour ? 'white' : 'inherit'
                }}
              >
                {hour}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-[10001] bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => {
            // Solo cerrar si se hace click en el overlay, no en el contenido
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div 
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" style={{ color: 'var(--datepicker-primary)' }} />
                <h3 className="text-lg font-semibold text-neutral-900">Seleccionar hora</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Botón "Cualquier hora" */}
            <div className="p-4 border-b border-neutral-200">
              <button
                type="button"
                onTouchEnd={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelectHour('all')
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelectHour('all')
                }}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all touch-manipulation ${
                  value === 'all' 
                    ? 'text-white shadow-lg' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                style={{ 
                  touchAction: 'manipulation', 
                  WebkitTapHighlightColor: 'transparent',
                  backgroundColor: value === 'all' ? 'var(--datepicker-primary)' : undefined
                }}
              >
                Cualquier hora
              </button>
            </div>

            {/* Grid de horas */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-2">
                {hours.map(hour => (
                  <button
                    key={hour}
                    type="button"
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelectHour(hour)
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelectHour(hour)
                    }}
                    className={`py-3 px-2 rounded-xl font-medium text-sm transition-all touch-manipulation ${
                      value === hour 
                        ? 'text-white shadow-lg scale-105' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:scale-95'
                    }`}
                    style={{ 
                      fontSize: '16px', 
                      touchAction: 'manipulation', 
                      WebkitTapHighlightColor: 'transparent',
                      backgroundColor: value === hour ? 'var(--datepicker-primary)' : undefined
                    }}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
