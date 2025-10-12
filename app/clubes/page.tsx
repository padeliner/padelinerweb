'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LocationSearch, LocationData, calculateDistance } from '@/components/LocationSearch'
import { mockClubs } from '@/lib/mock-data/clubs'
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal, Users } from 'lucide-react'

export default function ClubesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [maxDistance, setMaxDistance] = useState(50)
  const [minCourts, setMinCourts] = useState('all')
  const [minPrice, setMinPrice] = useState(15)
  const [maxPrice, setMaxPrice] = useState(35)
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar y ordenar clubes por distancia
  let filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourts = minCourts === 'all' ||
                          (minCourts === '4' && club.courtsCount >= 4) ||
                          (minCourts === '8' && club.courtsCount >= 8) ||
                          (minCourts === '10' && club.courtsCount >= 10)
    const matchesPrice = club.pricePerHour >= minPrice && club.pricePerHour <= maxPrice
    
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
    
    return matchesSearch && matchesCourts && matchesPrice && matchesDistance
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
              Encuentra tu Club de Pádel
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              {mockClubs.length} clubes con las mejores instalaciones de España
            </p>
            
            {/* Location Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <LocationSearch
                onLocationSelect={setSelectedLocation}
                placeholder="¿Dónde buscas club? (ej: Madrid, Barcelona...)"
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
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
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
                    ? `linear-gradient(to right, #16a34a 0%, #16a34a ${(maxDistance - 5) / 95 * 100}%, #e5e7eb ${(maxDistance - 5) / 95 * 100}%, #e5e7eb 100%)`
                    : '#e5e7eb'
                }}
              />
              {!selectedLocation && (
                <p className="text-xs text-neutral-500 mt-1">Selecciona una ubicación primero</p>
              )}
            </div>

            {/* Número de pistas */}
            <div className="relative">
              <select
                value={minCourts}
                onChange={(e) => setMinCourts(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-green-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="all">Cualquier tamaño</option>
                <option value="4">Mínimo 4 pistas</option>
                <option value="8">Mínimo 8 pistas</option>
                <option value="10">Mínimo 10 pistas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            {/* Rango de Precio */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Precio: {minPrice}€ - {maxPrice}€/h
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-neutral-500 w-12">Min:</span>
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
                    className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(minPrice - 15) / 20 * 100}%, #16a34a ${(minPrice - 15) / 20 * 100}%, #16a34a 100%)`
                    }}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-neutral-500 w-12">Max:</span>
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
                    className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(maxPrice - 15) / 20 * 100}%, #e5e7eb ${(maxPrice - 15) / 20 * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedLocation(null)
                setMaxDistance(50)
                setMinCourts('all')
                setMinPrice(15)
                setMaxPrice(35)
              }}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors"
            >
              Limpiar Filtros
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
                  setMinCourts('all')
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
                      <p className="text-sm font-bold text-green-600">{club.pricePerHour}€/h</p>
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
                      <span>{club.courtsCount} pistas disponibles</span>
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
