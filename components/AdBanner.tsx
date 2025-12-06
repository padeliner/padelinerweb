'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface AdBannerProps {
  brand: string
  tagline: string
  imageUrl: string
  logoUrl: string
  ctaText: string
  ctaUrl: string
  variant: 'light' | 'dark'
}

export function AdBanner({ brand, tagline, imageUrl, logoUrl, ctaText, ctaUrl, variant }: AdBannerProps) {
  const isLight = variant === 'light'

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Sponsored Label */}
        <div className="flex items-center justify-end mb-2">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">
            Publicidad
          </span>
        </div>

        <motion.a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.005 }}
          className="block"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl h-32 sm:h-40">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${imageUrl}")` }}
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 ${
              isLight 
                ? 'bg-gradient-to-r from-white/95 via-white/80 to-white/40' 
                : 'bg-gradient-to-r from-black/90 via-black/70 to-black/40'
            }`} />

            {/* Content */}
            <div className="relative h-full flex items-center justify-between p-6 sm:p-8">
              <div className={`flex-1 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {/* Brand Logo */}
                <div className="mb-2">
                  <span className="text-lg sm:text-xl font-bold">{logoUrl}</span>
                </div>

                {/* Tagline */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 line-clamp-1">
                  {tagline}
                </h3>

                {/* Brand Name */}
                <p className={`text-sm ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  {brand}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex-shrink-0 ml-4">
                <div
                  className={`
                    flex items-center space-x-2 px-5 py-3 rounded-full font-semibold
                    transition-all duration-200 shadow-lg
                    ${isLight
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'bg-white text-neutral-900 hover:bg-neutral-50'
                    }
                  `}
                >
                  <span className="hidden sm:inline">{ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  )
}
