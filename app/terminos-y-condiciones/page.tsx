'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-neutral-300">
              Última actualización: Enero 2024
            </p>
          </motion.div>
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
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introducción</h2>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Bienvenido a Padeliner. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Padeliner, ubicado en www.padeliner.com.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando Padeliner si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
              </p>
            </div>

            {/* Definiciones */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Definiciones</h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li><strong>"Plataforma"</strong> se refiere al sitio web Padeliner y todos sus servicios asociados.</li>
                <li><strong>"Usuario"</strong> se refiere a cualquier persona que acceda o utilice la Plataforma.</li>
                <li><strong>"Profesional"</strong> se refiere a entrenadores, clubes y academias registrados en la Plataforma.</li>
                <li><strong>"Servicio"</strong> se refiere a las clases, entrenamientos o reservas de pistas ofrecidas a través de la Plataforma.</li>
              </ul>
            </div>

            {/* Uso de la Plataforma */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Uso de la Plataforma</h2>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">3.1 Registro</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Para utilizar ciertos servicios de la Plataforma, debes registrarte y crear una cuenta. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">3.2 Contenido del Usuario</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Los usuarios pueden publicar reseñas, comentarios y otro contenido. No debes publicar contenido ilegal, ofensivo, difamatorio o que infrinja derechos de terceros.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">3.3 Prohibiciones</h3>
              <p className="text-neutral-700 leading-relaxed">
                Está prohibido usar la Plataforma para fines ilegales, distribuir malware, realizar ingeniería inversa, o intentar acceder de forma no autorizada a sistemas o datos.
              </p>
            </div>

            {/* Reservas y Pagos */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Reservas y Pagos</h2>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">4.1 Proceso de Reserva</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Las reservas se confirman una vez completado el pago. Los precios mostrados incluyen todos los impuestos aplicables.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">4.2 Métodos de Pago</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Aceptamos tarjetas de crédito/débito y otros métodos de pago electrónico. Todos los pagos se procesan de forma segura a través de proveedores certificados.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">4.3 Política de Cancelación</h3>
              <p className="text-neutral-700 leading-relaxed">
                Las cancelaciones realizadas con al menos 24 horas de antelación recibirán un reembolso completo. Las cancelaciones con menos de 24 horas pueden estar sujetas a cargos según las políticas del Profesional.
              </p>
            </div>

            {/* Responsabilidades */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Responsabilidades</h2>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">5.1 De Padeliner</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Padeliner actúa como intermediario entre Usuarios y Profesionales. No somos responsables de la calidad de los servicios prestados por los Profesionales, ni de lesiones o daños que puedan ocurrir durante las actividades.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">5.2 De los Usuarios</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Los usuarios deben seguir las instrucciones de seguridad, usar equipo apropiado y revelar cualquier condición médica relevante antes de participar en actividades deportivas.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">5.3 De los Profesionales</h3>
              <p className="text-neutral-700 leading-relaxed">
                Los Profesionales son responsables de mantener las certificaciones requeridas, proporcionar servicios de calidad y cumplir con las regulaciones de seguridad aplicables.
              </p>
            </div>

            {/* Propiedad Intelectual */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Propiedad Intelectual</h2>
              <p className="text-neutral-700 leading-relaxed">
                Todo el contenido de la Plataforma, incluyendo textos, gráficos, logos, iconos y código, es propiedad de Padeliner o sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
              </p>
            </div>

            {/* Limitación de Responsabilidad */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-neutral-700 leading-relaxed">
                Padeliner no será responsable de daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar la Plataforma. Nuestra responsabilidad total no excederá el monto pagado por el servicio en cuestión.
              </p>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Modificaciones</h2>
              <p className="text-neutral-700 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en la Plataforma. El uso continuado de la Plataforma después de cualquier cambio constituye la aceptación de los nuevos términos.
              </p>
            </div>

            {/* Ley Aplicable */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Ley Aplicable</h2>
              <p className="text-neutral-700 leading-relaxed">
                Estos términos se rigen por las leyes de España. Cualquier disputa será resuelta en los tribunales de Valencia, España.
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Contacto</h2>
              <p className="text-neutral-700 leading-relaxed">
                Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en:
              </p>
              <ul className="mt-3 space-y-2 text-neutral-700">
                <li><strong>Email:</strong> contact@padeliner.com</li>
                <li><strong>Teléfono:</strong> +34 699 984 661</li>
                <li><strong>Dirección:</strong> Gran Vía Marqués del Turia 162, 4º B, 46001 Valencia, España</li>
              </ul>
            </div>

            {/* Aceptación */}
            <div className="mt-8 p-6 bg-primary-50 rounded-xl border-l-4 border-primary-600">
              <p className="text-neutral-900 font-semibold mb-2">Aceptación de los Términos</p>
              <p className="text-neutral-700">
                Al usar Padeliner, confirmas que has leído, entendido y aceptas estar sujeto a estos Términos y Condiciones.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
