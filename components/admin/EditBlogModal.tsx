'use client'

import { useState, useEffect } from 'react'
import { X, Save, Image as ImageIcon } from 'lucide-react'

const CATEGORIES = [
  { value: 'tecnica', label: 'Técnica' },
  { value: 'estrategia', label: 'Estrategia' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'salud', label: 'Salud y Fitness' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'general', label: 'General' },
]

interface EditBlogModalProps {
  blog: any
  onClose: () => void
  onSuccess: () => void
}

export function EditBlogModal({ blog, onClose, onSuccess }: EditBlogModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: blog.title || '',
    slug: blog.slug || '',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    cover_image: blog.cover_image || '',
    category: blog.category || 'general',
    tags: blog.tags?.join(', ') || '',
    seo_title: blog.seo_title || '',
    seo_description: blog.seo_description || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: blog.id,
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          cover_image: formData.cover_image || null,
          category: formData.category,
          tags: formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
          seo_title: formData.seo_title || formData.title,
          seo_description: formData.seo_description || formData.excerpt,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar el blog')
      }

      alert('Blog actualizado correctamente')
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el blog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark-admin:bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Editar Blog
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-neutral-600 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400 font-mono text-sm"
            />
            <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-1">
              URL: /blog/{formData.slug}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Resumen
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
              Contenido (HTML) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400 font-mono text-sm resize-none"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Imagen de portada
            </label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => handleChange('cover_image', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Tags (separados por comas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4 pt-4 border-t border-neutral-200 dark-admin:border-slate-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100">
              SEO (Opcional)
            </h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Meta Título (máx. 60 caracteres)
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => handleChange('seo_title', e.target.value)}
                maxLength={60}
                className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
              />
              <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                {formData.seo_title.length}/60 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                Meta Descripción (máx. 160 caracteres)
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => handleChange('seo_description', e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400 resize-none"
              />
              <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                {formData.seo_description.length}/160 caracteres
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border border-neutral-300 dark-admin:border-slate-600 text-neutral-700 dark-admin:text-slate-300 font-semibold rounded-lg hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
