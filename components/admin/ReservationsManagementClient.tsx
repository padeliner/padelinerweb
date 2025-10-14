'use client'

import { useState, useMemo } from 'react'
import { Search, Calendar, Eye, CheckCircle, XCircle, Clock, User, DollarSign } from 'lucide-react'

interface Reservation {
  id: string
  student_name: string
  student_email: string
  coach_name: string
  club_name: string
  court_number: string
  date: string
  time: string
  duration: number
  price: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  payment_status: 'paid' | 'pending' | 'refunded'
  created_at: string
  notes?: string
}

// Datos mock para demostración (SE REEMPLAZARÁ CON SUPABASE)
const mockReservations: Reservation[] = [
  {
    id: '1',
    student_name: 'Carlos García',
    student_email: 'carlos.garcia@email.com',
    coach_name: 'Ana Martínez',
    club_name: 'Club Pádel Madrid Centro',
    court_number: 'Pista 3',
    date: '2025-10-15',
    time: '18:00',
    duration: 90,
    price: 45.00,
    status: 'confirmed',
    payment_status: 'paid',
    created_at: '2025-10-10T10:30:00Z',
    notes: 'Clase de nivel intermedio'
  },
  {
    id: '2',
    student_name: 'María López',
    student_email: 'maria.lopez@email.com',
    coach_name: 'Pedro Sánchez',
    club_name: 'Academia Pádel Pro',
    court_number: 'Pista 1',
    date: '2025-10-14',
    time: '10:00',
    duration: 60,
    price: 35.00,
    status: 'pending',
    payment_status: 'pending',
    created_at: '2025-10-13T15:20:00Z'
  },
  {
    id: '3',
    student_name: 'Juan Rodríguez',
    student_email: 'juan.rodriguez@email.com',
    coach_name: 'Laura Fernández',
    club_name: 'Club Pádel Barcelona',
    court_number: 'Pista 2',
    date: '2025-10-12',
    time: '19:30',
    duration: 90,
    price: 50.00,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2025-10-08T12:00:00Z'
  },
  {
    id: '4',
    student_name: 'Elena Ruiz',
    student_email: 'elena.ruiz@email.com',
    coach_name: 'Miguel Torres',
    club_name: 'Pádel Club Valencia',
    court_number: 'Pista 4',
    date: '2025-10-13',
    time: '16:00',
    duration: 60,
    price: 30.00,
    status: 'cancelled',
    payment_status: 'refunded',
    created_at: '2025-10-11T09:15:00Z'
  }
]

export function ReservationsManagementClient() {
  const [reservations] = useState<Reservation[]>(mockReservations)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Calcular estadísticas
  const stats = useMemo(() => {
    return {
      total: reservations.length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      pending: reservations.filter(r => r.status === 'pending').length,
      completed: reservations.filter(r => r.status === 'completed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
      totalRevenue: reservations.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + r.price, 0),
      pendingPayments: reservations.filter(r => r.payment_status === 'pending').reduce((sum, r) => sum + r.price, 0)
    }
  }, [reservations])

  // Filtrar reservas
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      const matchesSearch = 
        reservation.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.coach_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.club_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
      const matchesPayment = paymentFilter === 'all' || reservation.payment_status === paymentFilter
      
      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [reservations, searchTerm, statusFilter, paymentFilter])

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400', icon: CheckCircle },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400', icon: Clock },
      cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400', icon: XCircle },
      completed: { label: 'Completada', color: 'bg-blue-100 text-blue-700 dark-admin:bg-blue-900/20 dark-admin:text-blue-400', icon: CheckCircle }
    }
    const statusInfo = statuses[status]
    const Icon = statusInfo.icon
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </span>
    )
  }

  const getPaymentBadge = (payment: string) => {
    const payments: Record<string, { label: string; color: string }> = {
      paid: { label: 'Pagado', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
      pending: { label: 'Pendiente', color: 'bg-orange-100 text-orange-700 dark-admin:bg-orange-900/20 dark-admin:text-orange-400' },
      refunded: { label: 'Reembolsado', color: 'bg-purple-100 text-purple-700 dark-admin:bg-purple-900/20 dark-admin:text-purple-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${payments[payment].color}`}>{payments[payment].label}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Reservas</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra todas las reservas de la plataforma (DATOS MOCK)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Confirmadas</p>
          <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Completadas</p>
          <p className="text-2xl font-bold text-blue-600 dark-admin:text-blue-400 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Canceladas</p>
          <p className="text-2xl font-bold text-red-600 dark-admin:text-red-400 mt-1">{stats.cancelled}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Ingresos</p>
          <p className="text-xl font-bold text-green-600 dark-admin:text-green-400 mt-1">€{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pend. Pago</p>
          <p className="text-xl font-bold text-orange-600 dark-admin:text-orange-400 mt-1">€{stats.pendingPayments.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los pagos</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
            <option value="refunded">Reembolsados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Alumno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Entrenador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Club / Pista</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Fecha / Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Pago</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Importe</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark-admin:bg-blue-900/20 flex items-center justify-center text-blue-600 dark-admin:text-blue-400 font-bold text-sm">
                        {reservation.student_name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{reservation.student_name}</div>
                        <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{reservation.student_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{reservation.coach_name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">{reservation.club_name}</div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{reservation.court_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">
                      {new Date(reservation.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{reservation.time} ({reservation.duration}min)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(reservation.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getPaymentBadge(reservation.payment_status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-900 dark-admin:text-slate-100">€{reservation.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedReservation(reservation); setShowModal(true); }}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 dark-admin:bg-green-900/20 text-green-600 dark-admin:text-green-400 hover:bg-green-100 dark-admin:hover:bg-green-900/30 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron reservas</p>
          </div>
        )}
      </div>

      {/* Modal Simple */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-4">Detalles de Reserva</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Alumno</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReservation.student_name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Entrenador</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReservation.coach_name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Club</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReservation.club_name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Pista</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReservation.court_number}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Fecha y Hora</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{new Date(selectedReservation.date).toLocaleDateString('es-ES')} - {selectedReservation.time}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Duración</p>
                  <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedReservation.duration} minutos</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-1">Estado</p>
                  {getStatusBadge(selectedReservation.status)}
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-1">Pago</p>
                  {getPaymentBadge(selectedReservation.payment_status)}
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark-admin:border-slate-700">
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Importe Total</p>
                <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400">€{selectedReservation.price.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full px-4 py-2 bg-neutral-100 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg hover:bg-neutral-200 dark-admin:hover:bg-slate-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
