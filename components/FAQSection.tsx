'use client'

import { motion } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: '¿Cómo funciona Padeliner?',
    answer: 'Padeliner es una plataforma que conecta jugadores de pádel con entrenadores profesionales, clubes y academias. Simplemente busca entrenadores en tu zona, revisa sus perfiles y reserva clases según tu disponibilidad.',
  },
  {
    question: '¿Cuánto cuesta reservar un entrenador?',
    answer: 'Los precios varían según la experiencia del entrenador, ubicación y tipo de clase. Generalmente van desde 30€ hasta 60€ por hora. Cada entrenador establece sus propias tarifas que puedes ver claramente en su perfil.',
  },
  {
    question: '¿Puedo cancelar o reprogramar una clase?',
    answer: 'Sí, puedes cancelar o reprogramar tus clases con hasta 24 horas de antelación sin ningún cargo. Las cancelaciones con menos de 24 horas pueden tener un cargo según la política del entrenador.',
  },
  {
    question: '¿Necesito ser miembro de un club?',
    answer: 'No necesariamente. Muchos entrenadores trabajan en varios clubes o tienen sus propias instalaciones. Algunos también ofrecen clases en clubes públicos. Puedes ver la ubicación y opciones disponibles en cada perfil.',
  },
  {
    question: '¿Qué niveles de jugadores aceptan?',
    answer: 'Nuestros entrenadores trabajan con todos los niveles: desde principiantes que nunca han jugado hasta jugadores avanzados y competidores. Puedes filtrar entrenadores por especialidad y nivel en tu búsqueda.',
  },
  {
    question: '¿Ofrecen clases grupales?',
    answer: 'Sí, muchos entrenadores ofrecen tanto clases individuales como grupales. Las clases grupales son una excelente opción para aprender en un ambiente social y generalmente tienen un costo menor por persona.',
  },
  {
    question: '¿Cómo pago las clases?',
    answer: 'Puedes pagar de forma segura a través de la plataforma con tarjeta de crédito/débito. El pago se procesa después de cada clase completada. También ofrecemos paquetes de clases con descuento.',
  },
  {
    question: '¿Qué pasa si no estoy satisfecho con mi entrenador?',
    answer: 'Tu satisfacción es nuestra prioridad. Si no estás satisfecho con tu primera clase, contáctanos dentro de las 24 horas y buscaremos una solución, que puede incluir un reembolso o cambio de entrenador.',
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600">
            Todo lo que necesitas saber sobre Padeliner
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 bg-neutral-50 rounded-2xl"
        >
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            ¿Tienes más preguntas?
          </h3>
          <p className="text-neutral-600 mb-6">
            Nuestro equipo está aquí para ayudarte
          </p>
          <a
            href="mailto:soporte@padeliner.com"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-200"
          >
            <span>Contactar soporte</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 bg-neutral-50 hover:bg-neutral-100 rounded-2xl transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 pr-8">
            {faq.question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-6 h-6 text-neutral-600" />
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-neutral-600 mt-4 leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      </button>
    </motion.div>
  )
}
