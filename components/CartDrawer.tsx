'use client'

import { useCart } from '@/contexts/CartContext'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-neutral-900">
                  Carrito ({totalItems})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-neutral-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">Tu carrito está vacío</p>
                  <p className="text-sm text-neutral-500">Añade productos para empezar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex space-x-4 p-4 bg-neutral-50 rounded-xl"
                    >
                      {/* Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/producto/${item.id}`}
                          onClick={onClose}
                          className="font-semibold text-neutral-900 hover:text-orange-600 transition-colors line-clamp-2 text-sm"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-neutral-500 mt-1">{item.brand}</p>
                        <p className="text-lg font-bold text-orange-600 mt-2">
                          {item.price}€
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center border-2 border-neutral-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center border-2 border-neutral-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold text-neutral-900">{totalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Envío</span>
                  <span className="font-semibold text-green-600">
                    {totalPrice >= 50 ? 'GRATIS' : '4.95€'}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-neutral-900">Total</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {(totalPrice + (totalPrice >= 50 ? 0 : 4.95)).toFixed(2)}€
                    </span>
                  </div>
                  {totalPrice < 50 && (
                    <p className="text-xs text-neutral-500 mb-4">
                      Añade {(50 - totalPrice).toFixed(2)}€ más para envío gratis
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onClose()
                      // Aquí iría la navegación al checkout
                    }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
                  >
                    Finalizar Compra
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold rounded-xl transition-colors"
                  >
                    Seguir Comprando
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Seguro que quieres vaciar el carrito?')) {
                        clearCart()
                      }
                    }}
                    className="w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
