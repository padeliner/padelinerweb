'use client'

import { motion } from 'framer-motion'
import { Apple, Download, Smartphone, QrCode } from 'lucide-react'
import Image from 'next/image'

export function MobileAppsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Smartphone className="w-5 h-5" />
              <span className="font-semibold">Disponible en móvil</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Lleva Padeliner en tu bolsillo
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Descarga nuestra app y gestiona tus reservas, encuentra entrenadores y mucho más desde cualquier lugar.
            </p>

            {/* Store Badges */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Google Play */}
              <motion.a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <div className="flex items-center space-x-3 px-6 py-3 bg-black hover:bg-neutral-900 rounded-xl transition-all duration-200 shadow-xl">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" fill="#00D8FF"/>
                    <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#FFCE00"/>
                    <path d="M3.84 2.15L6.05 2.66L14.54 11.15L6.05 2.66L3.84 2.15Z" fill="#FF3A44"/>
                    <path d="M16.81 8.88L14.54 11.15L6.05 2.66L16.81 8.88Z" fill="#00F076"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-neutral-400">Disponible en</div>
                    <div className="text-lg font-bold text-white">Google Play</div>
                  </div>
                </div>
              </motion.a>

              {/* App Store */}
              <motion.a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <div className="flex items-center space-x-3 px-6 py-3 bg-black hover:bg-neutral-900 rounded-xl transition-all duration-200 shadow-xl">
                  <Apple className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-neutral-400">Descarga en</div>
                    <div className="text-lg font-bold text-white">App Store</div>
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/80">Descargas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4.8</div>
                <div className="text-white/80">Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/80">Reseñas</div>
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative mx-auto w-[300px] h-[600px] bg-neutral-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Fake App Screenshot */}
                  <div className="relative h-full bg-gradient-to-b from-primary-50 to-white">
                    {/* Status Bar */}
                    <div className="h-12 bg-primary-500 flex items-center justify-between px-6">
                      <div className="text-white font-bold text-lg">Padeliner</div>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="h-32 bg-neutral-100 rounded-xl"></div>
                      <div className="h-20 bg-neutral-100 rounded-xl"></div>
                      <div className="h-20 bg-neutral-100 rounded-xl"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 bg-neutral-100 rounded-xl"></div>
                        <div className="h-24 bg-neutral-100 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-neutral-900 rounded-b-2xl"></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -right-4 top-20 bg-white p-3 rounded-xl shadow-xl"
              >
                <Download className="w-6 h-6 text-primary-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
