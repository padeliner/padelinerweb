'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function TabCalendario() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Obtener semana actual
  const getWeekDays = () => {
    const days = []
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay() + 1) // Lunes

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }

    return days
  }

  const weekDays = getWeekDays()

  return (
    <div className="space-y-4">
      {/* Controles del Calendario */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Hoy
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {weekDays[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
              Semana
            </button>
            <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Vista Semanal */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Encabezado de días */}
        <div className="grid grid-cols-8 border-b border-neutral-200">
          <div className="p-3 border-r border-neutral-200"></div>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div key={i} className="p-3 text-center border-r border-neutral-200 last:border-r-0">
                <p className="text-xs text-neutral-600 uppercase">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-primary-600' : 'text-neutral-900'}`}>
                  {day.getDate()}
                </p>
              </div>
            )
          })}
        </div>

        {/* Grid de horarios */}
        <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
          {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-neutral-200">
              <div className="p-3 border-r border-neutral-200 text-sm text-neutral-600 font-medium">
                {hour}:00
              </div>
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className="p-3 border-r border-neutral-200 last:border-r-0 hover:bg-neutral-50 transition-colors cursor-pointer min-h-[60px]"
                >
                  {/* Aquí irán las clases programadas */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-neutral-600">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-neutral-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-neutral-600">Cancelada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-400"></div>
            <span className="text-sm text-neutral-600">Bloqueado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
