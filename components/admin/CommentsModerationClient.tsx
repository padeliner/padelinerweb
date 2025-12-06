'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Check, X, Trash2, User, Calendar, Mail, RefreshCw } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface Comment {
  id: string
  blog_id: string
  user_id: string | null
  author_name: string
  author_email: string
  content: string
  approved: boolean
  created_at: string
  blog?: {
    title: string
    slug: string
  }
  user?: {
    full_name: string
    avatar_url: string | null
  }
}

export default function CommentsModerationClient() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')
  const [processing, setProcessing] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadComments()
  }, [filter])

  const loadComments = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('blog_comments')
        .select(`
          *,
          blog:blogs(title, slug),
          user:users(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (filter === 'pending') {
        query = query.eq('approved', false)
      } else if (filter === 'approved') {
        query = query.eq('approved', true)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading comments:', error)
        alert(`Error al cargar comentarios: ${error.message}. ¿Aplicaste la migración SQL?`)
        throw error
      }
      
      console.log('Comentarios cargados:', data)
      setComments(data || [])
    } catch (error: any) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveComment = async (commentId: string) => {
    setProcessing(commentId)
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .eq('id', commentId)

      if (error) throw error
      
      loadComments()
    } catch (error) {
      alert('Error al aprobar comentario')
    } finally {
      setProcessing(null)
    }
  }

  const rejectComment = async (commentId: string) => {
    setProcessing(commentId)
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: false })
        .eq('id', commentId)

      if (error) throw error
      
      loadComments()
    } catch (error) {
      alert('Error al rechazar comentario')
    } finally {
      setProcessing(null)
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario permanentemente?')) return

    setProcessing(commentId)
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      
      loadComments()
    } catch (error) {
      alert('Error al eliminar comentario')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const pendingCount = comments.filter(c => !c.approved).length
  const approvedCount = comments.filter(c => c.approved).length

  return (
    <div className="p-6 bg-neutral-50 dark-admin:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-white mb-2">
                Moderación de Comentarios
              </h1>
              <p className="text-neutral-600 dark-admin:text-slate-400">
                Revisa y aprueba comentarios antes de publicarlos
              </p>
            </div>
            <button
              onClick={loadComments}
              className="p-3 bg-white dark-admin:bg-slate-800 rounded-lg border-2 border-neutral-200 dark-admin:border-slate-700 hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors"
              title="Recargar"
            >
              <RefreshCw className="w-5 h-5 text-neutral-700 dark-admin:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark-admin:bg-slate-800 rounded-xl border-2 border-neutral-200 dark-admin:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark-admin:text-slate-400 mb-1">
                  Total Comentarios
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark-admin:text-white">
                  {comments.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-neutral-100 dark-admin:bg-slate-700 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-neutral-700 dark-admin:text-slate-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark-admin:bg-slate-800 rounded-xl border-2 border-yellow-200 dark-admin:border-yellow-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 dark-admin:text-yellow-400 mb-1">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark-admin:text-yellow-500">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark-admin:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-yellow-600 dark-admin:text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark-admin:bg-slate-800 rounded-xl border-2 border-green-200 dark-admin:border-green-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark-admin:text-green-400 mb-1">
                  Aprobados
                </p>
                <p className="text-3xl font-bold text-green-600 dark-admin:text-green-500">
                  {approvedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark-admin:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600 dark-admin:text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark-admin:bg-slate-800 rounded-xl border-2 border-neutral-200 dark-admin:border-slate-700 p-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-neutral-100 dark-admin:bg-slate-700 text-neutral-600 dark-admin:text-slate-300 hover:bg-neutral-200 dark-admin:hover:bg-slate-600'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-neutral-100 dark-admin:bg-slate-700 text-neutral-600 dark-admin:text-slate-300 hover:bg-neutral-200 dark-admin:hover:bg-slate-600'
              }`}
            >
              Aprobados ({approvedCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-neutral-800 dark-admin:bg-slate-600 text-white'
                  : 'bg-neutral-100 dark-admin:bg-slate-700 text-neutral-600 dark-admin:text-slate-300 hover:bg-neutral-200 dark-admin:hover:bg-slate-600'
              }`}
            >
              Todos ({comments.length})
            </button>
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 dark-admin:border-white mx-auto"></div>
            <p className="text-neutral-600 dark-admin:text-slate-400 mt-4">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white dark-admin:bg-slate-800 rounded-xl border-2 border-neutral-200 dark-admin:border-slate-700 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-neutral-300 dark-admin:text-slate-600 mx-auto mb-4" />
            <p className="text-neutral-600 dark-admin:text-slate-400 text-lg">
              No hay comentarios {filter === 'pending' ? 'pendientes' : filter === 'approved' ? 'aprobados' : ''}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-white dark-admin:bg-slate-800 rounded-xl border-2 p-6 transition-all ${
                  comment.approved
                    ? 'border-green-200 dark-admin:border-green-900'
                    : 'border-yellow-200 dark-admin:border-yellow-900'
                } ${processing === comment.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    {comment.user?.avatar_url ? (
                      <Image
                        src={comment.user.avatar_url}
                        alt={comment.author_name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-100 dark-admin:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-neutral-600 dark-admin:text-slate-400" />
                      </div>
                    )}

                    {/* Comment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-neutral-900 dark-admin:text-white">
                            {comment.user?.full_name || comment.author_name}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-neutral-500 dark-admin:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {comment.author_email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            comment.approved
                              ? 'bg-green-100 dark-admin:bg-green-900/30 text-green-700 dark-admin:text-green-400'
                              : 'bg-yellow-100 dark-admin:bg-yellow-900/30 text-yellow-700 dark-admin:text-yellow-400'
                          }`}
                        >
                          {comment.approved ? '✅ Aprobado' : '⏳ Pendiente'}
                        </span>
                      </div>

                      {/* Blog Title */}
                      {comment.blog && (
                        <div className="mb-3 p-2 bg-neutral-50 dark-admin:bg-slate-700 rounded text-sm">
                          <span className="text-neutral-600 dark-admin:text-slate-400">En: </span>
                          <a
                            href={`/blog/${comment.blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark-admin:text-primary-400 hover:underline font-medium"
                          >
                            {comment.blog.title}
                          </a>
                        </div>
                      )}

                      {/* Comment Content */}
                      <p className="text-neutral-700 dark-admin:text-slate-300 leading-relaxed mb-4">
                        {comment.content}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!comment.approved && (
                          <button
                            onClick={() => approveComment(comment.id)}
                            disabled={processing === comment.id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                            Aprobar
                          </button>
                        )}
                        
                        {comment.approved && (
                          <button
                            onClick={() => rejectComment(comment.id)}
                            disabled={processing === comment.id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Desaprobar
                          </button>
                        )}

                        <button
                          onClick={() => deleteComment(comment.id)}
                          disabled={processing === comment.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
