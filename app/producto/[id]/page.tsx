'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { mockProducts } from '@/lib/mock-data/products'
import { Star, ArrowLeft, ShoppingCart, Heart, Share2, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react'

const mockReviews = [
  { id: 1, userName: "Carlos M.", rating: 5, date: "Hace 1 semana", comment: "Producto excepcional. Superó mis expectativas.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: 2, userName: "Ana L.", rating: 5, date: "Hace 2 semanas", comment: "Muy buena calidad. Lo recomiendo 100%.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: 3, userName: "Miguel R.", rating: 4, date: "Hace 3 semanas", comment: "Buena compra, llegó rápido y bien empaquetado.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
]

export default function ProductoPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  const product = mockProducts.find(p => p.id === productId)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Producto no encontrado</h1>
          <Link href="/tienda" className="text-orange-600 hover:text-orange-700 font-semibold">Volver a la tienda</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/tienda" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver a la tienda</span>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 bg-neutral-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-orange-500' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-24 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div>
              {/* Badges */}
              <div className="flex items-center space-x-2 mb-4">
                {product.isNew && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">NUEVO</span>
                )}
                {product.discount && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">-{product.discount}%</span>
                )}
                {!product.inStock && (
                  <span className="px-3 py-1 bg-neutral-500 text-white text-sm font-bold rounded-full">AGOTADO</span>
                )}
              </div>

              {/* Brand */}
              <p className="text-sm text-neutral-500 mb-2">{product.brand}</p>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-neutral-900">{product.rating}</span>
                <span className="text-neutral-500">({product.reviewsCount} valoraciones)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-neutral-900">{product.price}€</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-neutral-400 line-through">{product.originalPrice}€</span>
                  )}
                </div>
                {product.discount && (
                  <p className="text-green-600 font-semibold mt-1">Ahorras {product.originalPrice! - product.price}€</p>
                )}
              </div>

              {/* Description */}
              <p className="text-neutral-700 leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-bold text-neutral-900 mb-3">Características principales:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Actions */}
              <div className="border-t border-neutral-200 pt-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="font-semibold text-neutral-900">Cantidad:</label>
                  <div className="flex items-center border-2 border-neutral-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-neutral-100 font-bold text-neutral-700"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-neutral-100 font-bold text-neutral-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    disabled={!product.inStock}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
                      product.inStock
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.inStock ? 'Añadir al carrito' : 'Agotado'}</span>
                  </button>
                  
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`px-6 py-4 border-2 rounded-xl transition-all ${
                      isFavorite
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-neutral-200 hover:border-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-neutral-600'}`} />
                  </button>

                  <button className="px-6 py-4 border-2 border-neutral-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                    <Share2 className="w-6 h-6 text-neutral-600" />
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                  <Truck className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">Envío gratis</p>
                    <p className="text-xs text-neutral-600">Pedidos +50€</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                  <Shield className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">Pago seguro</p>
                    <p className="text-xs text-neutral-600">100% protegido</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                  <RotateCcw className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">Devolución</p>
                    <p className="text-xs text-neutral-600">30 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Valoraciones ({product.reviewsCount})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="p-6 bg-neutral-50 rounded-xl">
                <div className="flex items-start space-x-4">
                  <img src={review.avatar} alt={review.userName} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-neutral-900">{review.userName}</h3>
                      <span className="text-sm text-neutral-500">{review.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                    <p className="text-neutral-700 text-sm">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-neutral-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/producto/${relProduct.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 bg-neutral-100 rounded-t-xl overflow-hidden">
                    <img src={relProduct.imageUrl} alt={relProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-neutral-500 mb-1">{relProduct.brand}</p>
                    <h3 className="font-bold text-neutral-900 mb-2 line-clamp-2">{relProduct.name}</h3>
                    <p className="text-xl font-bold text-neutral-900">{relProduct.price}€</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
