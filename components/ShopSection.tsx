'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Star, Sparkles, Zap, Flame, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const productIconMap: Record<string, React.ReactNode> = {
  flame: <Flame className="w-3 h-3" />,
  star: <Star className="w-3 h-3" />,
  sparkles: <Sparkles className="w-3 h-3" />,
  zap: <Zap className="w-3 h-3" />,
}

const products = [
  {
    id: 1,
    name: 'Pala Profesional X1',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=600',
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 234,
    badge: 'Más vendida',
    badgeIcon: 'flame',
    discount: 24,
  },
  {
    id: 2,
    name: 'Set 3 Pelotas Pro',
    image: 'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=600',
    price: 12.99,
    rating: 4.9,
    reviews: 567,
    badge: 'Mejor valorado',
    badgeIcon: 'star',
  },
  {
    id: 3,
    name: 'Bolsa Deportiva Premium',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 189,
    badge: 'Nuevo',
    badgeIcon: 'sparkles',
    discount: 20,
  },
  {
    id: 4,
    name: 'Zapatillas Court Pro',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    price: 119.99,
    rating: 4.6,
    reviews: 421,
    badge: 'Oferta',
    badgeIcon: 'zap',
  },
]

export function ShopSection() {
  return (
    <section id="tienda" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
              Productos destacados
            </h2>
            <p className="text-lg text-neutral-600">
              Lo mejor para tu juego
            </p>
          </div>
          
          <Link href="/tienda">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-primary-500/30"
            >
              <span>Ver toda la tienda</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-primary-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center space-x-1">
          {productIconMap[product.badgeIcon]}
          <span>{product.badge}</span>
        </div>

        {/* Discount */}
        {product.discount && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}

        {/* Quick Add to Cart (appears on hover) */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full shadow-lg flex items-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isAddedToCart ? '¡Añadido!' : 'Añadir'}</span>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-neutral-900">{product.rating}</span>
          <span className="text-sm text-neutral-500">({product.reviews})</span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-neutral-900 mb-3 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-neutral-900">
              €{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                €{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

