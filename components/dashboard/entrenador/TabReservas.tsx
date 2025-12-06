'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'

interface Booking {
  id: string
  player_name: string
  player_avatar: string | null
  booking_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  class_type: string
  location_address: string
  total_price: number
  status: string
  player_notes: string | null
  created_at: string
}

export default function TabReservas() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadBookings()
  }, [activeFilter])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeFilter !== 'all') {
        params.append('status', activeFilter)
      }
      
      const res = await fetch(`/api/coaches/bookings?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/coaches/bookings/${id}/confirm`, {
        method: 'POST',
      })
      if (res.ok) {
        loadBookings()
      }
    } catch (error) {
      console.error('Error confirming booking:', error)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('¿Por qué rechazas esta reserva?')
    if (!reason) return

    try {
      const res = await fetch(`/api/coaches/bookings/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        loadBookings()
      }
    } catch (error) {
      console.error('Error rejecting booking:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    }
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || ''}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const filteredBookings = bookings.filter((booking) =>
    booking.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda y Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre del alumno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todas ({counts.all})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Pendientes ({counts.pending})
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === 'confirmed'
                ? 'bg-green-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Confirmadas ({counts.confirmed})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Completadas ({counts.completed})
          </button>
          <button
            onClick={() => setActiveFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Canceladas ({counts.cancelled})
          </button>
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando reservas...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600">No hay reservas que mostrar</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold">
                    {booking.player_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-neutral-900">{booking.player_name}</h3>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-1 text-sm text-neutral-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.booking_date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        , {booking.start_time} - {booking.end_time} ({booking.duration_minutes} min)
                      </p>
                      <p>
                        🎾 {booking.class_type === 'individual' ? 'Individual' : 'Grupal'} • {booking.location_address} • €{booking.total_price}
                      </p>
                      {booking.player_notes && (
                        <p className="mt-2 p-2 bg-neutral-50 rounded text-neutral-700 italic">
                          💬 "{booking.player_notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                {booking.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleConfirm(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
