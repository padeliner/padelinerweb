'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Dumbbell, Building2, GraduationCap, Calendar } from 'lucide-react'
import { LocationSearch, LocationData } from '@/components/LocationSearch'
import { TimeSelector } from '@/components/TimeSelector'
import DatePicker, { registerLocale } from 'react-datepicker'
import { es } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import '../app/datepicker-custom.css'

// Registrar locale español con lunes como primer día
registerLocale('es', es)

type ServiceType = 'entrenadores' | 'clubes' | 'academias'

export function SearchSection() {
  const router = useRouter()
  const [serviceType, setServiceType] = useState<ServiceType>('entrenadores')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [maxDistance, setMaxDistance] = useState(50)
  const [isMobile, setIsMobile] = useState(false)

  // Configurar colores del calendario según el tipo de servicio
  useEffect(() => {
    const colors = {
      entrenadores: { primary: '#16a34a', dark: '#15803d' },
      academias: { primary: '#2563eb', dark: '#1d4ed8' },
      clubes: { primary: '#16a34a', dark: '#15803d' }
    }
    
    const color = colors[serviceType]
    document.documentElement.style.setProperty('--datepicker-primary', color.primary)
    document.documentElement.style.setProperty('--datepicker-primary-dark', color.dark)
  }, [serviceType])

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Campo de búsqueda por nombre
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filtros para Entrenadores
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [showOnlyWithHomeService, setShowOnlyWithHomeService] = useState(false)
  const [trainerMinPrice, setTrainerMinPrice] = useState(25)
  const [trainerMaxPrice, setTrainerMaxPrice] = useState(75)
  
  // Filtros para Clubes
  const [selectedClassType, setSelectedClassType] = useState('all')
  const [clubMinPrice, setClubMinPrice] = useState(15)
  const [clubMaxPrice, setClubMaxPrice] = useState(35)
  
  // Filtros para Academias
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [academyMinPrice, setAcademyMinPrice] = useState(80)
  const [academyMaxPrice, setAcademyMaxPrice] = useState(150)

  // Filtros de día y hora (comunes para todos)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState('all')

  // Datos de filtros
  const specialties = ['all', 'Infantil', 'Junior', 'Adultos', 'Senior', 'Iniciación', 'Competición']
  const classTypes = ['all', 'Infantil (4-12 años)', 'Junior (13-17 años)', 'Adultos (18-55 años)', 'Senior (+55 años)', 'Iniciación', 'Avanzado']
  const programs = ['all', 'Infantil', 'Junior', 'Adultos', 'Senior', 'Iniciación', 'Competición']

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
    // Construir URL con parámetros de búsqueda
    const params = new URLSearchParams()
    
    // Parámetros comunes
    if (searchTerm) params.append('search', searchTerm)
    
    if (selectedLocation) {
      params.append('lat', selectedLocation.lat.toString())
      params.append('lng', selectedLocation.lng.toString())
      params.append('location', selectedLocation.formatted)
      params.append('distance', maxDistance.toString())
    }

    // Filtros de día y hora
    if (selectedDate) {
      params.append('date', selectedDate.toISOString())
    }
    if (selectedHour !== 'all') {
      params.append('hour', selectedHour)
    }
    
    // Parámetros específicos por servicio
    if (serviceType === 'entrenadores') {
      if (selectedSpecialty !== 'all') params.append('specialty', selectedSpecialty)
      if (showOnlyWithHomeService) params.append('homeService', 'true')
      params.append('minPrice', trainerMinPrice.toString())
      params.append('maxPrice', trainerMaxPrice.toString())
    } else if (serviceType === 'clubes') {
      if (selectedClassType !== 'all') params.append('classType', selectedClassType)
      params.append('minPrice', clubMinPrice.toString())
      params.append('maxPrice', clubMaxPrice.toString())
    } else if (serviceType === 'academias') {
      if (selectedProgram !== 'all') params.append('program', selectedProgram)
      params.append('minPrice', academyMinPrice.toString())
      params.append('maxPrice', academyMaxPrice.toString())
    }
    
    const queryString = params.toString()
    router.push(`/${serviceType}${queryString ? '?' + queryString : ''}`)
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
                  aria-label={`Buscar ${service.label}`}
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
                  <span className="sm:hidden sr-only">{service.label}</span>
                </button>
              )
            })}
          </div>

          {/* Búsqueda por nombre y ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Campo de búsqueda por nombre */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder={`Buscar ${serviceType === 'entrenadores' ? 'entrenador' : serviceType === 'clubes' ? 'club' : 'academia'} por nombre...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location Search */}
            <div>
              <LocationSearch
                onLocationSelect={setSelectedLocation}
                placeholder="Buscar ubicación..."
                value={selectedLocation?.formatted}
              />
            </div>
          </div>

          {/* Distancia máxima */}
          {selectedLocation && (
            <div className="mb-4">
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
                      aria-label="Seleccionar público objetivo"
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

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio: <span className="text-primary-600 font-semibold">{trainerMinPrice}€ - {trainerMaxPrice}€/h</span>
                  </label>
                  <div className="flex items-center h-[42px]">
                    <div className="relative w-full">
                      <div className="relative h-2 bg-neutral-200 rounded-lg">
                        <div 
                          className="absolute h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg"
                          style={{
                            left: `${(trainerMinPrice - 25) / 50 * 100}%`,
                            right: `${100 - (trainerMaxPrice - 25) / 50 * 100}%`
                          }}
                        />
                        <input
                          type="range"
                          min="25"
                          max="75"
                          step="5"
                          value={trainerMinPrice}
                          onChange={(e) => setTrainerMinPrice(parseInt(e.target.value))}
                          aria-label="Precio mínimo"
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-auto"
                          style={{ zIndex: 3 }}
                        />
                        <input
                          type="range"
                          min="25"
                          max="75"
                          step="5"
                          value={trainerMaxPrice}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (value >= trainerMinPrice) setTrainerMaxPrice(value)
                          }}
                          aria-label="Precio máximo"
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                          style={{ zIndex: 4 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desplazamiento */}
                <div className="md:ml-4">
                  <label className="hidden md:block text-sm font-medium text-neutral-700 mb-2 opacity-0 pointer-events-none">
                    &nbsp;
                  </label>
                  <div className="flex items-center md:h-[42px]">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnlyWithHomeService}
                        onChange={(e) => setShowOnlyWithHomeService(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-neutral-700">Con desplazamiento</span>
                    </label>
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
                    Precio: <span className="text-green-600 font-semibold">{clubMinPrice}€ - {clubMaxPrice}€/clase</span>
                  </label>
                  <div className="flex items-center h-[42px]">
                    <div className="relative w-full">
                      <div className="relative h-2 bg-neutral-200 rounded-lg">
                        <div 
                          className="absolute h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg"
                          style={{
                            left: `${(clubMinPrice - 15) / 20 * 100}%`,
                            right: `${100 - (clubMaxPrice - 15) / 20 * 100}%`
                          }}
                        />
                        <input
                          type="range"
                          min="15"
                          max="35"
                          step="2"
                          value={clubMinPrice}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (value <= clubMaxPrice) setClubMinPrice(value)
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                          style={{ zIndex: clubMinPrice > clubMaxPrice - 5 ? 5 : 3 }}
                        />
                        <input
                          type="range"
                          min="15"
                          max="35"
                          step="2"
                          value={clubMaxPrice}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (value >= clubMinPrice) setClubMaxPrice(value)
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                          style={{ zIndex: 4 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ACADEMIAS */}
            {serviceType === 'academias' && (
              <>
                {/* Público Objetivo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Público objetivo
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="all">Todos los públicos</option>
                      {programs.slice(1).map(prog => (
                        <option key={prog} value={prog}>{prog}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Precio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio: <span className="text-blue-600 font-semibold">{academyMinPrice}€ - {academyMaxPrice}€/mes</span>
                  </label>
                  <div className="flex items-center h-[42px]">
                    <div className="relative w-full">
                      <div className="relative h-2 bg-neutral-200 rounded-lg">
                        <div 
                          className="absolute h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
                          style={{
                            left: `${(academyMinPrice - 60) / 140 * 100}%`,
                            right: `${100 - (academyMaxPrice - 60) / 140 * 100}%`
                          }}
                        />
                        <input
                          type="range"
                          min="60"
                          max="200"
                          step="10"
                          value={academyMinPrice}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (value <= academyMaxPrice) setAcademyMinPrice(value)
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                          style={{ zIndex: academyMinPrice > academyMaxPrice - 20 ? 5 : 3 }}
                        />
                        <input
                          type="range"
                          min="60"
                          max="200"
                          step="10"
                          value={academyMaxPrice}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (value >= academyMinPrice) setAcademyMaxPrice(value)
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                          style={{ zIndex: 4 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Filtros de Día y Hora (comunes para todos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Fecha (Calendario) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 z-10 pointer-events-none" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona una fecha"
                  minDate={new Date()}
                  locale="es"
                  calendarStartDay={1}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white cursor-pointer"
                  calendarClassName="shadow-xl"
                  isClearable
                  withPortal={isMobile}
                  portalId="date-picker-portal"
                />
              </div>
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Hora
              </label>
              <TimeSelector
                value={selectedHour}
                onChange={setSelectedHour}
              />
            </div>
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            aria-label={`Buscar ${currentService.label}`}
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

