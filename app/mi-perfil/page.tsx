'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Save, X } from 'lucide-react'

export default function MiPerfilPage() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    birth_date: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/welcome')
    }
    
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: (profile as any).phone || '',
        city: (profile as any).city || '',
        birth_date: (profile as any).birth_date || '',
      })
    }
  }, [user, profile, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error
      
      alert('Perfil actualizado correctamente')
      setIsEditing(false)
      window.location.reload() // Recargar para actualizar el perfil
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Header del perfil */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 sm:px-8 sm:py-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Usuario'}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center text-primary-600 text-4xl sm:text-5xl font-bold border-4 border-white shadow-xl">
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {profile.full_name || 'Usuario'}
                  </h1>
                  <p className="text-primary-100 mb-4 capitalize">
                    {profile.role || 'Alumno'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                      Miembro activo
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            full_name: profile.full_name || '',
                            phone: (profile as any).phone || '',
                            city: (profile as any).city || '',
                            birth_date: (profile as any).birth_date || '',
                          })
                        }}
                        className="px-4 py-2 bg-neutral-500 text-white font-semibold rounded-lg hover:bg-neutral-600 transition-colors flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Información detallada */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Información Personal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre completo */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-neutral-900 font-medium">{profile.full_name || 'No especificado'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="text-neutral-900 font-medium">{profile.email}</p>
                  <p className="text-xs text-neutral-500 mt-1">No se puede modificar</p>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="Ej: +34 600 123 456"
                    />
                  ) : (
                    <p className="text-neutral-900 font-medium">{(profile as any).phone || 'No especificado'}</p>
                  )}
                </div>

                {/* Ciudad */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ciudad
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="Ej: Madrid"
                    />
                  ) : (
                    <p className="text-neutral-900 font-medium">{(profile as any).city || 'No especificado'}</p>
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Fecha de Nacimiento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-neutral-900 font-medium">
                      {(profile as any).birth_date 
                        ? new Date((profile as any).birth_date).toLocaleDateString('es-ES')
                        : 'No especificado'
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Cerrar Sesión */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
