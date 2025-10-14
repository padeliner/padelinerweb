'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Upload } from 'lucide-react'

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

interface Props {
  product: Product | null
  onClose: () => void
  onSave: (product: Partial<Product>) => void
}

export function ProductFormModal({ product, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description_short: product?.description_short || '',
    description_long: product?.description_long || '',
    category: product?.category || 'palas' as const,
    brand: product?.brand || '',
    price: product?.price || 0,
    discount_price: product?.discount_price || null,
    price_by_role: product?.price_by_role || {},
    stock: product?.stock || 0,
    sku: product?.sku || '',
    images: product?.images || [],
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    weight: product?.weight || '',
    dimensions: product?.dimensions || '',
    features: product?.features || [],
    status: product?.status || 'active' as const,
    is_featured: product?.is_featured || false
  })

  const [newImage, setNewImage] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newFeature, setNewFeature] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData: any = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      updated_at: new Date().toISOString()
    }

    if (!product) {
      productData.id = Date.now().toString()
      productData.created_at = new Date().toISOString()
      productData.sales = 0
      productData.rating = 0
      productData.reviews_count = 0
    }

    onSave(productData)
    onClose()
  }

  const addItem = (type: 'image' | 'color' | 'size' | 'feature', value: string) => {
    if (!value.trim()) return
    
    switch(type) {
      case 'image':
        setFormData({ ...formData, images: [...formData.images, value] })
        setNewImage('')
        break
      case 'color':
        setFormData({ ...formData, colors: [...formData.colors, value] })
        setNewColor('')
        break
      case 'size':
        setFormData({ ...formData, sizes: [...formData.sizes, value] })
        setNewSize('')
        break
      case 'feature':
        setFormData({ ...formData, features: [...formData.features, value] })
        setNewFeature('')
        break
    }
  }

  const removeItem = (type: 'image' | 'color' | 'size' | 'feature', index: number) => {
    switch(type) {
      case 'image':
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
        break
      case 'color':
        setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== index) })
        break
      case 'size':
        setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== index) })
        break
      case 'feature':
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
        break
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark-admin:bg-slate-800 border-b border-neutral-200 dark-admin:border-slate-700 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark-admin:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Ej: Bullpadel Vertex 03"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="bullpadel-vertex-03"
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Se genera automáticamente si se deja vacío</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="BP-VERTEX-03"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                >
                  <option value="palas">Palas</option>
                  <option value="zapatillas">Zapatillas</option>
                  <option value="ropa">Ropa</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Bullpadel"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Descripción Corta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.description_short}
                  onChange={(e) => setFormData({ ...formData, description_short: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Descripción breve para listados"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Descripción Larga *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description_long}
                  onChange={(e) => setFormData({ ...formData, description_long: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Descripción detallada del producto"
                />
              </div>
            </div>
          </div>

          {/* Precios y Stock */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Precios y Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Precio * (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Precio con Descuento (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discount_price || ''}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Precios por Rol y Certificación */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-2">Precios Especiales por Rol y Certificación</h3>
            <p className="text-sm text-neutral-600 dark-admin:text-slate-400 mb-4">
              Define precios diferenciados para roles específicos. Si no se define, se usará el precio base.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  🏢 Academia (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_by_role.academia || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price_by_role: {
                      ...formData.price_by_role,
                      academia: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder={`${formData.price}`}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Precio para academias</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  🎓 Entrenador (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_by_role.entrenador || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price_by_role: {
                      ...formData.price_by_role,
                      entrenador: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder={`${formData.price}`}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Precio para entrenadores</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  🏟️ Club (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_by_role.club || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price_by_role: {
                      ...formData.price_by_role,
                      club: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder={`${formData.price}`}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Precio para clubes</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  👨‍🎓 Alumno (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_by_role.alumno || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price_by_role: {
                      ...formData.price_by_role,
                      alumno: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder={`${formData.price}`}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Precio para alumnos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  ⭐ Certificado (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_by_role.certificado || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price_by_role: {
                      ...formData.price_by_role,
                      certificado: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder={`${formData.price}`}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Precio para usuarios certificados</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  👑 Admin (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price_by_role.admin || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    price_by_role: {
                      ...formData.price_by_role,
                      admin: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder={`${formData.price}`}
                />
                <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">Precio para administradores</p>
              </div>
            </div>
          </div>

          {/* Características Físicas */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Características Físicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Peso
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="365g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Dimensiones
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="45.5 x 26 cm"
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Imágenes</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="URL de la imagen"
                />
                <button
                  type="button"
                  onClick={() => addItem('image', newImage)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark-admin:bg-slate-700 rounded-lg">
                    <Upload className="w-4 h-4 text-neutral-500 dark-admin:text-slate-400" />
                    <span className="text-sm text-neutral-700 dark-admin:text-slate-300">{img.split('/').pop()}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('image', index)}
                      className="text-red-600 dark-admin:text-red-400 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colores */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Colores Disponibles</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Ej: Negro, Rojo, Azul"
                />
                <button
                  type="button"
                  onClick={() => addItem('color', newColor)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark-admin:bg-slate-700 rounded-lg">
                    <span className="text-sm text-neutral-700 dark-admin:text-slate-300">{color}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('color', index)}
                      className="text-red-600 dark-admin:text-red-400 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tallas */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Tallas Disponibles</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Ej: 39, 40, M, L, XL"
                />
                <button
                  type="button"
                  onClick={() => addItem('size', newSize)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark-admin:bg-slate-700 rounded-lg">
                    <span className="text-sm text-neutral-700 dark-admin:text-slate-300">{size}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('size', index)}
                      className="text-red-600 dark-admin:text-red-400 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Características del Producto</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  placeholder="Ej: Forma diamante, Núcleo EVA"
                />
                <button
                  type="button"
                  onClick={() => addItem('feature', newFeature)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </button>
              </div>
              <div className="space-y-1">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark-admin:bg-slate-700 rounded-lg">
                    <span className="text-sm text-neutral-700 dark-admin:text-slate-300 flex-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeItem('feature', index)}
                      className="text-red-600 dark-admin:text-red-400 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Estado y Visibilidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                  Estado *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="out_of_stock">Agotado</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-neutral-700 dark-admin:text-slate-300">Producto Destacado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="sticky bottom-0 bg-white dark-admin:bg-slate-800 pt-6 border-t border-neutral-200 dark-admin:border-slate-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
