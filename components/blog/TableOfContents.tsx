'use client'

import { useEffect, useState } from 'react'
import { List, ChevronRight } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Wait for content to be rendered in the DOM
    const timer = setTimeout(() => {
      // Get headings directly from the rendered DOM
      const contentElement = document.querySelector('.blog-content')
      if (!contentElement) return
      
      const headings = contentElement.querySelectorAll('h2, h3')
      
      const items: TocItem[] = []
      headings.forEach((heading, index) => {
        let id = heading.id
        
        // If no ID exists, create one from the text
        if (!id) {
          id = heading.textContent
            ?.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            || `heading-${index}`
          heading.id = id
        }
        
        items.push({
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        })
      })
      
      setTocItems(items)
    }, 100) // Small delay to ensure DOM is ready
    
    return () => clearTimeout(timer)
  }, [content])

  useEffect(() => {
    // Track which heading is currently visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div className="sticky top-24 bg-white dark:bg-white rounded-2xl border-2 border-neutral-200 dark:border-neutral-300 p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-300">
        <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-100 rounded-lg flex items-center justify-center">
          <List className="w-5 h-5 text-neutral-700 dark:text-neutral-700" />
        </div>
        <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-900">
          Índice
        </h3>
      </div>

      <nav className="space-y-1">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-start gap-2
              ${item.level === 3 ? 'pl-6' : ''}
              ${
                activeId === item.id
                  ? 'bg-neutral-100 dark:bg-neutral-100 text-neutral-900 dark:text-neutral-900 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-50 hover:text-neutral-900 dark:hover:text-neutral-900'
              }
            `}
          >
            <ChevronRight 
              className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-transform ${
                activeId === item.id ? 'rotate-90 text-neutral-700 dark:text-neutral-700' : ''
              }`}
            />
            <span className="line-clamp-2">{item.text}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-300">
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          💡 Haz clic en cualquier título para saltar a esa sección
        </p>
      </div>
    </div>
  )
}
