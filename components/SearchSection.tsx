'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Users, Dumbbell, Building2, GraduationCap } from 'lucide-react'

type ServiceType = 'entrenadores' | 'clubes' | 'academias'

export function SearchSection() {
  const router = useRouter()
  const [serviceType, setServiceType] = useState<ServiceType>('entrenadores')
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')

  const serviceConfig = {
    entrenadores: {
      icon: <Dumbbell className="w-5 h-5" />,
      label: 'Entrenadores',
      placeholder: 'Buscar por nombre o especialidad',
      color: 'primary',
      filters: ['Cerca de mí', 'Mejor valorados', 'Con desplazamiento', 'Precio bajo'],
    },
    clubes: {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Clubes',
      placeholder: 'Buscar clubes por nombre',
      color: 'green',
      filters: ['Cerca de mí', 'Mejor valorados', 'Infantil', 'Adultos'],
    },
    academias: {
      icon: <GraduationCap className="w-5 h-5" />,
      label: 'Academias',
      placeholder: 'Buscar academias por nombre',
      color: 'blue',
      filters: ['Cerca de mí', 'Mejor valorados', 'Principiantes', 'Competición'],
    },
  }

  const currentService = serviceConfig[serviceType]

  const handleSearch = () => {
    // Redirigir a la página correspondiente con los parámetros de búsqueda
    router.push(`/${serviceType}`)
  }

  return (
    <section className="relative -mt-16 sm:-mt-20 z-30 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4"
        >
          <div className="flex flex-col gap-4">
            {/* Service Type Selector */}
            <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
              {(Object.keys(serviceConfig) as ServiceType[]).map((type) => {
                const service = serviceConfig[type]
                const isActive = serviceType === type
                return (
                  <button
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all
                      ${isActive 
                        ? 'bg-white shadow-md text-neutral-900' 
                        : 'text-neutral-600 hover:text-neutral-900'
                      }
                    `}
                  >
                    {service.icon}
                    <span className="hidden sm:inline">{service.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Search Term */}
              <div className="flex-1 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-neutral-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-neutral-900 mb-1">
                      {currentService.label}
                    </label>
                    <input
                      type="text"
                      placeholder={currentService.placeholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-sm text-neutral-700 placeholder-neutral-400 bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex-1 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-neutral-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-neutral-900 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      placeholder="¿Dónde?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-sm text-neutral-700 placeholder-neutral-400 bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className={`
                w-full flex items-center justify-center space-x-2 px-8 py-4 font-semibold rounded-xl transition-all duration-200 shadow-lg
                ${serviceType === 'entrenadores' ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30' : ''}
                ${serviceType === 'clubes' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : ''}
                ${serviceType === 'academias' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30' : ''}
                text-white
              `}
            >
              <Search className="w-5 h-5" />
              <span>Buscar {currentService.label.toLowerCase()}</span>
            </motion.button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 px-1">
            <div className="flex flex-wrap gap-2">
              {currentService.filters.map((filter) => (
                <FilterChip key={filter} label={filter} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FilterChip({ label }: { label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-700 rounded-full transition-colors"
    >
      {label}
    </motion.button>
  )
}
