'use client'

import { useState, useMemo } from 'react'
import { Search, TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, User, Download } from 'lucide-react'

interface Transaction {
  id: string
  type: 'booking' | 'subscription' | 'product' | 'refund'
  amount: number
  commission: number
  net_amount: number
  status: 'completed' | 'pending' | 'failed'
  user_name: string
  user_email: string
  description: string
  payment_method: 'card' | 'paypal' | 'transfer'
  created_at: string
}

// Datos mock para demostración
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'booking',
    amount: 45.00,
    commission: 4.50,
    net_amount: 40.50,
    status: 'completed',
    user_name: 'Carlos García',
    user_email: 'carlos@email.com',
    description: 'Reserva con Ana Martínez - Pista 3',
    payment_method: 'card',
    created_at: '2025-10-13T10:30:00Z'
  },
  {
    id: '2',
    type: 'subscription',
    amount: 29.99,
    commission: 2.99,
    net_amount: 27.00,
    status: 'completed',
    user_name: 'María López',
    user_email: 'maria@email.com',
    description: 'Plan Premium - Mensual',
    payment_method: 'card',
    created_at: '2025-10-13T09:15:00Z'
  },
  {
    id: '3',
    type: 'product',
    amount: 89.99,
    commission: 8.99,
    net_amount: 81.00,
    status: 'completed',
    user_name: 'Juan Rodríguez',
    user_email: 'juan@email.com',
    description: 'Pala Bullpadel Vertex 03',
    payment_method: 'paypal',
    created_at: '2025-10-13T08:45:00Z'
  },
  {
    id: '4',
    type: 'booking',
    amount: 35.00,
    commission: 3.50,
    net_amount: 31.50,
    status: 'pending',
    user_name: 'Elena Ruiz',
    user_email: 'elena@email.com',
    description: 'Reserva con Pedro Sánchez - Pista 1',
    payment_method: 'card',
    created_at: '2025-10-13T07:20:00Z'
  },
  {
    id: '5',
    type: 'refund',
    amount: -30.00,
    commission: -3.00,
    net_amount: -27.00,
    status: 'completed',
    user_name: 'David Moreno',
    user_email: 'david@email.com',
    description: 'Reembolso - Cancelación clase',
    payment_method: 'card',
    created_at: '2025-10-12T16:30:00Z'
  },
  {
    id: '6',
    type: 'booking',
    amount: 50.00,
    commission: 5.00,
    net_amount: 45.00,
    status: 'completed',
    user_name: 'Isabel Castillo',
    user_email: 'isabel@email.com',
    description: 'Reserva con Laura Fernández - Pista 2',
    payment_method: 'transfer',
    created_at: '2025-10-12T14:10:00Z'
  },
  {
    id: '7',
    type: 'product',
    amount: 125.00,
    commission: 12.50,
    net_amount: 112.50,
    status: 'completed',
    user_name: 'Roberto Díaz',
    user_email: 'roberto@email.com',
    description: 'Zapatillas Asics Gel-Padel Pro 4',
    payment_method: 'card',
    created_at: '2025-10-12T11:30:00Z'
  }
]

export function FinancesManagementClient() {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [periodFilter, setPeriodFilter] = useState<string>('month')

  // Calcular estadísticas
  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed')
    const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0)
    const totalCommissions = completed.reduce((sum, t) => sum + t.commission, 0)
    const netRevenue = completed.reduce((sum, t) => sum + t.net_amount, 0)
    const pending = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)

    return {
      totalRevenue,
      totalCommissions,
      netRevenue,
      pending,
      transactionCount: transactions.length,
      avgTransaction: totalRevenue / completed.length || 0,
      todayRevenue: 189.99, // Mock
      weekRevenue: 1247.85, // Mock
      monthRevenue: totalRevenue,
      yearRevenue: 45892.30 // Mock
    }
  }, [transactions])

  // Filtrar transacciones
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [transactions, searchTerm, typeFilter, statusFilter])

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      booking: { label: 'Reserva', color: 'bg-blue-100 text-blue-700 dark-admin:bg-blue-900/20 dark-admin:text-blue-400' },
      subscription: { label: 'Suscripción', color: 'bg-purple-100 text-purple-700 dark-admin:bg-purple-900/20 dark-admin:text-purple-400' },
      product: { label: 'Producto', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
      refund: { label: 'Reembolso', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${types[type].color}`}>{types[type].label}</span>
  }

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      completed: { label: 'Completado', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400' },
      failed: { label: 'Fallido', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statuses[status].color}`}>{statuses[status].label}</span>
  }

  const getPeriodRevenue = () => {
    switch(periodFilter) {
      case 'day': return stats.todayRevenue
      case 'week': return stats.weekRevenue
      case 'month': return stats.monthRevenue
      case 'year': return stats.yearRevenue
      default: return stats.monthRevenue
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Finanzas</h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Panel de control financiero (DATOS MOCK)</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2">
        {['day', 'week', 'month', 'year'].map(period => (
          <button
            key={period}
            onClick={() => setPeriodFilter(period)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              periodFilter === period
                ? 'bg-green-600 text-white'
                : 'bg-white dark-admin:bg-slate-800 text-neutral-700 dark-admin:text-slate-300 border border-neutral-200 dark-admin:border-slate-700 hover:bg-neutral-50 dark-admin:hover:bg-slate-700'
            }`}
          >
            {period === 'day' && 'Hoy'}
            {period === 'week' && 'Semana'}
            {period === 'month' && 'Mes'}
            {period === 'year' && 'Año'}
          </button>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Ingresos Totales</p>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">€{getPeriodRevenue().toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12.5% vs anterior</span>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Comisiones</p>
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">€{stats.totalCommissions.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-1">~10% comisión</p>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Ingresos Netos</p>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark-admin:text-green-400">€{stats.netRevenue.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-1">Después de comisiones</p>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600 dark-admin:text-orange-400">€{stats.pending.toFixed(2)}</p>
          <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-1">Por procesar</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Transacciones</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.transactionCount}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Transacción Promedio</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">€{stats.avgTransaction.toFixed(2)}</p>
        </div>
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Tasa de Comisión</p>
          <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">10%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar transacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los tipos</option>
            <option value="booking">Reservas</option>
            <option value="subscription">Suscripciones</option>
            <option value="product">Productos</option>
            <option value="refund">Reembolsos</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completados</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidos</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Importe</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Comisión</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark-admin:bg-purple-900/20 flex items-center justify-center text-purple-600 dark-admin:text-purple-400 font-bold text-sm">
                        {transaction.user_name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{transaction.user_name}</div>
                        <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{transaction.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900 dark-admin:text-slate-100">{transaction.description}</div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">
                      {new Date(transaction.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(transaction.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(transaction.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600 dark-admin:text-green-400' : 'text-red-600 dark-admin:text-red-400'}`}>
                      {transaction.amount >= 0 ? '+' : ''}€{transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-neutral-600 dark-admin:text-slate-400">
                    €{Math.abs(transaction.commission).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                    €{transaction.net_amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron transacciones</p>
          </div>
        )}
      </div>
    </div>
  )
}
