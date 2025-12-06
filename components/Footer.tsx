'use client'

import { motion } from 'framer-motion'
import { Youtube, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' })
      })
      
      if (res.ok) {
        setSuccess(true)
        setEmail('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer id="contacto" className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-6">
              <Image 
                src="/padeliner-logo.png" 
                alt="Padeliner" 
                width={180} 
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              La plataforma líder para conectar jugadores con entrenadores profesionales de pádel.
            </p>
            <div className="flex space-x-4">
              <SocialIcon 
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-6.95a8.16 8.16 0 004.65 1.46v-3.4a4.83 4.83 0 01-1.2-.5z"/>
                  </svg>
                } 
                href="https://www.tiktok.com/@padeliner"
                label="Síguenos en TikTok"
              />
              <SocialIcon 
                icon={<Instagram className="w-5 h-5" />} 
                href="https://www.instagram.com/padeliner/"
                label="Síguenos en Instagram"
              />
              <SocialIcon 
                icon={<Youtube className="w-5 h-5" />} 
                href="https://www.youtube.com/@Padeliner"
                label="Suscríbete a nuestro canal de YouTube"
              />
              <SocialIcon 
                icon={<Linkedin className="w-5 h-5" />} 
                href="https://www.linkedin.com/company/padeliner/?viewAsMember=true"
                label="Síguenos en LinkedIn"
              />
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
              <FooterLink href="/trabaja-con-nosotros">Trabaja con nosotros</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/prensa">Prensa</FooterLink>
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
                  <a href="mailto:contact@padeliner.com" className="hover:text-primary-400 transition-colors">
                    contact@padeliner.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-400">Teléfono</p>
                  <a href="tel:+34900123456" className="hover:text-primary-400 transition-colors">
                    +34 699 984 661
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-400">Ubicación</p>
                  <p>Valencia, España</p>
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
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500 text-white px-6 py-3 rounded-full max-w-md mx-auto"
              >
                ✅ ¡Gracias por suscribirte!
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-neutral-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Suscribirse'}
                </motion.button>
              </form>
            )}
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

function SocialIcon({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-primary-500 rounded-full transition-all duration-200"
    >
      {icon}
    </motion.a>
  )
}
