'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Ticket,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Eye,
  EyeOff,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DiscountCodeFormModal } from './DiscountCodeFormModal'

interface DiscountCode {
  id: string
  code: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  min_purchase: number | null
  max_discount: number | null
  start_date: string
  end_date: string | null
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  applies_to: 'all' | 'specific_products' | 'specific_categories'
  product_ids: string[]
  category_ids: string[]
  user_restrictions: 'all' | 'new_only' | 'specific_roles'
  allowed_roles: string[]
  created_at: string
  updated_at: string
}

const mockDiscountCodes: DiscountCode[] = [
  {
    id: '1',
    code: 'VERANO2024',
    description: 'Descuento de verano 20%',
    type: 'percentage',
    value: 20,
    min_purchase: 50,
    max_discount: 100,
    start_date: '2024-06-01',
    end_date: '2024-08-31',
    usage_limit: 1000,
    usage_count: 453,
    is_active: true,
    applies_to: 'all',
    product_ids: [],
    category_ids: [],
    user_restrictions: 'all',
    allowed_roles: [],
    created_at: '2024-05-15T10:00:00Z',
    updated_at: '2024-05-15T10:00:00Z',
  },
  {
    id: '2',
    code: 'BIENVENIDA50',
    description: 'Descuento para nuevos usuarios',
    type: 'fixed',
    value: 50,
    min_purchase: 100,
    max_discount: null,
    start_date: '2024-01-01',
    end_date: null,
    usage_limit: null,
    usage_count: 287,
    is_active: true,
    applies_to: 'all',
    product_ids: [],
    category_ids: [],
    user_restrictions: 'new_only',
    allowed_roles: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

export function DiscountCodesManagementClient() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(mockDiscountCodes)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'percentage' | 'fixed'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const stats = useMemo(() => {
    const now = new Date()
    const active = discountCodes.filter(c => c.is_active && (!c.end_date || new Date(c.end_date) > now))
    const expired = discountCodes.filter(c => c.end_date && new Date(c.end_date) < now)
    const totalUsage = discountCodes.reduce((sum, c) => sum + c.usage_count, 0)
    
    return {
      total: discountCodes.length,
      active: active.length,
      expired: expired.length,
      totalUsage,
    }
  }, [discountCodes])

  const filteredCodes = useMemo(() => {
    const now = new Date()
    return discountCodes.filter((code) => {
      const matchesSearch =
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === 'all' || code.type === filterType

      let matchesStatus = true
      if (filterStatus === 'active') {
        matchesStatus = code.is_active && (!code.end_date || new Date(code.end_date) > now)
      } else if (filterStatus === 'inactive') {
        matchesStatus = !code.is_active
      } else if (filterStatus === 'expired') {
        matchesStatus = !!(code.end_date && new Date(code.end_date) < now)
      }

      return matchesSearch && matchesType && matchesStatus
    })
  }, [discountCodes, searchTerm, filterType, filterStatus])

  const handleSaveCode = (code: DiscountCode) => {
    if (editingCode) {
      setDiscountCodes(discountCodes.map(c => (c.id === code.id ? code : c)))
    } else {
      setDiscountCodes([...discountCodes, { ...code, id: Date.now().toString() }])
    }
    setShowFormModal(false)
    setEditingCode(null)
  }

  const handleEditCode = (code: DiscountCode) => {
    setEditingCode(code)
    setShowFormModal(true)
  }

  const handleDeleteCode = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este código de descuento?')) {
      setDiscountCodes(discountCodes.filter((c) => c.id !== id))
    }
  }

  const handleNewCode = () => {
    setEditingCode(null)
    setShowFormModal(true)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStatusBadge = (code: DiscountCode) => {
    const now = new Date()
    if (code.end_date && new Date(code.end_date) < now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark-admin:bg-red-900/20 text-red-800 dark-admin:text-red-400">
          Expirado
        </span>
      )
    }
    if (!code.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark-admin:bg-slate-700 text-gray-800 dark-admin:text-slate-300">
          Inactivo
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark-admin:bg-green-900/20 text-green-800 dark-admin:text-green-400">
        Activo
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    if (type === 'percentage') {
      return <span className="text-blue-600 dark-admin:text-blue-400">%</span>
    }
    return <span className="text-green-600 dark-admin:text-green-400">€</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Códigos de Descuento
          </h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
            Gestiona los códigos promocionales de la tienda
          </p>
        </div>
        <button
          onClick={handleNewCode}
          className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Código</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Códigos</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <Ticket className="w-6 h-6 text-blue-600 dark-admin:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Activos</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark-admin:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Expirados</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.expired}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark-admin:bg-red-900/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark-admin:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Usos Totales</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.totalUsage}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark-admin:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark-admin:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700">
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark-admin:text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2.5 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="percentage">Porcentaje</option>
              <option value="fixed">Fijo</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="expired">Expirados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-y border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Tipo/Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Uso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Vigencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredCodes.map((code) => (
                <tr
                  key={code.id}
                  className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 bg-neutral-100 dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded font-mono text-sm">
                        {code.code}
                      </code>
                      <button
                        onClick={() => handleCopyCode(code.code)}
                        className="text-neutral-400 hover:text-neutral-600 dark-admin:hover:text-slate-300 transition-colors"
                        title="Copiar código"
                      >
                        {copiedCode === code.code ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark-admin:text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-neutral-900 dark-admin:text-slate-100">
                      {code.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(code.type)}
                      <span className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                        {code.type === 'percentage' ? `${code.value}%` : `${code.value}€`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-neutral-900 dark-admin:text-slate-100">
                      {code.usage_count}
                      {code.usage_limit && ` / ${code.usage_limit}`}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="text-neutral-900 dark-admin:text-slate-100">
                        {format(new Date(code.start_date), 'dd/MM/yyyy', { locale: es })}
                      </p>
                      {code.end_date && (
                        <p className="text-neutral-500 dark-admin:text-slate-400">
                          {format(new Date(code.end_date), 'dd/MM/yyyy', { locale: es })}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(code)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditCode(code)}
                        className="p-2 text-blue-600 dark-admin:text-blue-400 hover:bg-blue-50 dark-admin:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        className="p-2 text-red-600 dark-admin:text-red-400 hover:bg-red-50 dark-admin:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCodes.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
            <p className="text-neutral-600 dark-admin:text-slate-400">
              No se encontraron códigos de descuento
            </p>
          </div>
        )}
      </div>

      {showFormModal && (
        <DiscountCodeFormModal
          code={editingCode}
          onSave={handleSaveCode}
          onClose={() => {
            setShowFormModal(false)
            setEditingCode(null)
          }}
        />
      )}
    </div>
  )
}
