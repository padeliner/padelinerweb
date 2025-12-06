'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, Building2, GraduationCap, UserCheck } from 'lucide-react'

const ROLES = [
  {
    value: 'coach',
    title: 'Entrenador Personal',
    description: 'Ofrezco clases individuales y grupales',
    Icon: Trophy,
  },
  {
    value: 'club',
    title: 'Club Deportivo',
    description: 'Gestiono instalaciones y pistas',
    Icon: Building2,
  },
  {
    value: 'academy',
    title: 'Academia',
    description: 'Centro de formación profesional',
    Icon: GraduationCap,
  },
]

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/login"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al login</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <UserCheck className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Selecciona tu Perfil
          </h1>
          <p className="text-neutral-600">
            Elige el tipo de cuenta que mejor te describe
          </p>
        </div>

        {/* Role Options */}
        <div className="space-y-4">
          {ROLES.map((role) => {
            const Icon = role.Icon
            
            return (
              <Link key={role.value} href={`/register-professional?role=${role.value}`}>
                <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-10 h-10 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {role.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
