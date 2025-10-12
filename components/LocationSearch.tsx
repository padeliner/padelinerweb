'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Locate, X } from 'lucide-react'
import Script from 'next/script'

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
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // No necesitamos inicializar servicios, la nueva API usa importLibrary

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Buscar ubicaciones usando la nueva Google Places API
  const searchLocations = useCallback((query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    // Cancelar búsqueda anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce de 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      if (!isGoogleLoaded) {
        console.warn('Google Places API no está cargada aún')
        return
      }

      try {
        // @ts-ignore - Importar la nueva librería Places
        const { AutocompleteSuggestion } = await google.maps.importLibrary("places")

        // Crear request para autocompletado
        const request = {
          input: query,
          includedRegionCodes: ['es'], // Solo España
          language: 'es-ES',
        }

        // Obtener sugerencias
        const { suggestions: predictions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

        if (!predictions || predictions.length === 0) {
          setSuggestions([])
          return
        }

        // Procesar cada sugerencia
        const locationPromises = predictions.slice(0, 5).map(async (suggestion: any) => {
          const placePrediction = suggestion.placePrediction
          
          try {
            // Convertir a Place y obtener detalles
            const place = placePrediction.toPlace()
            await place.fetchFields({
              fields: ['displayName', 'formattedAddress', 'location', 'addressComponents']
            })

            // Extraer ciudad y país
            let city = ''
            let country = 'España'
            
            if (place.addressComponents) {
              const cityComponent = place.addressComponents.find((c: any) => 
                c.types.includes('locality') || c.types.includes('administrative_area_level_2')
              )
              const countryComponent = place.addressComponents.find((c: any) => 
                c.types.includes('country')
              )
              
              city = cityComponent?.longText || ''
              country = countryComponent?.longText || 'España'
            }

            return {
              address: place.formattedAddress || placePrediction.text.toString(),
              city: city || place.displayName || '',
              country: country,
              lat: place.location?.lat() || 0,
              lng: place.location?.lng() || 0,
              formatted: place.formattedAddress || placePrediction.text.toString()
            }
          } catch (error) {
            // Fallback si falla fetchFields
            return {
              address: placePrediction.text.toString(),
              city: placePrediction.mainText?.toString() || '',
              country: 'España',
              lat: 0,
              lng: 0,
              formatted: placePrediction.text.toString()
            }
          }
        })

        const locations = await Promise.all(locationPromises)
        setSuggestions(locations)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error)
        setSuggestions([])
      }
    }, 300)
  }, [isGoogleLoaded])

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

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // Usar la nueva API de Geocoding
          if (!isGoogleLoaded) {
            alert('Google Maps aún no está cargado')
            setIsLoadingLocation(false)
            return
          }

          try {
            // @ts-ignore
            const { Geocoder } = await google.maps.importLibrary("geocoding")
            const geocoder = new Geocoder()

            const response = await geocoder.geocode({
              location: { lat: latitude, lng: longitude }
            })

            if (response.results && response.results[0]) {
              const result = response.results[0]
              
              // Extraer componentes
              const city = result.address_components.find((c: any) => 
                c.types.includes('locality') || c.types.includes('administrative_area_level_2')
              )?.long_name || ''
              
              const country = result.address_components.find((c: any) => 
                c.types.includes('country')
              )?.long_name || 'España'

              const locationData: LocationData = {
                address: result.formatted_address,
                city: city,
                country: country,
                lat: latitude,
                lng: longitude,
                formatted: result.formatted_address
              }
              
              setInputValue(locationData.formatted)
              onLocationSelect(locationData)
            } else {
              alert('No se pudo determinar tu ubicación exacta')
            }
          } catch (error) {
            console.error('Error con geocoding:', error)
            alert('No se pudo determinar tu ubicación exacta')
          }
          
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

  return (
    <>
      {/* Cargar Google Maps API con nueva arquitectura */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&loading=async&language=es`}
        onLoad={() => {
          // Esperar un momento para asegurar que todo esté cargado
          setTimeout(() => setIsGoogleLoaded(true), 100)
        }}
        strategy="afterInteractive"
      />
      
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
          className="w-full pl-12 pr-24 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-neutral-900"
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
    </>
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
