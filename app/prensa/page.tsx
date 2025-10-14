'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Newspaper, Download, Mail, Phone, FileText, Image as ImageIcon, Users } from 'lucide-react'

export default function PrensaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Sala de Prensa
              </h1>
            </div>
            <p className="text-xl text-primary-100">
              Recursos para medios de comunicación y periodistas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Padeliner */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Sobre Padeliner
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              <strong>Padeliner</strong> es la plataforma líder en España para conectar jugadores de pádel con entrenadores profesionales y academias certificadas. Fundada en 2024, nuestra misión es democratizar el acceso al entrenamiento profesional de pádel y ayudar a millones de jugadores a mejorar su juego.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Con más de 1,000 entrenadores registrados y miles de reservas mensuales, Padeliner se ha consolidado como la solución tecnológica preferida por profesionales y entusiastas del pádel en toda España.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Nuestra plataforma combina tecnología de vanguardia con un profundo conocimiento del deporte, ofreciendo funcionalidades como búsqueda inteligente de entrenadores, reservas en tiempo real, gestión de pagos segura y seguimiento del progreso.
            </p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">1,000+</div>
            <p className="text-neutral-600">Entrenadores Certificados</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
            <p className="text-neutral-600">Clases Reservadas</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
            <p className="text-neutral-600">Satisfacción de Usuarios</p>
          </div>
        </div>

        {/* Press Kit */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Kit de Prensa
          </h2>
          <p className="text-neutral-600 mb-8">
            Descarga nuestros recursos oficiales para medios de comunicación
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Logotipos</h3>
                  <p className="text-sm text-neutral-500">PNG, SVG, EPS</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                Diferentes versiones de nuestro logo en alta resolución
              </p>
              <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar Logos
              </button>
            </div>

            <div className="border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Nota de Prensa</h3>
                  <p className="text-sm text-neutral-500">PDF, DOCX</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                Información corporativa y últimas novedades
              </p>
              <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar Documentos
              </button>
            </div>

            <div className="border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Imágenes</h3>
                  <p className="text-sm text-neutral-500">JPG, PNG</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                Capturas de pantalla y fotografías de la plataforma
              </p>
              <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar Imágenes
              </button>
            </div>

            <div className="border-2 border-neutral-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Equipo</h3>
                  <p className="text-sm text-neutral-500">PDF</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                Biografías y fotografías del equipo directivo
              </p>
              <button className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar Info
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Contacto de Prensa
          </h2>
          <p className="text-neutral-700 mb-8">
            Para consultas de prensa, entrevistas o más información:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
                <h3 className="font-bold text-lg">Email</h3>
              </div>
              <a 
                href="mailto:prensa@padeliner.com" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                prensa@padeliner.com
              </a>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
                <h3 className="font-bold text-lg">Teléfono</h3>
              </div>
              <a 
                href="tel:+34900123456" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                +34 900 123 456
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary-200">
            <p className="text-sm text-neutral-600">
              <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00 (CET)
            </p>
            <p className="text-sm text-neutral-600 mt-2">
              <strong>Respuesta:</strong> Contestamos todas las consultas en menos de 24 horas laborables
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
