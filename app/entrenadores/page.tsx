'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LocationSearch, LocationData, calculateDistance } from '@/components/LocationSearch'
import { mockCoaches } from '@/lib/mock-data/coaches'
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal } from 'lucide-react'

export default function EntrenadoresPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [maxDistance, setMaxDistance] = useState(50) // km
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Extraer especialidades únicas
  const allSpecialties = mockCoaches.flatMap(c => c.specialties)
  const specialties = ['all', ...Array.from(new Set(allSpecialties))]

  // Filtrar y ordenar entrenadores por distancia
  let filteredCoaches = mockCoaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                             coach.specialties.includes(selectedSpecialty)
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'low' && coach.pricePerHour < 40) ||
                        (priceRange === 'medium' && coach.pricePerHour >= 40 && coach.pricePerHour < 50) ||
                        (priceRange === 'high' && coach.pricePerHour >= 50)
    
    // Filtro por distancia
    let matchesDistance = true
    if (selectedLocation) {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        coach.lat,
        coach.lng
      )
      matchesDistance = distance <= maxDistance
    }
    
    return matchesSearch && matchesSpecialty && matchesPrice && matchesDistance
  })

  // Si hay ubicación seleccionada, ordenar por distancia
  if (selectedLocation) {
    filteredCoaches = filteredCoaches.map(coach => ({
      ...coach,
      distance: calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        coach.lat,
        coach.lng
      )
    })).sort((a, b) => a.distance - b.distance)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Encuentra tu Entrenador de Pádel
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              {mockCoaches.length} entrenadores profesionales esperando para ayudarte a mejorar tu juego
            </p>
            
            {/* Location Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <LocationSearch
                onLocationSelect={setSelectedLocation}
                placeholder="¿Dónde buscas entrenador? (ej: Madrid, Barcelona...)"
              />
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
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{filteredCoaches.length}</span> entrenadores encontrados
            </p>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Distancia Máxima */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Distancia máxima: {maxDistance} km
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                disabled={!selectedLocation}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: selectedLocation 
                    ? `linear-gradient(to right, #22c55e 0%, #22c55e ${(maxDistance - 5) / 95 * 100}%, #e5e7eb ${(maxDistance - 5) / 95 * 100}%, #e5e7eb 100%)`
                    : '#e5e7eb'
                }}
              />
              {!selectedLocation && (
                <p className="text-xs text-neutral-500 mt-1">Selecciona una ubicación primero</p>
              )}
            </div>

            {/* Especialidad */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="all">Todas las especialidades</option>
                {specialties.slice(1).map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            {/* Precio */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="all">Todos los precios</option>
                <option value="low">Menos de 40€/h</option>
                <option value="medium">40€ - 50€/h</option>
                <option value="high">Más de 50€/h</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedLocation(null)
                setMaxDistance(50)
                setSelectedSpecialty('all')
                setPriceRange('all')
              }}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Coaches Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCoaches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-600">No se encontraron entrenadores con esos criterios</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation(null)
                  setMaxDistance(50)
                  setSelectedSpecialty('all')
                  setPriceRange('all')
                }}
                className="mt-4 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
              >
                Ver todos los entrenadores
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCoaches.map((coach) => (
                <Link
                  key={coach.id}
                  href={`/entrenador/${coach.id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={coach.imageUrl}
                      alt={coach.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {coach.isFeatured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        ⭐ DESTACADO
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white rounded-lg shadow-lg">
                      <p className="text-sm font-bold text-primary-600">{coach.pricePerHour}€/h</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {coach.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-neutral-900">{coach.rating}</span>
                      <span className="text-sm text-neutral-500">({coach.reviewsCount})</span>
                    </div>

                    <div className="flex items-center text-sm text-neutral-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{coach.city}</span>
                      {'distance' in coach && typeof coach.distance === 'number' && (
                        <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {coach.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {coach.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {coach.specialties.length > 2 && (
                        <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                          +{coach.specialties.length - 2}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-neutral-500">
                      {coach.experience} años de experiencia
                    </p>
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
