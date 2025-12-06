'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Search, Calendar, User, ArrowRight, Tag, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image: string | null
  category: string
  tags: string[]
  published_at: string
  views_count: number
  author: {
    full_name: string
    avatar_url: string | null
  } | null
}

const CATEGORIES = [
  { value: 'todos', label: 'Todos' },
  { value: 'tecnica', label: 'Técnica' },
  { value: 'estrategia', label: 'Estrategia' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'salud', label: 'Salud y Fitness' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'noticias', label: 'Noticias' },
]

const POSTS_PER_PAGE = 9

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadBlogs()
  }, [selectedCategory, currentPage])

  const loadBlogs = async () => {
    setLoading(true)
    try {
      // Get total count
      let countQuery = supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)

      if (selectedCategory !== 'todos') {
        countQuery = countQuery.eq('category', selectedCategory)
      }

      const { count } = await countQuery
      setTotalCount(count || 0)

      // Get paginated data
      const from = (currentPage - 1) * POSTS_PER_PAGE
      const to = from + POSTS_PER_PAGE - 1

      let query = supabase
        .from('blogs')
        .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image,
          category,
          tags,
          published_at,
          views_count,
          author:users(full_name, avatar_url)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(from, to)

      if (selectedCategory !== 'todos') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setBlogs(data || [])
    } catch (error) {
      // Error loading blogs
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Blog de Padeliner
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Consejos, técnicas y noticias del mundo del pádel
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por título, contenido o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4 text-sm text-neutral-600">
            <p>
              Mostrando <span className="font-semibold">{filteredBlogs.length}</span> de <span className="font-semibold">{totalCount}</span> artículos
              {selectedCategory !== 'todos' && (
                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                </span>
              )}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
            <p className="text-sm font-semibold text-neutral-700 mb-3">Categorías:</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    selectedCategory === category.value
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {category.label}
                  {selectedCategory === category.value && category.value !== 'todos' && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-neutral-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded" />
                  <div className="h-4 bg-neutral-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-xl">No se encontraron artículos</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                  {blog.cover_image ? (
                    <Image
                      src={blog.cover_image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white text-primary-600 text-sm font-semibold rounded-full shadow-lg">
                      {CATEGORIES.find(c => c.value === blog.category)?.label || blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.published_at)}</span>
                    </div>
                    {blog.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{blog.author.full_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-neutral-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Leer más</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and 2 pages around current
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .map((page, index, array) => {
                    // Add ellipsis
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return [
                        <span key={`ellipsis-${page}`} className="px-3 py-2 text-neutral-400">
                          ...
                        </span>,
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {page}
                        </button>
                      ]
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
