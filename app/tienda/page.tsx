'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { useCart } from '@/contexts/CartContext'
import { mockProducts, categories, brands } from '@/lib/mock-data/products'
import { Search, Star, ChevronDown, SlidersHorizontal, ShoppingBag } from 'lucide-react'

export default function TiendaPage() {
  const { totalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('Todas')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')

  // Filtrar productos
  let filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'low' && product.price < 50) ||
                        (priceRange === 'medium' && product.price >= 50 && product.price < 150) ||
                        (priceRange === 'high' && product.price >= 150)
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice
  })

  // Ordenar productos
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'featured') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        showCart={true}
        onCartClick={() => setIsCartOpen(true)}
        cartItemsCount={totalItems}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tienda de Pádel
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Todo lo que necesitas para jugar al mejor nivel
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Todo
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{filteredProducts.length}</span> productos encontrados
            </p>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Marca */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-orange-500 focus:outline-none bg-white text-neutral-900"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            {/* Precio */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-orange-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="all">Todos los precios</option>
                <option value="low">Menos de 50€</option>
                <option value="medium">50€ - 150€</option>
                <option value="high">Más de 150€</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            {/* Ordenar */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border-2 border-neutral-200 rounded-lg focus:border-orange-500 focus:outline-none bg-white text-neutral-900"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valorados</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedBrand('Todas')
                setPriceRange('all')
                setSortBy('featured')
              }}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <p className="text-xl text-neutral-600 mb-4">No se encontraron productos</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedBrand('Todas')
                  setPriceRange('all')
                }}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-neutral-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <div className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          NUEVO
                        </div>
                      )}
                      {product.discount && (
                        <div className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">AGOTADO</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-neutral-500 mb-1">{product.brand}</p>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-neutral-900">{product.rating}</span>
                      <span className="text-sm text-neutral-500">({product.reviewsCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-neutral-900">{product.price}€</span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-400 line-through">{product.originalPrice}€</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
