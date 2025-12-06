'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Calendar, Download, CheckCircle, Clock } from 'lucide-react'

interface FinancialStats {
  total_earnings: number
  monthly_earnings: number
  pending_payments: number
  completed_classes: number
  average_per_class: number
}

interface Transaction {
  id: string
  booking_date: string
  player_name: string
  amount: number
  status: string
  payment_status: string
}

export default function TabFinanzas() {
  const [stats, setStats] = useState<FinancialStats>({
    total_earnings: 0,
    monthly_earnings: 0,
    pending_payments: 0,
    completed_classes: 0,
    average_per_class: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMonth, setFilterMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  )

  useEffect(() => {
    loadFinancialData()
  }, [filterMonth])

  const loadFinancialData = async () => {
    try {
      const res = await fetch(`/api/coaches/finances?month=${filterMonth}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error loading financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Fecha', 'Alumno', 'Importe', 'Estado', 'Pago']
    const rows = transactions.map((t) => [
      new Date(t.booking_date).toLocaleDateString('es-ES'),
      t.player_name,
      `${t.amount.toFixed(2)}€`,
      t.status,
      t.payment_status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finanzas-${filterMonth}.csv`
    a.click()
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
      {/* KPIs Financieros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">Ingresos del Mes</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            €{stats.monthly_earnings.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            Después de comisión (15%)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">Ingresos Totales</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            €{stats.total_earnings.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-600 mt-1">Acumulado</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">Pendientes</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            €{stats.pending_payments.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-600 mt-1">Por cobrar</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600">Media por Clase</h3>
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            €{stats.average_per_class.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            {stats.completed_classes} clases
          </p>
        </div>
      </div>

      {/* Filtros y Exportar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-neutral-600" />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Filtrar por mes
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabla de Transacciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">
            Historial de Transacciones
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            {transactions.length} transacciones en {filterMonth}
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No hay transacciones
            </h3>
            <p className="text-neutral-600">
              Las transacciones aparecerán aquí después de completar clases
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Alumno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Importe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Pago
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {new Date(transaction.booking_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {transaction.player_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">
                      €{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {transaction.status === 'completed'
                          ? 'Completada'
                          : transaction.status === 'confirmed'
                          ? 'Confirmada'
                          : transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.payment_status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.payment_status === 'paid'
                          ? 'Pagado'
                          : transaction.payment_status === 'pending'
                          ? 'Pendiente'
                          : transaction.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Nota sobre Stripe */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Los pagos se procesan a través de Stripe Connect. Las
          transferencias a tu cuenta bancaria se realizan automáticamente cada 7 días.
          Comisión de plataforma: 15%.
        </p>
      </div>
    </div>
  )
}
