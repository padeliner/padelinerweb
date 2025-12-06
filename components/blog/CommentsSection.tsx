'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, User, Calendar, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface Comment {
  id: string
  blog_id: string
  user_id: string | null
  parent_comment_id: string | null
  author_name: string
  author_email: string
  content: string
  approved: boolean
  created_at: string
  user?: {
    full_name: string
    avatar_url: string | null
  }
}

interface CommentsSectionProps {
  blogId: string
}

export function CommentsSection({ blogId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadComments()
    
    // Check authentication and load user data
    const loadUserData = async () => {
      setCheckingAuth(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setIsAuthenticated(true)
        const { data: profile } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setAuthorName(profile.full_name || '')
          setAuthorEmail(profile.email || '')
        }
      } else {
        setIsAuthenticated(false)
      }
      setCheckingAuth(false)
    }
    loadUserData()
  }, [blogId])

  const loadComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          user:users(full_name, avatar_url)
        `)
        .eq('blog_id', blogId)
        .eq('approved', true)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading comments:', error)
        throw error
      }
      
      setComments(data || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para comentar')
      return
    }
    
    if (!newComment.trim()) {
      alert('Por favor escribe un comentario')
      return
    }

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Debes iniciar sesión para comentar')
        return
      }

      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_id: blogId,
          user_id: user.id,
          parent_comment_id: null,
          author_name: authorName,
          author_email: authorEmail,
          content: newComment,
          approved: false // Requires admin approval
        })

      if (error) throw error

      setNewComment('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      alert('Error al enviar comentario. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-100 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-neutral-700 dark:text-neutral-700" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-900">
            Comentarios ({comments.length})
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-600">
            Únete a la conversación sobre pádel
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="mb-8">
        {loading ? (
          <div className="bg-white dark:bg-white rounded-2xl border-2 border-neutral-200 dark:border-neutral-300 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
            <p className="text-neutral-600 dark:text-neutral-600 mt-4">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white dark:bg-white rounded-2xl border-2 border-neutral-200 dark:border-neutral-300 p-12 text-center">
            <MessageCircle className="w-16 h-16 text-neutral-300 dark:text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-600 text-lg font-semibold">
              Sé el primero en comentar
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-2">
              Comparte tu opinión sobre este artículo de pádel
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-6 bg-white dark:bg-white rounded-xl border-2 border-neutral-200 dark:border-neutral-300"
              >
                <div className="flex items-start gap-4">
                  {comment.user?.avatar_url ? (
                    <Image
                      src={comment.user.avatar_url}
                      alt={comment.author_name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-neutral-700 dark:text-neutral-700" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-900">
                        {comment.user?.full_name || comment.author_name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-white dark:bg-white rounded-2xl border-2 border-neutral-200 dark:border-neutral-300 p-8">
        <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-900 mb-2">
          Deja tu comentario
        </h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-600 mb-6">
          Tu comentario será revisado antes de publicarse
        </p>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-50 border-2 border-green-200 dark:border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-600" />
            <p className="text-green-800 dark:text-green-800 text-sm">
              ✅ Comentario enviado. Será visible después de ser aprobado por un administrador.
            </p>
          </div>
        )}

        {checkingAuth ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
            <p className="text-neutral-600 mt-4 text-sm">Verificando sesión...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-8">
            <User className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-900 font-semibold text-lg mb-2">
              Inicia sesión para comentar
            </p>
            <p className="text-neutral-600 text-sm mb-6">
              Solo usuarios registrados pueden dejar comentarios
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors"
            >
              Iniciar Sesión
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario sobre este artículo de pádel..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 dark:border-neutral-300 focus:border-neutral-400 focus:outline-none resize-none bg-white dark:bg-white text-neutral-900 dark:text-neutral-900"
                required
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  Comentando como: <span className="font-semibold">{authorName}</span>
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Enviando...' : 'Publicar Comentario'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
