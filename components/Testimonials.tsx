'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'María López',
    role: 'Jugadora amateur',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Encontré al entrenador perfecto en menos de 5 minutos. Mi juego ha mejorado increíblemente. ¡Totalmente recomendable!',
  },
  {
    id: 2,
    name: 'Pedro Sánchez',
    role: 'Padre de familia',
    image: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    comment: 'Mis hijos están encantados con sus clases. La plataforma es súper fácil de usar y los precios son muy competitivos.',
  },
  {
    id: 3,
    name: 'Laura Martín',
    role: 'Jugadora profesional',
    image: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    comment: 'Como profesional, valoro mucho la calidad de los entrenadores. Padeliner solo trabaja con los mejores.',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="flex items-center justify-center space-x-2 text-lg text-neutral-600">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <span className="font-semibold">4.9 de 5</span>
            <span>• +2,000 valoraciones</span>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -4 }}
      className="relative bg-white p-8 rounded-2xl border-2 border-neutral-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 text-primary-100">
        <Quote className="w-12 h-12" />
      </div>

      {/* Stars */}
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>

      {/* Comment */}
      <p className="text-neutral-700 mb-6 leading-relaxed">
        "{testimonial.comment}"
      </p>

      {/* Author */}
      <div className="flex items-center space-x-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100"
        />
        <div>
          <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
          <p className="text-sm text-neutral-600">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}
