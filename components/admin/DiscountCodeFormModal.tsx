'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

interface DiscountCodeFormModalProps {
  code: DiscountCode | null
  onSave: (code: DiscountCode) => void
  onClose: () => void
}

export function DiscountCodeFormModal({ code, onSave, onClose }: DiscountCodeFormModalProps) {
  const [formData, setFormData] = useState<Partial<DiscountCode>>({
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    min_purchase: null,
    max_discount: null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: null,
    usage_limit: null,
    usage_count: 0,
    is_active: true,
    applies_to: 'all',
    product_ids: [],
    category_ids: [],
    user_restrictions: 'all',
    allowed_roles: [],
    ...code,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const now = new Date().toISOString()
    const codeData: DiscountCode = {
      id: code?.id || Date.now().toString(),
      code: formData.code!,
      description: formData.description!,
      type: formData.type!,
      value: formData.value!,
      min_purchase: formData.min_purchase ?? null,
      max_discount: formData.max_discount ?? null,
      start_date: formData.start_date!,
      end_date: formData.end_date || null,
      usage_limit: formData.usage_limit ?? null,
      usage_count: formData.usage_count || 0,
      is_active: formData.is_active!,
      applies_to: formData.applies_to!,
      product_ids: formData.product_ids!,
      category_ids: formData.category_ids!,
      user_restrictions: formData.user_restrictions!,
      allowed_roles: formData.allowed_roles!,
      created_at: code?.created_at || now,
      updated_at: now,
    }

    onSave(codeData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark-admin:border-slate-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
            {code ? 'Editar Código de Descuento' : 'Nuevo Código de Descuento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Código y Descripción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
                  placeholder="VERANO2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Descripción *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Descuento de verano"
                  required
                />
              </div>
            </div>

            {/* Tipo y Valor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Cantidad Fija (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleChange('value', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step={formData.type === 'percentage' ? '1' : '0.01'}
                  max={formData.type === 'percentage' ? '100' : undefined}
                  required
                />
              </div>
            </div>

            {/* Compra Mínima y Descuento Máximo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Compra Mínima (€)
                </label>
                <input
                  type="number"
                  value={formData.min_purchase || ''}
                  onChange={(e) => handleChange('min_purchase', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="0.01"
                  placeholder="Sin mínimo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Descuento Máximo (€)
                </label>
                <input
                  type="number"
                  value={formData.max_discount || ''}
                  onChange={(e) => handleChange('max_discount', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="0.01"
                  placeholder="Sin límite"
                  disabled={formData.type === 'fixed'}
                />
                {formData.type === 'fixed' && (
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                    No aplica para descuentos fijos
                  </p>
                )}
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleChange('end_date', e.target.value || null)}
                  className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                  min={formData.start_date}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                  Déjalo vacío para códigos sin fecha de expiración
                </p>
              </div>
            </div>

            {/* Límite de uso */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Límite de Uso
              </label>
              <input
                type="number"
                value={formData.usage_limit || ''}
                onChange={(e) => handleChange('usage_limit', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
                placeholder="Sin límite"
              />
              <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                Número máximo de veces que se puede usar este código
              </p>
            </div>

            {/* Aplicación */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Se Aplica A
              </label>
              <select
                value={formData.applies_to}
                onChange={(e) => handleChange('applies_to', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos los productos</option>
                <option value="specific_products">Productos específicos</option>
                <option value="specific_categories">Categorías específicas</option>
              </select>
            </div>

            {/* Restricciones de Usuario */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Restricciones de Usuario
              </label>
              <select
                value={formData.user_restrictions}
                onChange={(e) => handleChange('user_restrictions', e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark-admin:border-slate-700 bg-white dark-admin:bg-slate-900 text-neutral-900 dark-admin:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos los usuarios</option>
                <option value="new_only">Solo nuevos usuarios</option>
                <option value="specific_roles">Roles específicos</option>
              </select>
            </div>

            {/* Roles permitidos */}
            {formData.user_restrictions === 'specific_roles' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Roles Permitidos
                </label>
                <div className="space-y-2">
                  {['admin', 'entrenador', 'academia', 'club', 'alumno'].map((role) => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.allowed_roles?.includes(role)}
                        onChange={(e) => {
                          const currentRoles = formData.allowed_roles || []
                          if (e.target.checked) {
                            handleChange('allowed_roles', [...currentRoles, role])
                          } else {
                            handleChange('allowed_roles', currentRoles.filter((r) => r !== role))
                          }
                        }}
                        className="w-4 h-4 text-green-600 border-neutral-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-neutral-700 dark-admin:text-slate-300 capitalize">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Estado */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="w-4 h-4 text-green-600 border-neutral-300 rounded focus:ring-green-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300">
                Código activo
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-200 dark-admin:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {code ? 'Actualizar' : 'Crear'} Código
          </button>
        </div>
      </div>
    </div>
  )
}
