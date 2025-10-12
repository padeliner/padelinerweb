'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Target, Users, Award, Heart, Zap, Shield } from 'lucide-react'

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sobre Padeliner
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Conectamos jugadores con los mejores profesionales del pádel en España
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                Nuestra Misión
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                En Padeliner, creemos que todos merecen acceso a entrenamiento de calidad y a las mejores instalaciones para practicar su deporte favorito.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                Fundada en 2024, nuestra plataforma nace con el objetivo de simplificar la búsqueda de entrenadores, clubes y academias de pádel, facilitando la conexión entre jugadores de todos los niveles y profesionales cualificados.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Más que una plataforma de reservas, somos una comunidad comprometida con el crecimiento y la profesionalización del pádel en España.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop"
                alt="Pádel"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión que tomamos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Excelencia',
                description: 'Trabajamos solo con los mejores profesionales verificados y certificados del sector.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Comunidad',
                description: 'Fomentamos conexiones genuinas entre jugadores, entrenadores y clubes.'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Calidad',
                description: 'Garantizamos instalaciones de primer nivel y entrenamiento profesional.'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Pasión',
                description: 'Amamos el pádel tanto como tú y trabajamos para promover su crecimiento.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Innovación',
                description: 'Utilizamos la mejor tecnología para hacer tu experiencia simple y efectiva.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Confianza',
                description: 'Tu seguridad y satisfacción son nuestra máxima prioridad.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Padeliner en Números
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '20+', label: 'Entrenadores certificados' },
              { number: '10+', label: 'Clubes asociados' },
              { number: '8+', label: 'Academias de élite' },
              { number: '1000+', label: 'Jugadores satisfechos' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.number}</p>
                <p className="text-neutral-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Un grupo apasionado de profesionales dedicados a revolucionar el mundo del pádel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Carlos Martínez',
                role: 'CEO & Fundador',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
              },
              {
                name: 'Ana García',
                role: 'Directora de Operaciones',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
              },
              {
                name: 'Miguel López',
                role: 'Director Técnico',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para mejorar tu juego?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Únete a nuestra comunidad y encuentra el entrenador o club perfecto para ti
            </p>
            <button className="px-8 py-4 bg-white text-primary-600 font-bold rounded-full hover:bg-neutral-100 transition-colors shadow-lg">
              Empezar Ahora
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
