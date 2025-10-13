import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Cookie } from 'lucide-react'

export const metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre las cookies utilizadas en Padeliner',
}

export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary-100 rounded-xl">
                <Cookie className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Política de Cookies
                </h1>
                <p className="text-neutral-600 mt-1">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                ¿Qué son las cookies?
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
                Nos ayudan a proporcionar una mejor experiencia de usuario, recordar tus preferencias y analizar cómo se 
                utiliza nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Tipos de cookies que utilizamos
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    1. Cookies Esenciales (Obligatorias)
                  </h3>
                  <p className="text-neutral-700 mb-2">
                    Estas cookies son necesarias para el funcionamiento básico de la web y no se pueden desactivar.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-600">
                    <li><strong>Sesión de usuario:</strong> Mantiene tu sesión activa cuando inicias sesión</li>
                    <li><strong>Seguridad:</strong> Protección contra ataques CSRF y otras vulnerabilidades</li>
                    <li><strong>Consentimiento de cookies:</strong> Guarda tus preferencias de cookies</li>
                  </ul>
                  <p className="text-sm text-neutral-500 mt-2">
                    Duración: Sesión o hasta 1 año
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    2. Cookies Analíticas (Opcionales)
                  </h3>
                  <p className="text-neutral-700 mb-2">
                    Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-600">
                    <li><strong>Google Analytics:</strong> Análisis de tráfico y comportamiento del usuario (datos anónimos)</li>
                    <li><strong>Métricas de rendimiento:</strong> Velocidad de carga y experiencia del usuario</li>
                  </ul>
                  <p className="text-sm text-neutral-500 mt-2">
                    Duración: Hasta 2 años
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    3. Cookies de Marketing (Opcionales)
                  </h3>
                  <p className="text-neutral-700 mb-2">
                    Se utilizan para mostrar anuncios relevantes basados en tus intereses.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-600">
                    <li><strong>Google Ads:</strong> Publicidad personalizada</li>
                    <li><strong>Redes sociales:</strong> Integración con Facebook, Instagram, Twitter</li>
                  </ul>
                  <p className="text-sm text-neutral-500 mt-2">
                    Duración: Hasta 2 años
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    4. Cookies Funcionales (Opcionales)
                  </h3>
                  <p className="text-neutral-700 mb-2">
                    Permiten proporcionar funcionalidades mejoradas y personalización.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-600">
                    <li><strong>Preferencias de idioma:</strong> Recuerda tu idioma preferido</li>
                    <li><strong>Configuración de vista:</strong> Modo oscuro, tamaño de texto, etc.</li>
                    <li><strong>Chat en vivo:</strong> Mantiene el historial de conversaciones</li>
                  </ul>
                  <p className="text-sm text-neutral-500 mt-2">
                    Duración: Hasta 1 año
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Base legal para el uso de cookies
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Conforme al Reglamento General de Protección de Datos (RGPD) y la Ley de Servicios de la Sociedad de la 
                Información y Comercio Electrónico (LSSI-CE), el uso de cookies requiere:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li><strong>Consentimiento explícito:</strong> Para cookies no esenciales</li>
                <li><strong>Información clara:</strong> Sobre qué cookies utilizamos y para qué</li>
                <li><strong>Control del usuario:</strong> Posibilidad de aceptar, rechazar o configurar cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                ¿Cómo gestionar las cookies?
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Puedes gestionar tus preferencias de cookies de las siguientes formas:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>
                  <strong>Banner de cookies:</strong> Configura tus preferencias cuando accedes por primera vez a nuestra web
                </li>
                <li>
                  <strong>Configuración del navegador:</strong> Puedes bloquear o eliminar cookies desde la configuración de tu navegador:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-neutral-600">
                    <li>Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies</li>
                    <li>Firefox: Opciones &gt; Privacidad y seguridad</li>
                    <li>Safari: Preferencias &gt; Privacidad</li>
                    <li>Edge: Configuración &gt; Privacidad, búsqueda y servicios</li>
                  </ul>
                </li>
                <li>
                  <strong>Herramientas de terceros:</strong> Algunos servicios de análisis ofrecen complementos para deshabilitar su seguimiento
                </li>
              </ol>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-900 text-sm">
                  <strong>⚠️ Importante:</strong> Bloquear todas las cookies puede afectar negativamente a la funcionalidad 
                  del sitio web. Algunas funciones pueden no estar disponibles.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Cookies de terceros
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Algunos de nuestros servicios utilizan cookies de terceros. Estos servicios tienen sus propias 
                políticas de privacidad:
              </p>
              <ul className="space-y-2">
                <li className="text-neutral-700">
                  <strong>Google Analytics:</strong>{' '}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Política de privacidad de Google
                  </a>
                </li>
                <li className="text-neutral-700">
                  <strong>Supabase:</strong>{' '}
                  <a 
                    href="https://supabase.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Política de privacidad de Supabase
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Actualizaciones de esta política
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en las cookies que 
                utilizamos o por otros motivos operativos, legales o reglamentarios. Te recomendamos revisar esta 
                página periódicamente para estar informado sobre cómo utilizamos las cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Contacto
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Si tienes alguna pregunta sobre nuestra Política de Cookies, puedes contactarnos:
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                <p className="text-neutral-700">
                  <strong>Email:</strong> privacidad@padeliner.com
                </p>
                <p className="text-neutral-700">
                  <strong>Dirección:</strong> Padeliner, España
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
