'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Política de Privacidad
            </h1>
            <p className="text-blue-100">
              Última actualización: Enero 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <a href="#introduccion" className="text-sm font-medium text-neutral-600 hover:text-primary-600 whitespace-nowrap">
              Introducción
            </a>
            <a href="#datos" className="text-sm font-medium text-neutral-600 hover:text-primary-600 whitespace-nowrap">
              Datos que Recopilamos
            </a>
            <a href="#uso" className="text-sm font-medium text-neutral-600 hover:text-primary-600 whitespace-nowrap">
              Uso de Datos
            </a>
            <a href="#derechos" className="text-sm font-medium text-neutral-600 hover:text-primary-600 whitespace-nowrap">
              Tus Derechos
            </a>
            <a href="#contacto" className="text-sm font-medium text-neutral-600 hover:text-primary-600 whitespace-nowrap">
              Contacto
            </a>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8"
          >
            {/* Introducción */}
            <div id="introduccion">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introducción</h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                En Padeliner, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando utilizas nuestra plataforma.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Al usar Padeliner, aceptas las prácticas descritas en esta política. Si no estás de acuerdo, por favor no uses nuestros servicios.
              </p>
            </div>

            {/* Responsable */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Responsable del Tratamiento</h2>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-neutral-900 mb-2"><strong>Padeliner S.L.</strong></p>
                <p className="text-neutral-700">NIF: B12345678</p>
                <p className="text-neutral-700">Dirección: Calle Serrano 123, 4º B, 28006 Madrid, España</p>
                <p className="text-neutral-700">Email: privacidad@padeliner.com</p>
                <p className="text-neutral-700">Teléfono: +34 900 123 456</p>
              </div>
            </div>

            {/* Datos que Recopilamos */}
            <div id="datos">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Datos que Recopilamos</h2>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                3.1 Información que Proporcionas
              </h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-4">
                <li>Datos de registro: nombre, email, teléfono, fecha de nacimiento</li>
                <li>Información de perfil: foto, nivel de juego, preferencias</li>
                <li>Datos de pago: información de tarjeta de crédito (procesada por terceros seguros)</li>
                <li>Contenido generado: reseñas, comentarios, mensajes</li>
              </ul>

              <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                3.2 Información Recopilada Automáticamente
              </h3>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li>Datos de uso: páginas visitadas, clics, tiempo de navegación</li>
                <li>Información del dispositivo: tipo de dispositivo, sistema operativo, navegador</li>
                <li>Dirección IP y ubicación aproximada</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </div>

            {/* Uso de Datos */}
            <div id="uso">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Cómo Usamos tus Datos</h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Utilizamos tu información personal para los siguientes propósitos:
              </p>
              <ul className="space-y-3">
                {[
                  'Proporcionar y mejorar nuestros servicios',
                  'Procesar reservas y pagos',
                  'Comunicarnos contigo sobre tu cuenta y servicios',
                  'Personalizar tu experiencia en la plataforma',
                  'Enviar notificaciones y promociones (con tu consentimiento)',
                  'Detectar y prevenir fraudes y abusos',
                  'Cumplir con obligaciones legales',
                  'Realizar análisis y mejorar nuestro negocio'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Base Legal */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Base Legal del Tratamiento</h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Procesamos tus datos personales basándonos en:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li><strong>Ejecución de contrato:</strong> para proporcionar los servicios solicitados</li>
                <li><strong>Consentimiento:</strong> para marketing y comunicaciones promocionales</li>
                <li><strong>Interés legítimo:</strong> para mejorar servicios y prevenir fraudes</li>
                <li><strong>Obligación legal:</strong> para cumplir con requisitos legales y regulatorios</li>
              </ul>
            </div>

            {/* Compartir Datos */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Compartir Información</h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Podemos compartir tu información con:
              </p>
              <ul className="space-y-3">
                <li className="text-neutral-700">
                  <strong>Profesionales:</strong> Compartimos información necesaria con entrenadores y clubes para facilitar reservas
                </li>
                <li className="text-neutral-700">
                  <strong>Proveedores de servicios:</strong> Procesadores de pago, servicios de hosting, herramientas de análisis
                </li>
                <li className="text-neutral-700">
                  <strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger nuestros derechos
                </li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-neutral-900 font-semibold">Importante:</p>
                <p className="text-neutral-700">Nunca vendemos tu información personal a terceros.</p>
              </div>
            </div>

            {/* Seguridad */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-blue-600" />
                7. Seguridad de los Datos
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li>Cifrado SSL/TLS para transmisión de datos</li>
                <li>Almacenamiento seguro en servidores protegidos</li>
                <li>Acceso limitado solo a personal autorizado</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Protección contra accesos no autorizados</li>
              </ul>
            </div>

            {/* Retención */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Retención de Datos</h2>
              <p className="text-neutral-700 leading-relaxed">
                Conservamos tu información personal solo mientras sea necesario para los fines descritos en esta política, o según lo requiera la ley. Cuando ya no necesitemos tu información, la eliminaremos de forma segura.
              </p>
            </div>

            {/* Derechos del Usuario */}
            <div id="derechos">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Tus Derechos</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Bajo el RGPD, tienes los siguientes derechos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Acceso', desc: 'Solicitar copia de tus datos personales' },
                  { title: 'Rectificación', desc: 'Corregir datos inexactos o incompletos' },
                  { title: 'Supresión', desc: 'Solicitar la eliminación de tus datos' },
                  { title: 'Oposición', desc: 'Oponerte al procesamiento de tus datos' },
                  { title: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado' },
                  { title: 'Limitación', desc: 'Restringir el procesamiento en ciertos casos' }
                ].map((right, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-bold text-neutral-900 mb-1">{right.title}</h3>
                    <p className="text-sm text-neutral-700">{right.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-neutral-700 leading-relaxed mt-4">
                Para ejercer estos derechos, contáctanos en privacidad@padeliner.com
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Cookies</h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-3">
                <li>Mantener tu sesión iniciada</li>
                <li>Recordar tus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
                <li>Mejorar la experiencia del usuario</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed">
                Puedes controlar las cookies a través de la configuración de tu navegador.
              </p>
            </div>

            {/* Menores */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Menores de Edad</h2>
              <p className="text-neutral-700 leading-relaxed">
                Nuestros servicios están dirigidos a personas mayores de 16 años. No recopilamos intencionadamente información de menores sin el consentimiento parental. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente.
              </p>
            </div>

            {/* Cambios */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Cambios en la Política</h2>
              <p className="text-neutral-700 leading-relaxed">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos por email o mediante un aviso en la plataforma. Te recomendamos revisar esta política periódicamente.
              </p>
            </div>

            {/* Contacto */}
            <div id="contacto">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">13. Contacto</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos personales, contáctanos:
              </p>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-neutral-900 font-semibold mb-3">Delegado de Protección de Datos</p>
                <ul className="space-y-2 text-neutral-700">
                  <li><strong>Email:</strong> privacidad@padeliner.com</li>
                  <li><strong>Teléfono:</strong> +34 900 123 456</li>
                  <li><strong>Dirección:</strong> Calle Serrano 123, 4º B, 28006 Madrid, España</li>
                </ul>
              </div>
              <p className="text-neutral-700 leading-relaxed mt-4">
                También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en www.aepd.es
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
