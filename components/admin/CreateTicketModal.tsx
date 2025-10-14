'use client'

import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

interface CreateTicketModalProps {
  onClose: () => void
  onCreate: () => void
}

interface User {
  id: string
  full_name: string
  email: string
}

export function CreateTicketModal({ onClose, onCreate }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    user_id: '',
    subject: '',
    category: 'general',
    priority: 'media',
    description: '',
  })
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      // Error cargando usuarios
    } finally {
      setLoadingUsers(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.user_id || !formData.subject || !formData.description) {
      alert('❌ Por favor completa todos los campos requeridos')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('✅ Ticket creado correctamente')
        onCreate()
        onClose()
      } else {
        const data = await response.json()
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      alert('❌ Error al crear ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark-admin:border-slate-700">
          <h2 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Crear Nuevo Ticket
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Usuario *
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
              />
            </div>
            {loadingUsers ? (
              <p className="text-sm text-neutral-500 dark-admin:text-slate-400">
                Cargando usuarios...
              </p>
            ) : (
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                required
                size={5}
              >
                <option value="">Selecciona un usuario</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Asunto */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Asunto *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
              required
              placeholder="Ej: Problema con el pago"
            />
          </div>

          {/* Categoría y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                required
              >
                <option value="tecnico">Técnico</option>
                <option value="facturacion">Facturación</option>
                <option value="cuenta">Cuenta</option>
                <option value="general">General</option>
                <option value="bug">Bug</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Prioridad *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                required
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Descripción del problema *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 resize-none"
              required
              placeholder="Describe detalladamente el problema..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 text-neutral-700 dark-admin:text-slate-300 rounded-lg hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {loading ? 'Creando...' : 'Crear Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
