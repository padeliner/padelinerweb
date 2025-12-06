import { ImageResponse } from 'next/og'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'
export const alt = 'Blog de Pádel - Padeliner'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('title, excerpt, category, cover_image')
    .eq('slug', params.slug)
    .single()

  if (!blog) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div style={{ fontSize: 60, color: 'white' }}>
            Blog no encontrado
          </div>
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 60,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '12px 24px',
              borderRadius: 25,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#667eea',
              textTransform: 'uppercase',
            }}
          >
            {blog.category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.2,
            marginBottom: 20,
            display: 'flex',
          }}
        >
          {blog.title}
        </div>

        {/* Excerpt */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.4,
            marginBottom: 40,
            display: 'flex',
          }}
        >
          {blog.excerpt?.substring(0, 120)}...
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            🎾 Padeliner.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
