'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { mockAcademies } from '@/lib/mock-data/academies'
import { Search, MapPin, Star, ChevronDown, SlidersHorizontal, GraduationCap, Users } from 'lucide-react'

export default function AcademiasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const cities = ['all', ...Array.from(new Set(mockAcademies.map(a => a.city)))]

  const filteredAcademies = mockAcademies.filter(academy => {
    const matchesSearch = academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         academy.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity === 'all' || academy.city === selectedCity
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'low' && academy.pricePerMonth < 100) ||
                        (priceRange === 'medium' && academy.pricePerMonth >= 100 && academy.pricePerMonth < 130) ||
                        (priceRange === 'high' && academy.pricePerMonth >= 130)
    
    return matchesSearch && matchesCity && matchesPrice
  })

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
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ciudad..."
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-0">
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

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="all">Todas las ciudades</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="all">Todos los precios</option>
                <option value="low">Menos de 100€/mes</option>
                <option value="medium">100€ - 130€/mes</option>
                <option value="high">Más de 130€/mes</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCity('all')
                setPriceRange('all')
              }}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors"
            >
              Limpiar Filtros
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
                  setSelectedCity('all')
                  setPriceRange('all')
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
