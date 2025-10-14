'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, CircleDot } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-500 rounded-xl">
                <CircleDot className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">Padeliner</span>
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              La plataforma líder para conectar jugadores con entrenadores profesionales de pádel.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-lg font-bold mb-6">Para Alumnos</h3>
            <ul className="space-y-3">
              <FooterLink href="/entrenadores">Buscar entrenadores</FooterLink>
              <FooterLink href="/clubes">Buscar clubes</FooterLink>
              <FooterLink href="/academias">Buscar academias</FooterLink>
              <FooterLink href="/tienda">Tienda online</FooterLink>
              <FooterLink href="/#como-funciona">Cómo funciona</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6">Empresa</h3>
            <ul className="space-y-3">
              <FooterLink href="/sobre-nosotros">Sobre nosotros</FooterLink>
              <FooterLink href="/contacto">Contacto</FooterLink>
              <FooterLink href="#">Trabaja con nosotros</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="#">Prensa</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-400">Email</p>
                  <a href="mailto:hola@padeliner.com" className="hover:text-primary-400 transition-colors">
                    hola@padeliner.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-400">Teléfono</p>
                  <a href="tel:+34900123456" className="hover:text-primary-400 transition-colors">
                    +34 900 123 456
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-400">Ubicación</p>
                  <p>Madrid, España</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-neutral-800 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Mantente al día
            </h3>
            <p className="text-neutral-400 mb-6">
              Recibe ofertas exclusivas, consejos de entrenamiento y novedades
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-6 py-3 bg-neutral-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-200"
              >
                Suscribirse
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © 2025 Padeliner. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/terminos-y-condiciones" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/politica-privacidad" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/contacto" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}>
        <span className="text-neutral-400 hover:text-primary-400 transition-colors">
          {children}
        </span>
      </Link>
    </li>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-primary-500 rounded-full transition-all duration-200"
    >
      {icon}
    </motion.a>
  )
}
