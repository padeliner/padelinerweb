'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Dumbbell, Building2, GraduationCap } from 'lucide-react'
import { LocationSearch, LocationData } from '@/components/LocationSearch'

type ServiceType = 'entrenadores' | 'clubes' | 'academias'

export function SearchSection() {
  const router = useRouter()
  const [serviceType, setServiceType] = useState<ServiceType>('entrenadores')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [maxDistance, setMaxDistance] = useState(50)
  
  // Filtros para Entrenadores
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [showOnlyWithHomeService, setShowOnlyWithHomeService] = useState(false)
  const [trainerPriceRange, setTrainerPriceRange] = useState({ min: 25, max: 75 })
  
  // Filtros para Clubes
  const [selectedClassType, setSelectedClassType] = useState('all')
  const [clubPriceRange, setClubPriceRange] = useState({ min: 15, max: 35 })
  
  // Filtros para Academias
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [selectedAgeRange, setSelectedAgeRange] = useState('all')
  const [academyPriceRange, setAcademyPriceRange] = useState({ min: 60, max: 200 })

  // Datos de filtros
  const specialties = ['all', 'Infantil', 'Junior', 'Adultos', 'Senior', 'Iniciación', 'Competición']
  const classTypes = ['all', 'Infantil (4-12 años)', 'Junior (13-17 años)', 'Adultos (18-55 años)', 'Senior (+55 años)', 'Iniciación', 'Avanzado']
  const programs = ['all', 'Iniciación', 'Perfeccionamiento', 'Competición', 'Alto Rendimiento']
  const ageRanges = ['all', '4-8 años', '9-12 años', '13-17 años', 'Adultos']

  const serviceConfig = {
    entrenadores: {
      icon: <Dumbbell className="w-5 h-5" />,
      label: 'Entrenadores',
      color: 'primary',
    },
    clubes: {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Clubes',
      color: 'green',
    },
    academias: {
      icon: <GraduationCap className="w-5 h-5" />,
      label: 'Academias',
      color: 'blue',
    },
  }

  const currentService = serviceConfig[serviceType]

  const handleSearch = () => {
    router.push(`/${serviceType}`)
  }

  return (
    <section className="relative -mt-16 sm:-mt-20 z-30 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6"
        >
          {/* Service Type Selector */}
          <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl mb-6">
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

          {/* Location Search */}
          <div className="mb-4">
            <LocationSearch
              onLocationSelect={setSelectedLocation}
              placeholder="Buscar ubicación..."
              value={selectedLocation?.formatted}
            />
            {selectedLocation && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Distancia máxima: <span className="text-primary-600 font-semibold">{maxDistance} km</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Filtros específicos por servicio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* ENTRENADORES */}
            {serviceType === 'entrenadores' && (
              <>
                {/* Público Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Público objetivo
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white"
                    >
                      <option value="all">Todos los públicos</option>
                      {specialties.slice(1).map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Desplazamiento */}
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer p-2.5 bg-neutral-50 rounded-lg w-full">
                    <input
                      type="checkbox"
                      checked={showOnlyWithHomeService}
                      onChange={(e) => setShowOnlyWithHomeService(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-neutral-700">Con desplazamiento</span>
                  </label>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio: <span className="text-primary-600 font-semibold">{trainerPriceRange.min}€ - {trainerPriceRange.max}€/h</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="25"
                      max="75"
                      step="5"
                      value={trainerPriceRange.min}
                      onChange={(e) => setTrainerPriceRange({ ...trainerPriceRange, min: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="25"
                      max="75"
                      step="5"
                      value={trainerPriceRange.max}
                      onChange={(e) => setTrainerPriceRange({ ...trainerPriceRange, max: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* CLUBES */}
            {serviceType === 'clubes' && (
              <>
                {/* Público Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Público objetivo
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClassType}
                      onChange={(e) => setSelectedClassType(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
                    >
                      <option value="all">Todos los públicos</option>
                      {classTypes.slice(1).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Precio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio: <span className="text-green-600 font-semibold">{clubPriceRange.min}€ - {clubPriceRange.max}€/clase</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="15"
                      max="35"
                      step="2"
                      value={clubPriceRange.min}
                      onChange={(e) => setClubPriceRange({ ...clubPriceRange, min: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="15"
                      max="35"
                      step="2"
                      value={clubPriceRange.max}
                      onChange={(e) => setClubPriceRange({ ...clubPriceRange, max: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ACADEMIAS */}
            {serviceType === 'academias' && (
              <>
                {/* Tipo de Programa */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tipo de programa
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="all">Todos los programas</option>
                      {programs.slice(1).map(prog => (
                        <option key={prog} value={prog}>{prog}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Edad */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Edad
                  </label>
                  <div className="relative">
                    <select
                      value={selectedAgeRange}
                      onChange={(e) => setSelectedAgeRange(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="all">Todas las edades</option>
                      {ageRanges.slice(1).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio: <span className="text-blue-600 font-semibold">{academyPriceRange.min}€ - {academyPriceRange.max}€/mes</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="60"
                      max="200"
                      step="10"
                      value={academyPriceRange.min}
                      onChange={(e) => setAcademyPriceRange({ ...academyPriceRange, min: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="60"
                      max="200"
                      step="10"
                      value={academyPriceRange.max}
                      onChange={(e) => setAcademyPriceRange({ ...academyPriceRange, max: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
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
        </motion.div>
      </div>
    </section>
  )
}

