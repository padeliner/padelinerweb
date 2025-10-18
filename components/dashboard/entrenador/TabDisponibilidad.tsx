'use client'

import { useEffect, useState } from 'react'
import { Clock, Plus, X, Calendar as CalendarIcon, Save, AlertCircle } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
}

interface WeekSchedule {
  monday: TimeSlot[]
  tuesday: TimeSlot[]
  wednesday: TimeSlot[]
  thursday: TimeSlot[]
  friday: TimeSlot[]
  saturday: TimeSlot[]
  sunday: TimeSlot[]
}

interface BlockedDate {
  id: string
  blocked_date: string
  reason: string
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minute}`
})

export default function TabDisponibilidad() {
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  })
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')

  useEffect(() => {
    loadAvailability()
    loadBlockedDates()
  }, [])

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/coaches/availability')
      if (res.ok) {
        const data = await res.json()
        if (data.availability && data.availability.length > 0) {
          const weekSchedule: WeekSchedule = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          }

          data.availability.forEach((slot: any) => {
            const dayKey = slot.day_of_week.toLowerCase() as keyof WeekSchedule
            weekSchedule[dayKey].push({
              start: slot.start_time.substring(0, 5),
              end: slot.end_time.substring(0, 5),
            })
          })

          setSchedule(weekSchedule)
        }
      }
    } catch (error) {
      console.error('Error loading availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBlockedDates = async () => {
    try {
      const res = await fetch('/api/coaches/availability/blocked')
      if (res.ok) {
        const data = await res.json()
        setBlockedDates(data.blockedDates || [])
      }
    } catch (error) {
      console.error('Error loading blocked dates:', error)
    }
  }

  const handleSaveSchedule = async () => {
    try {
      setSaving(true)

      // Convertir schedule a formato de API
      const slots: any[] = []
      Object.entries(schedule).forEach(([day, timeSlots]) => {
        timeSlots.forEach((slot: TimeSlot) => {
          slots.push({
            day_of_week: day.charAt(0).toUpperCase() + day.slice(1),
            start_time: slot.start,
            end_time: slot.end,
            is_available: true,
          })
        })
      })

      const res = await fetch('/api/coaches/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })

      if (res.ok) {
        alert('✅ Disponibilidad actualizada exitosamente')
      } else {
        alert('❌ Error al actualizar disponibilidad')
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('❌ Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  const addTimeSlot = (day: keyof WeekSchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '10:00' }],
    }))
  }

  const removeTimeSlot = (day: keyof WeekSchedule, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }))
  }

  const updateTimeSlot = (
    day: keyof WeekSchedule,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }))
  }

  const handleBlockDate = async () => {
    if (!newBlockedDate) return

    try {
      const res = await fetch('/api/coaches/availability/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocked_date: newBlockedDate,
          reason: newBlockedReason || 'No disponible',
        }),
      })

      if (res.ok) {
        loadBlockedDates()
        setNewBlockedDate('')
        setNewBlockedReason('')
        alert('✅ Fecha bloqueada exitosamente')
      } else {
        alert('❌ Error al bloquear fecha')
      }
    } catch (error) {
      console.error('Error blocking date:', error)
      alert('❌ Error al bloquear fecha')
    }
  }

  const handleUnblockDate = async (id: string) => {
    try {
      const res = await fetch(`/api/coaches/availability/block?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadBlockedDates()
        alert('✅ Fecha desbloqueada exitosamente')
      } else {
        alert('❌ Error al desbloquear fecha')
      }
    } catch (error) {
      console.error('Error unblocking date:', error)
      alert('❌ Error al desbloquear fecha')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botón Guardar Sticky */}
      <div className="sticky top-0 z-10 bg-neutral-50 py-4 -mt-4 border-b border-neutral-200">
        <button
          onClick={handleSaveSchedule}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar disponibilidad'}
        </button>
      </div>

      {/* Aviso Importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            ¿Cómo funciona la disponibilidad?
          </h3>
          <p className="text-sm text-blue-800">
            Define tus horarios semanales y los alumnos solo podrán reservar clases en esos rangos.
            Puedes bloquear fechas específicas para vacaciones o eventos especiales.
          </p>
        </div>
      </div>

      {/* Horario Semanal */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Horario semanal</h2>
        </div>

        <div className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-neutral-900">{label}</h3>
                <button
                  onClick={() => addTimeSlot(key as keyof WeekSchedule)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Añadir horario
                </button>
              </div>

              {schedule[key as keyof WeekSchedule].length === 0 ? (
                <p className="text-sm text-neutral-500 italic">No disponible este día</p>
              ) : (
                <div className="space-y-2">
                  {schedule[key as keyof WeekSchedule].map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(key as keyof WeekSchedule, index, 'start', e.target.value)
                        }
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <span className="text-neutral-600">hasta</span>

                      <select
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(key as keyof WeekSchedule, index, 'end', e.target.value)
                        }
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeTimeSlot(key as keyof WeekSchedule, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fechas Bloqueadas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Fechas bloqueadas</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Bloquear nueva fecha
          </label>
          <div className="flex gap-3">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              placeholder="Motivo (opcional)"
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleBlockDate}
              disabled={!newBlockedDate}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bloquear
            </button>
          </div>
        </div>

        {blockedDates.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No hay fechas bloqueadas</p>
        ) : (
          <div className="space-y-2">
            {blockedDates.map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    {new Date(date.blocked_date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {date.reason && (
                    <p className="text-sm text-neutral-600">{date.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleUnblockDate(date.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                >
                  Desbloquear
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
