'use client'

import { useEffect, useState } from 'react'
import {
  Clock,
  MapPin,
  Settings,
  Plus,
  X,
  Copy,
  Save,
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react'

// ==========================================
// TIPOS
// ==========================================

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

interface Location {
  id: string
  name: string
  address: string
  type: 'indoor' | 'outdoor' | 'both'
  lat?: number
  lng?: number
  is_default: boolean
}

interface BlockedDate {
  id: string
  blocked_date: string
  reason: string
}

interface AvailabilitySettings {
  class_duration: number // minutos
  buffer_time: number // minutos entre clases
  min_advance_hours: number // horas mínimas de antelación
  max_advance_days: number // días máximos de antelación
}

// ==========================================
// CONSTANTES
// ==========================================

const DAYS = [
  { key: 'monday', label: 'Lunes', shortLabel: 'L' },
  { key: 'tuesday', label: 'Martes', shortLabel: 'M' },
  { key: 'wednesday', label: 'Miércoles', shortLabel: 'X' },
  { key: 'thursday', label: 'Jueves', shortLabel: 'J' },
  { key: 'friday', label: 'Viernes', shortLabel: 'V' },
  { key: 'saturday', label: 'Sábado', shortLabel: 'S' },
  { key: 'sunday', label: 'Domingo', shortLabel: 'D' },
]

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minute}`
})

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function TabDisponibilidadPro() {
  const [activeSubTab, setActiveSubTab] = useState<'horarios' | 'ubicaciones' | 'config'>('horarios')
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  })
  const [locations, setLocations] = useState<Location[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [settings, setSettings] = useState<AvailabilitySettings>({
    class_duration: 60,
    buffer_time: 0,
    min_advance_hours: 2,
    max_advance_days: 30,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estados para formularios
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [showLocationForm, setShowLocationForm] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    await Promise.all([loadAvailability(), loadLocations(), loadBlockedDates(), loadSettings()])
    setLoading(false)
  }

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
    }
  }

  const loadLocations = async () => {
    try {
      const res = await fetch('/api/coaches/locations')
      if (res.ok) {
        const data = await res.json()
        setLocations(data.locations || [])
      }
    } catch (error) {
      console.error('Error loading locations:', error)
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

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/coaches/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  // ==========================================
  // FUNCIONES DE HORARIOS
  // ==========================================

  const handleSaveSchedule = async () => {
    try {
      setSaving(true)

      const slots: any[] = []
      Object.entries(schedule).forEach(([day, timeSlots]) => {
        timeSlots.forEach((slot) => {
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
      [day]: prev[day].map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    }))
  }

  const copyDaySchedule = (fromDay: keyof WeekSchedule, toDay: keyof WeekSchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [toDay]: [...prev[fromDay]],
    }))
  }

  const applyTemplateWeekdays = () => {
    const template = [{ start: '09:00', end: '13:00' }, { start: '17:00', end: '21:00' }]
    setSchedule((prev) => ({
      ...prev,
      monday: template,
      tuesday: template,
      wednesday: template,
      thursday: template,
      friday: template,
    }))
  }

  const clearAllSchedule = () => {
    if (confirm('¿Estás seguro de que quieres borrar toda la disponibilidad?')) {
      setSchedule({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      })
    }
  }

  // ==========================================
  // FUNCIONES DE UBICACIONES
  // ==========================================

  const handleSaveLocation = async (location: Partial<Location>) => {
    try {
      const method = editingLocation ? 'PUT' : 'POST'
      const url = editingLocation
        ? `/api/coaches/locations/${editingLocation.id}`
        : '/api/coaches/locations'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      })

      if (res.ok) {
        loadLocations()
        setShowLocationForm(false)
        setEditingLocation(null)
        alert('✅ Ubicación guardada exitosamente')
      } else {
        alert('❌ Error al guardar ubicación')
      }
    } catch (error) {
      console.error('Error saving location:', error)
      alert('❌ Error al guardar ubicación')
    }
  }

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) return

    try {
      const res = await fetch(`/api/coaches/locations/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadLocations()
        alert('✅ Ubicación eliminada')
      } else {
        alert('❌ Error al eliminar ubicación')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      alert('❌ Error al eliminar ubicación')
    }
  }

  const handleSetDefaultLocation = async (id: string) => {
    try {
      const res = await fetch(`/api/coaches/locations/${id}/default`, {
        method: 'PUT',
      })

      if (res.ok) {
        loadLocations()
      }
    } catch (error) {
      console.error('Error setting default location:', error)
    }
  }

  // ==========================================
  // FUNCIONES DE FECHAS BLOQUEADAS
  // ==========================================

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
        alert('✅ Fecha desbloqueada')
      }
    } catch (error) {
      console.error('Error unblocking date:', error)
    }
  }

  // ==========================================
  // FUNCIONES DE CONFIGURACIÓN
  // ==========================================

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/coaches/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        alert('✅ Configuración guardada')
      } else {
        alert('❌ Error al guardar configuración')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('❌ Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">
      {/* Header con Sub-tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-neutral-200">
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="flex-1 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-neutral-900">
                Disponibilidad y Ubicación
              </h1>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveSubTab('horarios')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeSubTab === 'horarios'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horarios
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('ubicaciones')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeSubTab === 'ubicaciones'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ubicaciones ({locations.length})
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('config')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeSubTab === 'config'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO: TAB HORARIOS */}
      {activeSubTab === 'horarios' && (
        <HorariosTab
          schedule={schedule}
          blockedDates={blockedDates}
          newBlockedDate={newBlockedDate}
          newBlockedReason={newBlockedReason}
          setNewBlockedDate={setNewBlockedDate}
          setNewBlockedReason={setNewBlockedReason}
          saving={saving}
          addTimeSlot={addTimeSlot}
          removeTimeSlot={removeTimeSlot}
          updateTimeSlot={updateTimeSlot}
          copyDaySchedule={copyDaySchedule}
          applyTemplateWeekdays={applyTemplateWeekdays}
          clearAllSchedule={clearAllSchedule}
          handleSaveSchedule={handleSaveSchedule}
          handleBlockDate={handleBlockDate}
          handleUnblockDate={handleUnblockDate}
        />
      )}

      {/* CONTENIDO: TAB UBICACIONES */}
      {activeSubTab === 'ubicaciones' && (
        <UbicacionesTab
          locations={locations}
          showLocationForm={showLocationForm}
          editingLocation={editingLocation}
          setShowLocationForm={setShowLocationForm}
          setEditingLocation={setEditingLocation}
          handleSaveLocation={handleSaveLocation}
          handleDeleteLocation={handleDeleteLocation}
          handleSetDefaultLocation={handleSetDefaultLocation}
        />
      )}

      {/* CONTENIDO: TAB CONFIGURACIÓN */}
      {activeSubTab === 'config' && (
        <ConfiguracionTab
          settings={settings}
          setSettings={setSettings}
          saving={saving}
          handleSaveSettings={handleSaveSettings}
        />
      )}
    </div>
  )
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function HorariosTab({
  schedule,
  blockedDates,
  newBlockedDate,
  newBlockedReason,
  setNewBlockedDate,
  setNewBlockedReason,
  saving,
  addTimeSlot,
  removeTimeSlot,
  updateTimeSlot,
  copyDaySchedule,
  applyTemplateWeekdays,
  clearAllSchedule,
  handleSaveSchedule,
  handleBlockDate,
  handleUnblockDate,
}: any) {
  const [copyFrom, setCopyFrom] = useState<keyof WeekSchedule | ''>('')

  return (
    <div className="space-y-6">
      {/* Botón Guardar + Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveSchedule}
            disabled={saving}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar horarios'}
          </button>

          <button
            onClick={applyTemplateWeekdays}
            className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Lunes-Viernes: 9-13h y 17-21h
          </button>

          <button
            onClick={clearAllSchedule}
            className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Borrar todo
          </button>
        </div>
      </div>

      {/* Copiar horario entre días */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Copy className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Copiar horario</h3>
            <div className="flex items-center gap-3">
              <select
                value={copyFrom}
                onChange={(e) => setCopyFrom(e.target.value as keyof WeekSchedule)}
                className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Selecciona un día...</option>
                {DAYS.map((day) => (
                  <option key={day.key} value={day.key}>
                    {day.label}
                  </option>
                ))}
              </select>

              {copyFrom && (
                <>
                  <span className="text-blue-700">→</span>
                  {DAYS.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => copyDaySchedule(copyFrom as keyof WeekSchedule, day.key as keyof WeekSchedule)}
                      disabled={day.key === copyFrom}
                      className="w-10 h-10 rounded-lg bg-white border-2 border-blue-300 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-blue-700 transition-colors"
                    >
                      {day.shortLabel}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Horario Semanal */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Horario semanal</h2>

        <div className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
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
                  {schedule[key as keyof WeekSchedule].map((slot: TimeSlot, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(key as keyof WeekSchedule, index, 'start', e.target.value)
                        }
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <span className="text-neutral-600 font-medium">hasta</span>

                      <select
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(key as keyof WeekSchedule, index, 'end', e.target.value)
                        }
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
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
                        title="Eliminar"
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
            Bloquear nueva fecha (vacaciones, eventos, etc.)
          </label>
          <div className="flex gap-3">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
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
            {blockedDates.map((date: BlockedDate) => (
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
                  {date.reason && <p className="text-sm text-neutral-600">{date.reason}</p>}
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

function UbicacionesTab({
  locations,
  showLocationForm,
  editingLocation,
  setShowLocationForm,
  setEditingLocation,
  handleSaveLocation,
  handleDeleteLocation,
  handleSetDefaultLocation,
}: any) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'both' as 'indoor' | 'outdoor' | 'both',
  })

  useEffect(() => {
    if (editingLocation) {
      setFormData({
        name: editingLocation.name,
        address: editingLocation.address,
        type: editingLocation.type,
      })
      setShowLocationForm(true)
    }
  }, [editingLocation])

  const handleSubmit = () => {
    if (!formData.name || !formData.address) {
      alert('Por favor completa todos los campos')
      return
    }

    handleSaveLocation(formData)
    setFormData({ name: '', address: '', type: 'both' })
    setEditingLocation(null)
  }

  const handleCancel = () => {
    setShowLocationForm(false)
    setEditingLocation(null)
    setFormData({ name: '', address: '', type: 'both' })
  }

  return (
    <div className="space-y-6">
      {/* Botón Añadir */}
      {!showLocationForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={() => setShowLocationForm(true)}
            className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Añadir ubicación
          </button>
        </div>
      )}

      {/* Formulario */}
      {showLocationForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            {editingLocation ? 'Editar ubicación' : 'Nueva ubicación'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre de la ubicación *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Club Padel Valencia"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Dirección completa *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle Example 123, Valencia"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tipo de pista *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="indoor">Interior</option>
                <option value="outdoor">Exterior</option>
                <option value="both">Ambas</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
              >
                {editingLocation ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Ubicaciones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Mis ubicaciones ({locations.length})
        </h2>

        {locations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No tienes ubicaciones guardadas
            </h3>
            <p className="text-neutral-600">
              Añade las ubicaciones donde impartes clases para facilitar las reservas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((location: Location) => (
              <div
                key={location.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  location.is_default
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-900">{location.name}</h3>
                      {location.is_default && (
                        <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full font-medium">
                          Por defecto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {location.address}
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {location.type === 'indoor'
                        ? 'Pistas interiores'
                        : location.type === 'outdoor'
                        ? 'Pistas exteriores'
                        : 'Interior y exterior'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-200">
                  {!location.is_default && (
                    <button
                      onClick={() => handleSetDefaultLocation(location.id)}
                      className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Predeterminada
                    </button>
                  )}
                  <button
                    onClick={() => setEditingLocation(location)}
                    className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(location.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ConfiguracionTab({ settings, setSettings, saving, handleSaveSettings }: any) {
  return (
    <div className="space-y-6">
      {/* Botón Guardar */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>

      {/* Configuración de Clases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Configuración de clases
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Duración de clase (minutos)
            </label>
            <select
              value={settings.class_duration}
              onChange={(e) =>
                setSettings({ ...settings, class_duration: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={30}>30 minutos</option>
              <option value={60}>60 minutos (1 hora)</option>
              <option value={90}>90 minutos (1.5 horas)</option>
              <option value={120}>120 minutos (2 horas)</option>
            </select>
            <p className="text-sm text-neutral-600 mt-1">
              Duración estándar de tus clases
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tiempo entre clases (minutos)
            </label>
            <select
              value={settings.buffer_time}
              onChange={(e) =>
                setSettings({ ...settings, buffer_time: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={0}>Sin tiempo de descanso</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>60 minutos</option>
            </select>
            <p className="text-sm text-neutral-600 mt-1">
              Buffer de tiempo entre clases para descansar o cambiar ubicación
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Antelación mínima (horas)
            </label>
            <select
              value={settings.min_advance_hours}
              onChange={(e) =>
                setSettings({ ...settings, min_advance_hours: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={1}>1 hora</option>
              <option value={2}>2 horas</option>
              <option value={4}>4 horas</option>
              <option value={12}>12 horas</option>
              <option value={24}>24 horas (1 día)</option>
              <option value={48}>48 horas (2 días)</option>
            </select>
            <p className="text-sm text-neutral-600 mt-1">
              Tiempo mínimo de antelación para reservar una clase
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Máximo de antelación (días)
            </label>
            <select
              value={settings.max_advance_days}
              onChange={(e) =>
                setSettings({ ...settings, max_advance_days: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={7}>7 días (1 semana)</option>
              <option value={14}>14 días (2 semanas)</option>
              <option value={30}>30 días (1 mes)</option>
              <option value={60}>60 días (2 meses)</option>
              <option value={90}>90 días (3 meses)</option>
            </select>
            <p className="text-sm text-neutral-600 mt-1">
              Con cuánta antelación pueden reservar los alumnos
            </p>
          </div>
        </div>
      </div>

      {/* Nota Informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Sobre la configuración</h3>
          <p className="text-sm text-blue-800">
            Estos ajustes afectarán a todas las nuevas reservas. Los cambios se aplicarán
            inmediatamente pero no afectarán a las clases ya confirmadas.
          </p>
        </div>
      </div>
    </div>
  )
}
