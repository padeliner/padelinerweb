'use client'

import { useState, useMemo } from 'react'
import { Search, Package, Eye, Edit2, ShoppingBag, DollarSign, TrendingUp, AlertCircle, Trash2, X, CheckCircle } from 'lucide-react'
import { ProductFormModal } from './ProductFormModal'

interface Product {
  id: string
  name: string
  slug: string
  description_short: string
  description_long: string
  category: 'palas' | 'zapatillas' | 'ropa' | 'accesorios'
  brand: string
  price: number
  discount_price: number | null
  price_by_role: {
    admin?: number
    entrenador?: number
    academia?: number
    club?: number
    alumno?: number
    certificado?: number
  }
  stock: number
  sku: string
  images: string[]
  colors: string[]
  sizes: string[]
  weight: string
  dimensions: string
  features: string[]
  sales: number
  rating: number
  reviews_count: number
  status: 'active' | 'inactive' | 'out_of_stock'
  is_featured: boolean
  created_at: string
  updated_at: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bullpadel Vertex 03',
    slug: 'bullpadel-vertex-03',
    description_short: 'Pala de alto rendimiento con forma de diamante para jugadores profesionales',
    description_long: 'La Bullpadel Vertex 03 es la pala oficial de los mejores jugadores del World Padel Tour. Diseñada con tecnología AIR REACT CHANNEL y núcleo BLACK EVA para máxima potencia y control.',
    category: 'palas',
    brand: 'Bullpadel',
    price: 289.95,
    discount_price: null,
    price_by_role: {
      academia: 249.95,
      entrenador: 259.95,
      certificado: 269.95
    },
    stock: 15,
    sku: 'BP-VERTEX-03',
    images: ['/products/pala1-1.jpg', '/products/pala1-2.jpg', '/products/pala1-3.jpg'],
    colors: ['Negro', 'Rojo'],
    sizes: [],
    weight: '365g',
    dimensions: '45.5 x 26 cm',
    features: ['Forma diamante', 'Núcleo Black EVA', 'Marco carbono 100%', 'Rugosidad 3D'],
    sales: 47,
    rating: 4.8,
    reviews_count: 32,
    status: 'active',
    is_featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-10-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Adidas Metalbone 3.2',
    slug: 'adidas-metalbone-32',
    description_short: 'La pala preferida de Ale Galán con tecnología Dual Exoskeleton',
    description_long: 'Adidas Metalbone 3.2 combina potencia extrema con control gracias a su núcleo EVA High Memory y marco de carbono reforzado. Incluye la tecnología SPIN BLADE para efectos potentes.',
    category: 'palas',
    brand: 'Adidas',
    price: 349.00,
    discount_price: 319.00,
    price_by_role: {
      academia: 299.00,
      entrenador: 309.00,
      club: 314.00,
      certificado: 314.00
    },
    stock: 8,
    sku: 'AD-MB-32',
    images: ['/products/pala2-1.jpg', '/products/pala2-2.jpg'],
    colors: ['Azul', 'Plateado'],
    sizes: [],
    weight: '365g',
    dimensions: '45.5 x 26 cm',
    features: ['Dual Exoskeleton', 'EVA High Memory', 'Spin Blade', 'Smart Holes Curve'],
    sales: 32,
    rating: 4.9,
    reviews_count: 28,
    status: 'active',
    is_featured: true,
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-10-05T14:30:00Z'
  },
  {
    id: '3',
    name: 'Asics Gel-Padel Pro 4',
    slug: 'asics-gel-padel-pro-4',
    description_short: 'Zapatillas específicas para pádel con tecnología GEL™',
    description_long: 'Las Asics Gel-Padel Pro 4 ofrecen máxima estabilidad y amortiguación gracias a la tecnología GEL™ en talón y antepié. Suela Herringbone para mejor tracción en pistas de pádel.',
    category: 'zapatillas',
    brand: 'Asics',
    price: 125.00,
    discount_price: null,
    price_by_role: {
      academia: 105.00,
      certificado: 115.00
    },
    stock: 0,
    sku: 'AS-GP4',
    images: ['/products/zapatillas1.jpg'],
    colors: ['Blanco/Azul', 'Negro/Verde'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    weight: '320g',
    dimensions: 'Tallas 39-45',
    features: ['GEL™ Technology', 'Suela Herringbone', 'AHAR+ rubber', 'Trusstic System'],
    sales: 68,
    rating: 4.6,
    reviews_count: 45,
    status: 'out_of_stock',
    is_featured: false,
    created_at: '2024-03-10T14:30:00Z',
    updated_at: '2024-10-10T09:00:00Z'
  }
]

export function StoreManagementClient() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    totalSales: products.reduce((sum, p) => sum + p.sales, 0)
  }), [products])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchTerm, categoryFilter, statusFilter])

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { label: string; color: string }> = {
      palas: { label: 'Palas', color: 'bg-blue-100 text-blue-700 dark-admin:bg-blue-900/20 dark-admin:text-blue-400' },
      zapatillas: { label: 'Zapatillas', color: 'bg-purple-100 text-purple-700 dark-admin:bg-purple-900/20 dark-admin:text-purple-400' },
      ropa: { label: 'Ropa', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
      accesorios: { label: 'Accesorios', color: 'bg-orange-100 text-orange-700 dark-admin:bg-orange-900/20 dark-admin:text-orange-400' }
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${categories[category].color}`}>{categories[category].label}</span>
  }

  const getStatusBadge = (status: string, stock: number) => {
    if (status === 'out_of_stock' || stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400">Agotado</span>
    }
    if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400">Stock Bajo</span>
    }
    if (status === 'active') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400">Activo</span>
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark-admin:bg-gray-900/20 dark-admin:text-gray-400">Inactivo</span>
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Actualizar producto existente
      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } as Product : p))
      alert('Producto actualizado correctamente')
    } else {
      // Crear nuevo producto
      const newProduct = productData as Product
      setProducts([...products, newProduct])
      alert('Producto creado correctamente')
    }
    setEditingProduct(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowFormModal(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId))
      alert('Producto eliminado correctamente')
    }
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setShowFormModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Tienda</h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra el catálogo de productos (DATOS MOCK)</p>
        </div>
        <button 
          onClick={handleNewProduct}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total</p>
              <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Activos</p>
              <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.active}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Agotados</p>
              <p className="text-2xl font-bold text-red-600 dark-admin:text-red-400 mt-1">{stats.outOfStock}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Valor Stock</p>
              <p className="text-xl font-bold text-purple-600 dark-admin:text-purple-400 mt-1">€{stats.totalValue.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Ventas</p>
              <p className="text-2xl font-bold text-orange-600 dark-admin:text-orange-400 mt-1">{stats.totalSales}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todas las categorías</option>
            <option value="palas">Palas</option>
            <option value="zapatillas">Zapatillas</option>
            <option value="ropa">Ropa</option>
            <option value="accesorios">Accesorios</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="out_of_stock">Agotados</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Marca</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Precio</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Ventas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-lg bg-neutral-100 dark-admin:bg-slate-900 flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                            }}
                          />
                        ) : (
                          <Package className="w-8 h-8 text-neutral-400 dark-admin:text-slate-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{product.name}</div>
                        <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(product.category)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark-admin:text-slate-100">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-900 dark-admin:text-slate-100">€{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600 dark-admin:text-red-400' : product.stock < 10 ? 'text-yellow-600 dark-admin:text-yellow-400' : 'text-neutral-900 dark-admin:text-slate-100'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-neutral-500 dark-admin:text-slate-400">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(product.status, product.stock)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => { setSelectedProduct(product); setShowModal(true); }}
                        className="p-2 text-blue-600 dark-admin:text-blue-400 hover:bg-blue-50 dark-admin:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-green-600 dark-admin:text-green-400 hover:bg-green-50 dark-admin:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 dark-admin:text-red-400 hover:bg-red-50 dark-admin:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white dark-admin:bg-slate-800 border-b border-neutral-200 dark-admin:border-slate-700 p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">Vista Previa del Producto</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500 dark-admin:text-slate-400" />
              </button>
            </div>

            {/* Product Content - Estilo E-commerce */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Galería de Imágenes */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg bg-neutral-100 dark-admin:bg-slate-900 overflow-hidden">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" text-anchor="middle" x="200" y="200"%3ESin imagen%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-24 h-24 text-neutral-400 dark-admin:text-slate-500" />
                      </div>
                    )}
                  </div>
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((img, index) => (
                        <div key={index} className="aspect-square rounded-lg bg-neutral-100 dark-admin:bg-slate-900 overflow-hidden">
                          <img src={img} alt={`${selectedProduct.name} ${index + 2}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="space-y-6">
                  {/* Título y Marca */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryBadge(selectedProduct.category)}
                      {selectedProduct.is_featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">{selectedProduct.name}</h1>
                    <p className="text-lg text-neutral-600 dark-admin:text-slate-400 mt-1">{selectedProduct.brand}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300 dark-admin:text-slate-600'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600 dark-admin:text-slate-400">
                      {selectedProduct.rating} ({selectedProduct.reviews_count} reseñas)
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="flex items-baseline gap-3">
                    {selectedProduct.discount_price ? (
                      <>
                        <span className="text-4xl font-bold text-green-600 dark-admin:text-green-400">
                          €{selectedProduct.discount_price.toFixed(2)}
                        </span>
                        <span className="text-2xl text-neutral-400 dark-admin:text-slate-500 line-through">
                          €{selectedProduct.price.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark-admin:bg-red-900/20 text-red-600 dark-admin:text-red-400 text-sm font-medium rounded">
                          -{Math.round((1 - selectedProduct.discount_price / selectedProduct.price) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-neutral-900 dark-admin:text-slate-100">
                        €{selectedProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Descripción Corta */}
                  <p className="text-neutral-700 dark-admin:text-slate-300">{selectedProduct.description_short}</p>

                  {/* Stock y SKU */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600 dark-admin:text-slate-400">Stock:</span>
                      <span className={`font-medium ${selectedProduct.stock > 10 ? 'text-green-600 dark-admin:text-green-400' : selectedProduct.stock > 0 ? 'text-yellow-600 dark-admin:text-yellow-400' : 'text-red-600 dark-admin:text-red-400'}`}>
                        {selectedProduct.stock} unidades
                      </span>
                    </div>
                    <span className="text-neutral-400">•</span>
                    <div>
                      <span className="text-neutral-600 dark-admin:text-slate-400">SKU:</span>
                      <span className="ml-2 font-mono text-neutral-900 dark-admin:text-slate-100">{selectedProduct.sku}</span>
                    </div>
                  </div>

                  {/* Colores */}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">Colores disponibles:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((color, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-neutral-100 dark-admin:bg-slate-900 text-neutral-700 dark-admin:text-slate-300 rounded-full text-sm"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tallas */}
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">Tallas disponibles:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 border-2 border-neutral-300 dark-admin:border-slate-600 text-neutral-700 dark-admin:text-slate-300 rounded-lg text-sm font-medium hover:border-green-500 transition-colors"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Especificaciones */}
                  {(selectedProduct.weight || selectedProduct.dimensions) && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark-admin:border-slate-700">
                      {selectedProduct.weight && (
                        <div>
                          <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Peso</p>
                          <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100 mt-1">{selectedProduct.weight}</p>
                        </div>
                      )}
                      {selectedProduct.dimensions && (
                        <div>
                          <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Dimensiones</p>
                          <p className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100 mt-1">{selectedProduct.dimensions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción Larga y Características */}
              <div className="mt-8 space-y-6">
                {/* Descripción */}
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-3">Descripción</h3>
                  <p className="text-neutral-700 dark-admin:text-slate-300 leading-relaxed">{selectedProduct.description_long}</p>
                </div>

                {/* Características */}
                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-3">Características</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedProduct.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-neutral-700 dark-admin:text-slate-300"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 dark-admin:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stats del Admin */}
                <div className="bg-neutral-50 dark-admin:bg-slate-900 rounded-lg p-4 border border-neutral-200 dark-admin:border-slate-700">
                  <h4 className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-3">Estadísticas (Admin)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Ventas Totales</p>
                      <p className="text-lg font-bold text-neutral-900 dark-admin:text-slate-100">{selectedProduct.sales}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Valor en Stock</p>
                      <p className="text-lg font-bold text-purple-600 dark-admin:text-purple-400">
                        €{(selectedProduct.price * selectedProduct.stock).toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Estado</p>
                      <div className="mt-1">{getStatusBadge(selectedProduct.status, selectedProduct.stock)}</div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Creado</p>
                      <p className="text-sm text-neutral-700 dark-admin:text-slate-300">
                        {new Date(selectedProduct.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con acciones */}
            <div className="sticky bottom-0 bg-white dark-admin:bg-slate-800 border-t border-neutral-200 dark-admin:border-slate-700 p-4 flex justify-between items-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  handleEditProduct(selectedProduct)
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showFormModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setShowFormModal(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  )
}
