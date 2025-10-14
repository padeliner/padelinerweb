'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FileText, Eye, Copy } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  description: string | null
  subject: string
  html_content: string
  category: string
  is_active: boolean
  created_at: string
}

export function EmailTemplatesTab() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/email-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      bienvenida: 'bg-blue-100 text-blue-800 dark-admin:bg-blue-900/20 dark-admin:text-blue-400',
      verificacion: 'bg-green-100 text-green-800 dark-admin:bg-green-900/20 dark-admin:text-green-400',
      notificacion: 'bg-yellow-100 text-yellow-800 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400',
      marketing: 'bg-purple-100 text-purple-800 dark-admin:bg-purple-900/20 dark-admin:text-purple-400',
      soporte: 'bg-orange-100 text-orange-800 dark-admin:bg-orange-900/20 dark-admin:text-orange-400',
      general: 'bg-gray-100 text-gray-800 dark-admin:bg-slate-700 dark-admin:text-slate-300',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category] || colors.general}`}>
        {category}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark-admin:text-slate-400">Cargando plantillas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Plantillas de Email
          </h2>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
            Gestiona y crea plantillas reutilizables
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      {/* Grid de plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-2">
                  {template.name}
                </h3>
                {getCategoryBadge(template.category)}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-blue-600 dark-admin:text-blue-400 hover:bg-blue-50 dark-admin:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Ver"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-neutral-600 dark-admin:text-slate-400 hover:bg-neutral-50 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copiar HTML"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-orange-600 dark-admin:text-orange-400 hover:bg-orange-50 dark-admin:hover:bg-orange-900/20 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-red-600 dark-admin:text-red-400 hover:bg-red-50 dark-admin:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {template.description && (
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400 mb-4">
                {template.description}
              </p>
            )}

            <div className="pt-4 border-t border-neutral-200 dark-admin:border-slate-700">
              <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-1">
                Asunto:
              </p>
              <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                {template.subject}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark-admin:text-slate-400">
              <span>{template.is_active ? '✅ Activa' : '❌ Inactiva'}</span>
              <span>
                {new Date(template.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700">
          <FileText className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500 mx-auto mb-4" />
          <p className="text-neutral-600 dark-admin:text-slate-400">
            No hay plantillas creadas aún
          </p>
          <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-2">
            Crea tu primera plantilla para agilizar el envío de emails
          </p>
        </div>
      )}
    </div>
  )
}
