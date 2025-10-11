'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users, SlidersHorizontal } from 'lucide-react'

export function SearchSection() {
  const [activeInput, setActiveInput] = useState<string | null>(null)

  return (
    <section className="relative -mt-16 sm:-mt-20 z-30 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4"
        >
          <div className="flex flex-col gap-2">
            {/* Search Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Location */}
              <SearchInput
                icon={<MapPin className="w-5 h-5" />}
                label="Ubicación"
                placeholder="¿Dónde?"
                isActive={activeInput === 'location'}
                onFocus={() => setActiveInput('location')}
                onBlur={() => setActiveInput(null)}
              />

              {/* Date */}
              <SearchInput
                icon={<Calendar className="w-5 h-5" />}
                label="Fecha"
                placeholder="¿Cuándo?"
                isActive={activeInput === 'date'}
                onFocus={() => setActiveInput('date')}
                onBlur={() => setActiveInput(null)}
              />

              {/* Type */}
              <SearchInput
                icon={<Users className="w-5 h-5" />}
                label="Tipo de clase"
                placeholder="Individual o grupo"
                isActive={activeInput === 'type'}
                onFocus={() => setActiveInput('type')}
                onBlur={() => setActiveInput(null)}
              />
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30"
            >
              <Search className="w-5 h-5" />
              <span>Buscar entrenadores</span>
            </motion.button>
          </div>

          {/* Filters */}
          <div className="mt-4 px-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <FilterChip label="Cerca de mí" />
                <FilterChip label="Mejor valorados" />
                <FilterChip label="Disponible hoy" />
                <FilterChip label="Precio económico" />
              </div>
              
              <button className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Más filtros</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SearchInput({
  icon,
  label,
  placeholder,
  isActive,
  onFocus,
  onBlur,
}: {
  icon: React.ReactNode
  label: string
  placeholder: string
  isActive: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  return (
    <div 
      className={`
        flex-1 min-w-[200px] p-4 rounded-xl cursor-text transition-all duration-200
        ${isActive ? 'bg-neutral-50 shadow-md' : 'hover:bg-neutral-50'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="text-neutral-600">{icon}</div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-neutral-900 mb-1">
            {label}
          </label>
          <input
            type="text"
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full text-sm text-neutral-700 placeholder-neutral-400 bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
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
