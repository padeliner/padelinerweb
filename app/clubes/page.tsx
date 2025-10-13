'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LocationSearch, LocationData, calculateDistance } from '@/components/LocationSearch'
import { mockClubs } from '@/lib/mock-data/clubs'
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal, Users, Calendar } from 'lucide-react'
import { TimeSelector } from '@/components/TimeSelector'
import DatePicker, { registerLocale } from 'react-datepicker'
import { es } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import '../datepicker-custom.css'

// Registrar locale español con lunes como primer día
registerLocale('es', es)

function ClubesContent() {
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [maxDistance, setMaxDistance] = useState(50)
  const [selectedClassType, setSelectedClassType] = useState('all')
  const [minPrice, setMinPrice] = useState(15)
  const [maxPrice, setMaxPrice] = useState(35)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState('all')
  const [isMobile, setIsMobile] = useState(false)

  // Configurar colores del calendario (verde)
  useEffect(() => {
    document.documentElement.style.setProperty('--datepicker-primary', '#16a34a')
    document.documentElement.style.setProperty('--datepicker-primary-dark', '#15803d')
  }, [])

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Leer parámetros de la URL al cargar
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get('search')
      const lat = searchParams.get('lat')
      const lng = searchParams.get('lng')
      const location = searchParams.get('location')
      const distance = searchParams.get('distance')
      const classType = searchParams.get('classType')
      const minPriceParam = searchParams.get('minPrice')
      const maxPriceParam = searchParams.get('maxPrice')

      if (search) setSearchTerm(search)
      if (lat && lng && location) {
        setSelectedLocation({
          address: location,
          city: location,
          country: '',
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          formatted: location
        })
      }
      if (distance) setMaxDistance(parseInt(distance))
      if (classType) setSelectedClassType(classType)
      if (minPriceParam) setMinPrice(parseInt(minPriceParam))
      if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam))
    }
  }, [searchParams])
  
  // Tipos de clases por público objetivo
  const classTypes = ['all', 'Infantil', 'Junior', 'Adultos', 'Senior', 'Iniciación', 'Competición']

  // Filtrar y ordenar clubes por distancia
  let filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClassType = selectedClassType === 'all' || 
                             club.classTypes.some(type => 
                               type.toLowerCase().includes(selectedClassType.toLowerCase())
                             )
    
    const matchesPrice = club.pricePerClass >= minPrice && club.pricePerClass <= maxPrice
    
    let matchesDistance = true
    if (selectedLocation) {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        club.lat,
        club.lng
      )
      matchesDistance = distance <= maxDistance
    }
    
    return matchesSearch && matchesClassType && matchesPrice && matchesDistance
  })

  // Si hay ubicación seleccionada, ordenar por distancia
  if (selectedLocation) {
    filteredClubs = filteredClubs.map(club => ({
      ...club,
      distance: calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        club.lat,
        club.lng
      )
    })).sort((a, b) => a.distance - b.distance)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Encuentra tu Club para Clases de Pádel
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              {mockClubs.length} clubes con instructores profesionales para todos los niveles
            </p>
            
            {/* Location Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <LocationSearch
                onLocationSelect={setSelectedLocation}
                placeholder="¿Dónde quieres tomar clases? (ej: Madrid, Barcelona...)"
              />
              
              {/* Filtro de Distancia - Solo visible cuando hay ubicación */}
              {selectedLocation && (
                <>
                  <p className="text-sm text-white/90 mb-2 mt-4">
                    Distancia máxima: <span className="font-semibold">{maxDistance} km</span>
                  </p>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                    style={{
                      background: `linear-gradient(to right, #fff 0%, #fff ${(maxDistance - 5) / 95 * 100}%, rgba(255,255,255,0.2) ${(maxDistance - 5) / 95 * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </>
              )}
            </div>

            {/* Search by Name */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-green-300 focus:outline-none transition-colors text-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{filteredClubs.length}</span> clubes encontrados
            </p>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters Grid */}
          <div className={`${showFilters ? 'flex' : 'hidden md:flex'} flex-col md:flex-row gap-4 md:items-end`}>
            {/* Público Objetivo */}
            <div className="w-full md:flex-1 md:min-w-0">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Público objetivo
              </label>
              <div className="relative">
                <select
                  value={selectedClassType}
                  onChange={(e) => setSelectedClassType(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-green-500 focus:outline-none bg-white text-neutral-900 transition-colors"
                >
                  <option value="all">Todos los públicos</option>
                  {classTypes.slice(1).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Rango de Precio */}
            <div className="w-full md:flex-1 md:min-w-0">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Precio: <span className="text-green-600 font-semibold">{minPrice}€ - {maxPrice}€/clase</span>
              </label>
              <div className="flex items-center h-[42px]">
                <div className="relative w-full">
                  <div className="relative h-2 bg-neutral-200 rounded-lg">
                    <div 
                      className="absolute h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg"
                      style={{
                        left: `${(minPrice - 15) / 20 * 100}%`,
                        right: `${100 - (maxPrice - 15) / 20 * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="15"
                      max="35"
                      step="2"
                      value={minPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (value <= maxPrice) setMinPrice(value)
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      style={{ zIndex: minPrice > maxPrice - 5 ? 5 : 3 }}
                    />
                    <input
                      type="range"
                      min="15"
                      max="35"
                      step="2"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (value >= minPrice) setMaxPrice(value)
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fecha (Calendario) */}
            <div className="w-full md:flex-1 md:min-w-0">
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
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white cursor-pointer"
                  calendarClassName="shadow-xl"
                  locale="es"
                  calendarStartDay={1}
                  isClearable
                  withPortal={isMobile}
                  portalId="date-picker-portal"
                />
              </div>
            </div>

            {/* Hora */}
            <div className="w-full md:flex-1 md:min-w-0">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Hora
              </label>
              <TimeSelector
                value={selectedHour}
                onChange={setSelectedHour}
              />
            </div>

            {/* Botón Limpiar */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedLocation(null)
                setMaxDistance(50)
                setSelectedClassType('all')
                setMinPrice(15)
                setMaxPrice(35)
                setSelectedDate(null)
                setSelectedHour('all')
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredClubs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600">No se encontraron clubes con esos criterios</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation(null)
                  setMaxDistance(50)
                  setSelectedClassType('all')
                  setMinPrice(15)
                  setMaxPrice(35)
                }}
                className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                Ver todos los clubes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/club/${club.id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={club.imageUrl}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {club.isFeatured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        ⭐ DESTACADO
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white rounded-lg shadow-lg">
                      <p className="text-sm font-bold text-green-600">{club.pricePerClass}€/clase</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-green-600 transition-colors">
                      {club.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-neutral-900">{club.rating}</span>
                      <span className="text-sm text-neutral-500">({club.reviewsCount})</span>
                    </div>

                    <div className="flex items-center text-sm text-neutral-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{club.city}</span>
                      {'distance' in club && typeof club.distance === 'number' && (
                        <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {club.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-neutral-600 mb-3">
                      <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{club.instructorsCount} instructores profesionales</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {club.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {club.amenities.length > 3 && (
                        <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                          +{club.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ClubesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClubesContent />
    </Suspense>
  )
}
