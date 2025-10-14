'use client'

import { useState, useMemo } from 'react'
import { Search, Package, Eye, Edit2, ShoppingBag, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: 'palas' | 'zapatillas' | 'ropa' | 'accesorios'
  brand: string
  price: number
  stock: number
  sales: number
  image_url: string
  status: 'active' | 'inactive' | 'out_of_stock'
  created_at: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bullpadel Vertex 03',
    category: 'palas',
    brand: 'Bullpadel',
    price: 289.95,
    stock: 15,
    sales: 47,
    image_url: '/products/pala1.jpg',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Adidas Metalbone 3.2',
    category: 'palas',
    brand: 'Adidas',
    price: 349.00,
    stock: 8,
    sales: 32,
    image_url: '/products/pala2.jpg',
    status: 'active',
    created_at: '2024-02-20T09:00:00Z'
  },
  {
    id: '3',
    name: 'Asics Gel-Padel Pro 4',
    category: 'zapatillas',
    brand: 'Asics',
    price: 125.00,
    stock: 0,
    sales: 68,
    image_url: '/products/zapatillas1.jpg',
    status: 'out_of_stock',
    created_at: '2024-03-10T14:30:00Z'
  },
  {
    id: '4',
    name: 'Camiseta Técnica Pro',
    category: 'ropa',
    brand: 'Bullpadel',
    price: 39.95,
    stock: 45,
    sales: 124,
    image_url: '/products/camiseta1.jpg',
    status: 'active',
    created_at: '2024-04-05T11:20:00Z'
  },
  {
    id: '5',
    name: 'Mochila Padel Tour',
    category: 'accesorios',
    brand: 'Head',
    price: 79.90,
    stock: 22,
    sales: 56,
    image_url: '/products/mochila1.jpg',
    status: 'active',
    created_at: '2024-05-12T16:45:00Z'
  },
  {
    id: '6',
    name: 'Nox ML10 Pro Cup',
    category: 'palas',
    brand: 'Nox',
    price: 299.00,
    stock: 12,
    sales: 41,
    image_url: '/products/pala3.jpg',
    status: 'active',
    created_at: '2024-06-18T08:30:00Z'
  },
  {
    id: '7',
    name: 'Short Deportivo Elite',
    category: 'ropa',
    brand: 'Adidas',
    price: 44.95,
    stock: 35,
    sales: 89,
    image_url: '/products/short1.jpg',
    status: 'active',
    created_at: '2024-07-22T13:15:00Z'
  },
  {
    id: '8',
    name: 'Grip Profesional x3',
    category: 'accesorios',
    brand: 'Wilson',
    price: 12.90,
    stock: 150,
    sales: 287,
    image_url: '/products/grip1.jpg',
    status: 'active',
    created_at: '2024-08-01T10:00:00Z'
  }
]

export function ProductsManagementClient() {
  const [products] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Productos</h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra el catálogo de la tienda (DATOS MOCK)</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 dark-admin:bg-slate-900 flex items-center justify-center">
                        <Package className="w-6 h-6 text-neutral-400 dark-admin:text-slate-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{product.name}</div>
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
                        className="p-2 text-green-600 dark-admin:text-green-400 hover:bg-green-50 dark-admin:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
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
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100 mb-4">Detalles del Producto</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 rounded-lg bg-neutral-100 dark-admin:bg-slate-900 flex items-center justify-center">
                  <Package className="w-12 h-12 text-neutral-400 dark-admin:text-slate-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900 dark-admin:text-slate-100">{selectedProduct.name}</h3>
                  <p className="text-sm text-neutral-500 dark-admin:text-slate-400">{selectedProduct.brand}</p>
                  <div className="mt-2">{getCategoryBadge(selectedProduct.category)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark-admin:border-slate-700">
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Precio</p>
                  <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400">€{selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Stock Disponible</p>
                  <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Unidades Vendidas</p>
                  <p className="text-lg font-medium text-neutral-900 dark-admin:text-slate-100">{selectedProduct.sales}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark-admin:text-slate-400">Estado</p>
                  <div className="mt-1">{getStatusBadge(selectedProduct.status, selectedProduct.stock)}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark-admin:border-slate-700">
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mb-2">Valor Total en Stock</p>
                <p className="text-xl font-bold text-purple-600 dark-admin:text-purple-400">
                  €{(selectedProduct.price * selectedProduct.stock).toFixed(2)}
                </p>
              </div>

              <div className="flex space-x-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Editar Producto
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Actualizar Stock
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Desactivar
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full px-4 py-2 bg-neutral-100 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
