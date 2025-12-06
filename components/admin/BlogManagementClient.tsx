'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { CreateBlogModal } from './CreateBlogModal'
import { EditBlogModal } from './EditBlogModal'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  category: string
  tags: string[]
  published: boolean
  published_at: string | null
  views_count: number
  created_at: string
  author: {
    full_name: string
    email: string
  }
}

const CATEGORIES = [
  { value: 'all', label: 'Todas' },
  { value: 'tecnica', label: 'Técnica' },
  { value: 'estrategia', label: 'Estrategia' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'salud', label: 'Salud y Fitness' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'noticias', label: 'Noticias' },
]

export function BlogManagementClient() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false)
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false)

  useEffect(() => {
    loadBlogs()
    loadConfig()
  }, [statusFilter, categoryFilter])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/blog/config')
      const data = await response.json()
      if (response.ok) {
        setAutoGenerateEnabled(data.auto_generate_enabled || false)
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
    }
  }

  const toggleAutoGenerate = async () => {
    try {
      const newValue = !autoGenerateEnabled
      const response = await fetch('/api/admin/blog/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto_generate_enabled: newValue })
      })
      const data = await response.json()
      if (response.ok) {
        setAutoGenerateEnabled(newValue)
        alert(`✅ ${data.message}`)
      } else {
        alert('❌ ' + (data.error || 'Error al actualizar configuración'))
      }
    } catch (error) {
      alert('❌ Error al actualizar configuración')
    }
  }

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)

      const response = await fetch(`/api/admin/blog?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      // Error loading blogs
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (blog: Blog) => {
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: blog.id,
          published: !blog.published,
        }),
      })

      if (response.ok) {
        await loadBlogs()
        alert(`Blog ${!blog.published ? 'publicado' : 'despublicado'} correctamente`)
      }
    } catch (error) {
      alert('Error al cambiar el estado del blog')
    }
  }

  const handleDelete = async (blog: Blog) => {
    if (!confirm(`¿Estás seguro de eliminar "${blog.title}"?`)) return

    try {
      const response = await fetch(`/api/admin/blog?id=${blog.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadBlogs()
        alert('Blog eliminado correctamente')
      }
    } catch (error) {
      alert('Error al eliminar el blog')
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString))
  }

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.published).length,
    drafts: blogs.filter(b => !b.published).length,
    totalViews: blogs.reduce((sum, b) => sum + b.views_count, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">
            Gestión de Blog
          </h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">
            Crea y administra artículos de blog con IA
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Crear Blog con IA
          </button>
          <button
            onClick={() => setShowAutoGenerateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            title="Genera blogs automáticos con noticias actuales e imágenes reales"
          >
            <RefreshCw className="w-5 h-5" />
            Auto-Generar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Blogs</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark-admin:bg-blue-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark-admin:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Publicados</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.published}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-green-600 dark-admin:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Borradores</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.drafts}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark-admin:bg-yellow-900/20 rounded-lg">
              <EyeOff className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total Vistas</p>
              <p className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">
                {stats.totalViews}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark-admin:bg-purple-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600 dark-admin:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Generate Toggle */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark-admin:from-slate-800 dark-admin:to-slate-700 rounded-lg border border-green-200 dark-admin:border-slate-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
              <RefreshCw className="w-6 h-6 text-green-600 dark-admin:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100">
                Publicación Automática Diaria
              </h3>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400 mt-1">
                {autoGenerateEnabled 
                  ? '✅ Activo - Se publicará 1 blog automáticamente cada día a las 10:00 AM'
                  : '⏸️ Desactivado - No se publicarán blogs automáticamente'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleAutoGenerate}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              autoGenerateEnabled 
                ? 'bg-green-600' 
                : 'bg-gray-300 dark-admin:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                autoGenerateEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark-admin:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white placeholder:text-neutral-500 dark-admin:placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={loadBlogs}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-neutral-600 dark-admin:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-neutral-600 dark-admin:text-slate-400 mt-4">Cargando blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-600 dark-admin:text-slate-400">No hay blogs</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark-admin:text-slate-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-neutral-900 dark-admin:text-slate-100">
                          {blog.title}
                        </p>
                        <p className="text-sm text-neutral-600 dark-admin:text-slate-400 line-clamp-1">
                          {blog.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary-100 dark-admin:bg-primary-900/20 text-primary-700 dark-admin:text-primary-400 text-xs font-medium rounded-full">
                        {CATEGORIES.find(c => c.value === blog.category)?.label || blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark-admin:bg-green-900/20 text-green-700 dark-admin:text-green-400 text-xs font-medium rounded-full">
                          <Eye className="w-3 h-3" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark-admin:bg-yellow-900/20 text-yellow-700 dark-admin:text-yellow-400 text-xs font-medium rounded-full">
                          <EyeOff className="w-3 h-3" />
                          Borrador
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark-admin:text-slate-400">
                      {blog.views_count}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark-admin:text-slate-400">
                      {formatDate(blog.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          className={`p-2 rounded-lg transition-colors ${
                            blog.published
                              ? 'bg-yellow-100 dark-admin:bg-yellow-900/20 text-yellow-700 dark-admin:text-yellow-400 hover:bg-yellow-200'
                              : 'bg-green-100 dark-admin:bg-green-900/20 text-green-700 dark-admin:text-green-400 hover:bg-green-200'
                          }`}
                          title={blog.published ? 'Despublicar' : 'Publicar'}
                        >
                          {blog.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingBlog(blog)}
                          className="p-2 bg-blue-100 dark-admin:bg-blue-900/20 text-blue-700 dark-admin:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          className="p-2 bg-red-100 dark-admin:bg-red-900/20 text-red-700 dark-admin:text-red-400 rounded-lg hover:bg-red-200 transition-colors"
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
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateBlogModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadBlogs}
        />
      )}

      {editingBlog && (
        <EditBlogModal
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSuccess={loadBlogs}
        />
      )}

      {/* Auto-Generate Selection Modal */}
      {showAutoGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark-admin:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">
                  Auto-Generar Blogs
                </h2>
                <p className="text-sm text-neutral-600 dark-admin:text-slate-400">
                  Selecciona cuántos blogs generar
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[1, 3, 5].map((count) => (
                <button
                  key={count}
                  onClick={async () => {
                    setShowAutoGenerateModal(false)
                    const loadingMsg = `Generando ${count} blog${count > 1 ? 's' : ''}...`
                    alert(loadingMsg + '\n\nEsto puede tardar ' + (count * 10) + ' segundos. Por favor espera.')
                    
                    try {
                      const response = await fetch('/api/admin/blog/auto-generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ count })
                      })
                      const data = await response.json()
                      
                      if (response.ok) {
                        alert(
                          `✅ ${data.message}\n\n` +
                          `📝 Blogs creados: ${data.count}\n` +
                          `${data.blogs.map((b: any, i: number) => `\n${i + 1}. ${b.title}`).join('')}`
                        )
                        await loadBlogs()
                      } else {
                        alert('❌ ' + (data.error || 'Error al generar blogs'))
                      }
                    } catch (error) {
                      alert('❌ Error al generar blogs automáticos')
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark-admin:from-slate-800 dark-admin:to-slate-700 border-2 border-green-200 dark-admin:border-slate-600 rounded-lg hover:border-green-400 dark-admin:hover:border-green-500 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark-admin:bg-green-900/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-green-600 dark-admin:text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-neutral-900 dark-admin:text-slate-100">
                        Generar {count} Blog{count > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-neutral-600 dark-admin:text-slate-400">
                        ~{count * 10} segundos
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark-admin:text-green-400">
                    {count}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAutoGenerateModal(false)}
              className="w-full mt-6 px-4 py-2 bg-neutral-100 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg hover:bg-neutral-200 dark-admin:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
