'use client'

import Link from 'next/link'
import { Search, Briefcase, ArrowLeft } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón volver al inicio */}
        <Link href="/" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 font-medium mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-600 mb-4 tracking-tight">
            Padeliner
          </h1>
          <p className="text-lg text-neutral-600">
            Conecta con los mejores entrenadores de pádel
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-12">
          {/* Encontrar Entrenador */}
          <Link href="/register">
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Search className="w-10 h-10 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    Encontrar Entrenador
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Busca y reserva clases con entrenadores profesionales
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Soy Profesional */}
          <Link href="/role-selection">
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Briefcase className="w-10 h-10 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    Soy Profesional
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Ofrece tus servicios como entrenador o club
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <span className="text-neutral-600">¿Ya tienes cuenta? </span>
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
