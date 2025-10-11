'use client'

import { motion } from 'framer-motion'
import { Search, Calendar, CreditCard, Trophy } from 'lucide-react'

const steps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: 'Busca tu entrenador',
    description: 'Explora perfiles de entrenadores cerca de ti, compara valoraciones y especialidades.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Reserva tu clase',
    description: 'Elige fecha y horario que te convengan. Confirmación instantánea.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Paga seguro',
    description: 'Pago online seguro. Cancela gratis hasta 24h antes de la clase.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: 'Mejora tu juego',
    description: 'Disfruta de tu clase y mejora tu técnica con profesionales certificados.',
    color: 'from-orange-500 to-orange-600',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Reservar tu entrenador es súper fácil
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 transition-all duration-200"
          >
            Empezar ahora
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector Line (hidden on mobile and last item) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neutral-200 to-transparent z-0" />
      )}

      {/* Card */}
      <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 z-10">
        {/* Step Number */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
          {index + 1}
        </div>

        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-6 shadow-lg`}>
          {step.icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-neutral-900 mb-3">
          {step.title}
        </h3>
        <p className="text-neutral-600 leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  )
}
