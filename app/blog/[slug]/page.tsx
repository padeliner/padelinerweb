'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Calendar, User, Eye, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { BlogCTA } from '@/components/blog/BlogCTA'
import { NewsletterSubscribe } from '@/components/blog/NewsletterSubscribe'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CommentsSection } from '@/components/blog/CommentsSection'
import * as analytics from '@/lib/analytics'
import { addInternalLinks } from '@/lib/internalLinking'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  category: string
  tags: string[]
  published_at: string
  views_count: number
  seo_title: string | null
  seo_description: string | null
  author: {
    full_name: string
    avatar_url: string | null
    email: string
  } | null
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [scrollDepthTracked, setScrollDepthTracked] = useState<Set<number>>(new Set())
  const [startTime] = useState(Date.now())
  const supabase = createClient()

  useEffect(() => {
    if (params.slug) {
      loadBlog(params.slug as string)
    }
  }, [params.slug])

  // Analytics: Track page view
  useEffect(() => {
    if (blog) {
      analytics.trackBlogView(blog.title, blog.category, calculateReadingTime(blog.content))
    }
  }, [blog])

  // Analytics: Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100]
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollDepthTracked.has(milestone)) {
          analytics.trackScrollDepth(milestone, blog?.title || '')
          setScrollDepthTracked(prev => new Set(prev).add(milestone))
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [blog, scrollDepthTracked])

  // Analytics: Track reading time on unmount
  useEffect(() => {
    return () => {
      if (blog) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000)
        analytics.trackReadingTime(blog.title, timeSpent)
      }
    }
  }, [blog, startTime])

  const loadBlog = async (slug: string) => {
    setLoading(true)
    try {
      // Cargar el blog
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select(`
          *,
          author:users(full_name, avatar_url, email)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (blogError) {
        router.push('/blog')
        return
      }

      setBlog(blogData)

      // Incrementar contador de vistas
      await supabase
        .from('blogs')
        .update({ views_count: (blogData.views_count || 0) + 1 })
        .eq('id', blogData.id)

      // Cargar blogs relacionados (misma categoría)
      const { data: relatedData } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, cover_image, category, published_at')
        .eq('published', true)
        .eq('category', blogData.category)
        .neq('id', blogData.id)
        .limit(3)

      if (relatedData) {
        setRelatedBlogs(relatedData)
      }
    } catch (error) {
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const shareOnSocial = (platform: string) => {
    const url = window.location.href
    const title = blog?.title || ''
    
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      // Track share event
      analytics.trackShare(platform, title)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('¡Enlace copiado al portapapeles!')
  }

  // Calcular tiempo de lectura (200 palabras por minuto)
  const calculateReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return minutes
  }

  // Generar JSON-LD para SEO
  const generateJsonLd = () => {
    if (!blog) return null

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://padeliner.com'
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      image: blog.cover_image || `${baseUrl}/og-image.jpg`,
      datePublished: blog.published_at,
      dateModified: blog.published_at,
      author: {
        '@type': 'Person',
        name: blog.author?.full_name || 'Padeliner',
        url: `${baseUrl}/sobre-nosotros`
      },
      publisher: {
        '@type': 'Organization',
        name: 'Padeliner',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${blog.slug}`
      },
      keywords: blog.tags.join(', '),
      articleSection: blog.category,
      wordCount: blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
      inLanguage: 'es-ES'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-600 text-xl mb-4">Blog no encontrado</p>
            <Link href="/blog" className="text-primary-600 hover:underline">
              Volver al blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const readingTime = calculateReadingTime(blog.content)
  const jsonLd = generateJsonLd()
  
  // Add internal links to content
  const contentWithLinks = addInternalLinks(
    blog.content,
    `/blog/${blog.slug}`,
    5 // Max 5 internal links per blog
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* SEO Meta Tags & JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-neutral-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary-600 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium truncate">{blog.title}</span>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al blog
        </Link>
      </div>

      {/* Article Container with TOC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-3">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-neutral-600 mb-8 pb-8 border-b">
          {blog.author && (
            <div className="flex items-center gap-3">
              {blog.author.avatar_url ? (
                <Image
                  src={blog.author.avatar_url}
                  alt={blog.author.full_name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
              )}
              <div>
                <p className="font-semibold text-neutral-900">{blog.author.full_name}</p>
                <p className="text-sm text-neutral-500">Autor</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(blog.published_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{readingTime} min de lectura</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span>{blog.views_count} vistas</span>
          </div>
        </div>

        {/* Cover Image */}
        {blog.cover_image && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b">
          <span className="text-neutral-600 font-medium flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartir:
          </span>
          <button
            onClick={() => shareOnSocial('facebook')}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </button>
          <button
            onClick={() => shareOnSocial('twitter')}
            className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button
            onClick={() => shareOnSocial('linkedin')}
            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </button>
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-full font-medium transition-colors"
          >
            Copiar enlace
          </button>
        </div>

        {/* Content with Internal Links */}
        <div 
          className="prose prose-lg max-w-none mb-12 blog-content"
          dangerouslySetInnerHTML={{ __html: contentWithLinks }}
        />
        
        <style jsx global>{`
          .blog-content h2 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
            color: #111827;
            line-height: 1.3;
            scroll-margin-top: 100px;
          }
          
          .blog-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #374151;
            line-height: 1.4;
            scroll-margin-top: 100px;
          }
          
          .blog-content p {
            margin-bottom: 1.5rem;
            line-height: 1.75;
            color: #374151;
            font-size: 1.125rem;
          }
          
          .blog-content ul,
          .blog-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
          }
          
          .blog-content li {
            margin-bottom: 0.75rem;
            line-height: 1.75;
          }
          
          .blog-content strong,
          .blog-content b {
            font-weight: 700;
            color: #111827;
          }
          
          .blog-content a {
            color: #059669;
            text-decoration: underline;
            text-decoration-thickness: 2px;
            text-underline-offset: 2px;
            transition: color 0.2s;
          }
          
          .blog-content a:hover {
            color: #047857;
          }
          
          .blog-content blockquote {
            border-left: 4px solid #059669;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: #4b5563;
          }
        `}</style>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-8 border-t">
            <span className="text-neutral-600 font-medium flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags:
            </span>
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
          </article>

          {/* Sidebar with Table of Contents */}
          <aside className="lg:col-span-1 hidden lg:block">
            <TableOfContents content={blog.content} />
          </aside>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogCTA category={blog.category} />
      </div>

      {/* Newsletter Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <NewsletterSubscribe />
      </div>

      {/* Comments Section */}
      <CommentsSection blogId={blog.id} />

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="bg-neutral-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200">
                    {related.cover_image && (
                      <Image
                        src={related.cover_image}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
