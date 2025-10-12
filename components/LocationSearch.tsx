'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Locate, X } from 'lucide-react'

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void
  placeholder?: string
  value?: string
}

export interface LocationData {
  address: string
  city: string
  country: string
  lat: number
  lng: number
  formatted: string
}

export function LocationSearch({ onLocationSelect, placeholder = 'Buscar ubicación...', value }: LocationSearchProps) {
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Simular Google Places Autocomplete
  // En producción, aquí usarías: Google Places Autocomplete API
  const searchLocations = (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    // Base de datos de ubicaciones comunes en España
    const locations = [
      // Ciudades principales
      { address: 'Madrid', city: 'Madrid', country: 'España', lat: 40.4168, lng: -3.7038, formatted: 'Madrid, España' },
      { address: 'Barcelona', city: 'Barcelona', country: 'España', lat: 41.3851, lng: 2.1734, formatted: 'Barcelona, España' },
      { address: 'Valencia', city: 'Valencia', country: 'España', lat: 39.4699, lng: -0.3763, formatted: 'Valencia, España' },
      { address: 'Sevilla', city: 'Sevilla', country: 'España', lat: 37.3891, lng: -5.9845, formatted: 'Sevilla, España' },
      { address: 'Málaga', city: 'Málaga', country: 'España', lat: 36.7213, lng: -4.4214, formatted: 'Málaga, España' },
      { address: 'Zaragoza', city: 'Zaragoza', country: 'España', lat: 41.6488, lng: -0.8891, formatted: 'Zaragoza, España' },
      { address: 'Bilbao', city: 'Bilbao', country: 'España', lat: 43.2627, lng: -2.9253, formatted: 'Bilbao, España' },
      { address: 'Alicante', city: 'Alicante', country: 'España', lat: 38.3452, lng: -0.4810, formatted: 'Alicante, España' },
      { address: 'Murcia', city: 'Murcia', country: 'España', lat: 37.9922, lng: -1.1307, formatted: 'Murcia, España' },
      { address: 'Palma de Mallorca', city: 'Palma', country: 'España', lat: 39.5696, lng: 2.6502, formatted: 'Palma de Mallorca, España' },
      { address: 'Las Palmas', city: 'Las Palmas', country: 'España', lat: 28.1248, lng: -15.4300, formatted: 'Las Palmas de Gran Canaria, España' },
      { address: 'Valladolid', city: 'Valladolid', country: 'España', lat: 41.6523, lng: -4.7245, formatted: 'Valladolid, España' },
      { address: 'Córdoba', city: 'Córdoba', country: 'España', lat: 37.8882, lng: -4.7794, formatted: 'Córdoba, España' },
      { address: 'Vigo', city: 'Vigo', country: 'España', lat: 42.2406, lng: -8.7207, formatted: 'Vigo, España' },
      { address: 'Gijón', city: 'Gijón', country: 'España', lat: 43.5322, lng: -5.6611, formatted: 'Gijón, España' },
      { address: 'Granada', city: 'Granada', country: 'España', lat: 37.1773, lng: -3.5986, formatted: 'Granada, España' },
      { address: 'San Sebastián', city: 'San Sebastián', country: 'España', lat: 43.3183, lng: -1.9812, formatted: 'San Sebastián, España' },
      { address: 'Marbella', city: 'Marbella', country: 'España', lat: 36.5101, lng: -4.8824, formatted: 'Marbella, Málaga, España' },
      
      // Barrios de Madrid
      { address: 'Chamartín', city: 'Madrid', country: 'España', lat: 40.4653, lng: -3.6794, formatted: 'Chamartín, Madrid, España' },
      { address: 'Salamanca', city: 'Madrid', country: 'España', lat: 40.4308, lng: -3.6777, formatted: 'Salamanca, Madrid, España' },
      { address: 'Retiro', city: 'Madrid', country: 'España', lat: 40.4123, lng: -3.6839, formatted: 'Retiro, Madrid, España' },
      
      // Barrios de Barcelona
      { address: 'Eixample', city: 'Barcelona', country: 'España', lat: 41.3904, lng: 2.1637, formatted: 'Eixample, Barcelona, España' },
      { address: 'Gràcia', city: 'Barcelona', country: 'España', lat: 41.4036, lng: 2.1585, formatted: 'Gràcia, Barcelona, España' },
      
      // Otros países
      { address: 'Lisboa', city: 'Lisboa', country: 'Portugal', lat: 38.7223, lng: -9.1393, formatted: 'Lisboa, Portugal' },
      { address: 'Porto', city: 'Porto', country: 'Portugal', lat: 41.1579, lng: -8.6291, formatted: 'Porto, Portugal' },
      { address: 'París', city: 'París', country: 'Francia', lat: 48.8566, lng: 2.3522, formatted: 'París, Francia' },
      { address: 'Londres', city: 'Londres', country: 'Reino Unido', lat: 51.5074, lng: -0.1278, formatted: 'Londres, Reino Unido' },
    ]

    const filtered = locations.filter(loc =>
      loc.formatted.toLowerCase().includes(query.toLowerCase()) ||
      loc.city.toLowerCase().includes(query.toLowerCase()) ||
      loc.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)

    setSuggestions(filtered)
    setShowSuggestions(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    searchLocations(value)
  }

  const handleSuggestionClick = (location: LocationData) => {
    setInputValue(location.formatted)
    setSuggestions([])
    setShowSuggestions(false)
    onLocationSelect(location)
  }

  const handleClear = () => {
    setInputValue('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          
          // Simular reverse geocoding
          // En producción usarías: Google Geocoding API
          const nearestCity = findNearestCity(latitude, longitude)
          
          setInputValue(nearestCity.formatted)
          onLocationSelect(nearestCity)
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
          alert('No se pudo obtener tu ubicación. Por favor, activa la ubicación en tu navegador.')
          setIsLoadingLocation(false)
        }
      )
    } else {
      alert('Tu navegador no soporta geolocalización')
      setIsLoadingLocation(false)
    }
  }

  const findNearestCity = (lat: number, lng: number): LocationData => {
    // Lista simplificada de ciudades con coordenadas
    const cities = [
      { address: 'Madrid', city: 'Madrid', country: 'España', lat: 40.4168, lng: -3.7038, formatted: 'Madrid, España' },
      { address: 'Barcelona', city: 'Barcelona', country: 'España', lat: 41.3851, lng: 2.1734, formatted: 'Barcelona, España' },
      { address: 'Valencia', city: 'Valencia', country: 'España', lat: 39.4699, lng: -0.3763, formatted: 'Valencia, España' },
      { address: 'Sevilla', city: 'Sevilla', country: 'España', lat: 37.3891, lng: -5.9845, formatted: 'Sevilla, España' },
    ]

    // Calcular distancia más cercana
    let nearest = cities[0]
    let minDistance = getDistance(lat, lng, cities[0].lat, cities[0].lng)

    cities.forEach(city => {
      const distance = getDistance(lat, lng, city.lat, city.lng)
      if (distance < minDistance) {
        minDistance = distance
        nearest = city
      }
    })

    return nearest
  }

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
          <button
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600 disabled:opacity-50"
            type="button"
            title="Usar mi ubicación"
          >
            <Locate className={`w-5 h-5 ${isLoadingLocation ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-neutral-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(location)}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors flex items-center space-x-3 border-b border-neutral-100 last:border-b-0"
              type="button"
            >
              <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-neutral-900">{location.city}</p>
                <p className="text-sm text-neutral-500">{location.formatted}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Función auxiliar para calcular distancias (exportable)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
