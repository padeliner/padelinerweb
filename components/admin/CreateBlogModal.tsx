'use client'

import { useState } from 'react'
import { X, Sparkles, Loader2, FileText, Tag, Image as ImageIcon } from 'lucide-react'

const CATEGORIES = [
  { value: 'tecnica', label: 'Técnica' },
  { value: 'estrategia', label: 'Estrategia' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'salud', label: 'Salud y Fitness' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'general', label: 'General' },
]

const TONES = [
  { value: 'profesional', label: 'Profesional' },
  { value: 'casual', label: 'Casual' },
  { value: 'motivador', label: 'Motivador' },
  { value: 'educativo', label: 'Educativo' },
]

interface CreateBlogModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateBlogModal({ onClose, onSuccess }: CreateBlogModalProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Input form data
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [category, setCategory] = useState('general')
  const [tone, setTone] = useState('profesional')
  
  // Generated blog data
  const [generatedBlog, setGeneratedBlog] = useState<any>(null)
  const [coverImage, setCoverImage] = useState('')

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Por favor ingresa un tema')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords,
          category,
          tone,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al generar el blog')
      }

      const data = await response.json()
      setGeneratedBlog(data.blog)
      setStep('preview')
    } catch (error: any) {
      alert(error.message || 'Error al generar el blog')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async (published: boolean) => {
    if (!generatedBlog) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedBlog,
          cover_image: coverImage || null,
          published,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar el blog')
      }

      alert(`Blog ${published ? 'publicado' : 'guardado como borrador'} correctamente`)
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.message || 'Error al guardar el blog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark-admin:bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">
                Crear Blog con IA
              </h2>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">
                {step === 'input' ? 'Paso 1: Ingresa los detalles' : 'Paso 2: Revisa y publica'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={generating || saving}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-neutral-600 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'input' ? (
            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Tema del artículo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Técnicas avanzadas de remate en pádel, Cómo mejorar tu derecha, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400 resize-none"
                />
                <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-1">
                  Describe sobre qué quieres que trate el artículo
                </p>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Palabras clave (opcional)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Ej: remate, técnica, potencia, control"
                  className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
                />
                <p className="text-sm text-neutral-500 dark-admin:text-slate-400 mt-1">
                  Separa las palabras clave con comas
                </p>
              </div>

              {/* Category and Tone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    Tono
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white"
                  >
                    {TONES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={generating || !topic.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando con IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generar Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagen de portada (opcional)
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
                />
              </div>

              {/* Generated Content Preview */}
              <div className="bg-neutral-50 dark-admin:bg-slate-800 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider mb-2">
                    Título
                  </label>
                  <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">
                    {generatedBlog?.title}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider mb-2">
                    Resumen
                  </label>
                  <p className="text-neutral-700 dark-admin:text-slate-300">
                    {generatedBlog?.excerpt}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {generatedBlog?.tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 dark-admin:bg-primary-900/20 text-primary-700 dark-admin:text-primary-400 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Contenido (Vista previa)
                  </label>
                  <div 
                    className="prose prose-sm dark-admin:prose-invert max-w-none bg-white dark-admin:bg-slate-950 p-4 rounded-lg max-h-96 overflow-y-auto text-neutral-900 dark-admin:text-white"
                    dangerouslySetInnerHTML={{ __html: generatedBlog?.content || '' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark-admin:border-slate-700">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider mb-1">
                      SEO Título
                    </label>
                    <p className="text-sm text-neutral-700 dark-admin:text-slate-300">
                      {generatedBlog?.seo_title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider mb-1">
                      SEO Descripción
                    </label>
                    <p className="text-sm text-neutral-700 dark-admin:text-slate-300">
                      {generatedBlog?.seo_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep('input')}
                  disabled={saving}
                  className="px-6 py-3 border border-neutral-300 dark-admin:border-slate-600 text-neutral-700 dark-admin:text-slate-300 font-semibold rounded-lg hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Volver
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="px-6 py-3 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Guardando...' : 'Guardar Borrador'}
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Publicando...' : 'Publicar Ahora'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
