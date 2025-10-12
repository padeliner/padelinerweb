'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LocationSearch, LocationData, calculateDistance } from '@/components/LocationSearch'
import { mockAcademies } from '@/lib/mock-data/academies'
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal, GraduationCap, Users } from 'lucide-react'

function AcademiasContent() {
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [maxDistance, setMaxDistance] = useState(50)
  const [selectedProgram, setSelectedProgram] = useState('all')
  const [minPrice, setMinPrice] = useState(80)
  const [maxPrice, setMaxPrice] = useState(150)
  const [showFilters, setShowFilters] = useState(false)

  // Leer parámetros de la URL al cargar
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get('search')
      const lat = searchParams.get('lat')
      const lng = searchParams.get('lng')
      const location = searchParams.get('location')
      const distance = searchParams.get('distance')
      const program = searchParams.get('program')
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
      if (program) setSelectedProgram(program)
      if (minPriceParam) setMinPrice(parseInt(minPriceParam))
      if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam))
    }
  }, [searchParams])
  
  // Categorías de programas por público objetivo
  const programs = ['all', 'Infantil', 'Junior', 'Adultos', 'Senior', 'Iniciación', 'Competición']

  // Filtrar y ordenar academias por distancia
  let filteredAcademies = mockAcademies.filter(academy => {
    const matchesSearch = academy.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProgram = selectedProgram === 'all' || 
                           academy.programs.some(program => 
                             program.toLowerCase().includes(selectedProgram.toLowerCase())
                           )
    
    const matchesPrice = academy.pricePerMonth >= minPrice && academy.pricePerMonth <= maxPrice
    
    let matchesDistance = true
    if (selectedLocation) {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        academy.lat,
        academy.lng
      )
      matchesDistance = distance <= maxDistance
    }
    
    return matchesSearch && matchesProgram && matchesPrice && matchesDistance
  })

  // Si hay ubicación seleccionada, ordenar por distancia
  if (selectedLocation) {
    filteredAcademies = filteredAcademies.map(academy => ({
      ...academy,
      distance: calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        academy.lat,
        academy.lng
      )
    })).sort((a, b) => a.distance - b.distance)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Encuentra tu Academia de Pádel
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {mockAcademies.length} academias profesionales con programas para todos los niveles
            </p>
            
            {/* Location Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <LocationSearch
                onLocationSelect={setSelectedLocation}
                placeholder="¿Dónde buscas academia? (ej: Madrid, Barcelona...)"
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
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{filteredAcademies.length}</span> academias encontradas
            </p>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold"
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
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-neutral-900 transition-colors"
                >
                  <option value="all">Todos los públicos</option>
                  {programs.slice(1).map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Rango de Precio */}
            <div className="w-full md:flex-1 md:min-w-0">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Precio: <span className="text-blue-600 font-semibold">{minPrice}€ - {maxPrice}€/mes</span>
              </label>
              <div className="flex items-center h-[42px]">
                <div className="relative w-full">
                  <div className="relative h-2 bg-neutral-200 rounded-lg">
                    <div 
                      className="absolute h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
                      style={{
                        left: `${(minPrice - 80) / 70 * 100}%`,
                        right: `${100 - (maxPrice - 80) / 70 * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="80"
                      max="150"
                      step="10"
                      value={minPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (value <= maxPrice) setMinPrice(value)
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      style={{ zIndex: minPrice > maxPrice - 10 ? 5 : 3 }}
                    />
                    <input
                      type="range"
                      min="80"
                      max="150"
                      step="10"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (value >= minPrice) setMaxPrice(value)
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Limpiar */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedLocation(null)
                setMaxDistance(50)
                setSelectedProgram('all')
                setMinPrice(80)
                setMaxPrice(150)
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAcademies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600">No se encontraron academias con esos criterios</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation(null)
                  setMaxDistance(50)
                  setSelectedProgram('all')
                  setMinPrice(80)
                  setMaxPrice(150)
                }}
                className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
              >
                Ver todas las academias
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAcademies.map((academy) => (
                <Link
                  key={academy.id}
                  href={`/academia/${academy.id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={academy.imageUrl}
                      alt={academy.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {academy.isFeatured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        ⭐ DESTACADA
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white rounded-lg shadow-lg">
                      <p className="text-sm font-bold text-blue-600">{academy.pricePerMonth}€/mes</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {academy.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-neutral-900">{academy.rating}</span>
                      <span className="text-sm text-neutral-500">({academy.reviewsCount})</span>
                    </div>

                    <div className="flex items-center text-sm text-neutral-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{academy.city}</span>
                      {'distance' in academy && typeof academy.distance === 'number' && (
                        <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {academy.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-neutral-600 mb-3">
                      <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{academy.coachesCount} entrenadores</span>
                      <span className="mx-2">•</span>
                      <GraduationCap className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{academy.studentCapacity} plazas</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {academy.programs.slice(0, 2).map((program, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {program}
                        </span>
                      ))}
                      {academy.programs.length > 2 && (
                        <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                          +{academy.programs.length - 2}
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

export default function AcademiasPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AcademiasContent />
    </Suspense>
  )
}
