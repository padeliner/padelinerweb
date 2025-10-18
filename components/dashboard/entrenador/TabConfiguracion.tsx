'use client'

import { useEffect, useState } from 'react'
import { User, MapPin, DollarSign, Globe, Award, Image, Save } from 'lucide-react'

interface ProfileData {
  nombre: string
  apellido: string
  telefono: string
  ciudad: string
  bio: string
  years_experience: number
  certifications: string[]
  specialties: string[]
  languages: string[]
  price_per_hour: number
  offers_home_service: boolean
  location_address: string
  avatar_url: string
}

export default function TabConfiguracion() {
  const [profile, setProfile] = useState<ProfileData>({
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    bio: '',
    years_experience: 0,
    certifications: [],
    specialties: [],
    languages: [],
    price_per_hour: 0,
    offers_home_service: false,
    location_address: '',
    avatar_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newCertification, setNewCertification] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/coaches/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile({
          nombre: data.profile.nombre || '',
          apellido: data.profile.apellido || '',
          telefono: data.profile.telefono || '',
          ciudad: data.profile.ciudad || '',
          bio: data.profile.bio || '',
          years_experience: data.profile.years_experience || 0,
          certifications: data.profile.certifications || [],
          specialties: data.profile.specialties || [],
          languages: data.profile.languages || [],
          price_per_hour: data.profile.price_per_hour || 0,
          offers_home_service: data.profile.offers_home_service || false,
          location_address: data.profile.location_address || '',
          avatar_url: data.profile.avatar_url || '',
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/coaches/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        alert('✅ Perfil actualizado exitosamente')
      } else {
        alert('❌ Error al actualizar perfil')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('❌ Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  const toggleSpecialty = (specialty: string) => {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const toggleLanguage = (language: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }))
      setNewCertification('')
    }
  }

  const removeCertification = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botón Guardar Sticky */}
      <div className="sticky top-0 z-10 bg-neutral-50 py-4 -mt-4 border-b border-neutral-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Información Básica */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Información básica</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={profile.nombre}
              onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Apellido *
            </label>
            <input
              type="text"
              value={profile.apellido}
              onChange={(e) => setProfile({ ...profile, apellido: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tu apellido"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={profile.telefono}
              onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="+34 612 345 678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              value={profile.ciudad}
              onChange={(e) => setProfile({ ...profile, ciudad: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Valencia"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Biografía *
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Cuéntanos sobre ti, tu experiencia y tu enfoque como entrenador..."
          />
          <p className="text-sm text-neutral-600 mt-1">{profile.bio.length}/500 caracteres</p>
        </div>
      </div>

      {/* Información Profesional */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Información profesional</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Años de experiencia *
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={profile.years_experience}
              onChange={(e) =>
                setProfile({ ...profile, years_experience: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Certificaciones
            </label>
            <div className="space-y-2">
              {profile.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-neutral-100 rounded-lg text-sm">
                    {cert}
                  </span>
                  <button
                    onClick={() => removeCertification(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: RPTE Nivel 3"
                />
                <button
                  onClick={addCertification}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Especialidades *
            </label>
            <div className="flex flex-wrap gap-2">
              {['Técnica', 'Táctica', 'Principiantes', 'Competición', 'Físico', 'Mental'].map(
                (specialty) => (
                  <button
                    key={specialty}
                    onClick={() => toggleSpecialty(specialty)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profile.specialties.includes(specialty)
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {specialty}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Idiomas *
            </label>
            <div className="flex flex-wrap gap-2">
              {['Español', 'Inglés', 'Francés', 'Italiano', 'Portugués'].map((language) => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    profile.languages.includes(language)
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Precios y Servicios */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Precios y servicios</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Precio por hora *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">€</span>
              <input
                type="number"
                min="0"
                step="5"
                value={profile.price_per_hour}
                onChange={(e) =>
                  setProfile({ ...profile, price_per_hour: parseFloat(e.target.value) || 0 })
                }
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="45"
              />
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Los alumnos verán este precio + IVA
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.offers_home_service}
                onChange={(e) =>
                  setProfile({ ...profile, offers_home_service: e.target.checked })
                }
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-neutral-700">
                Ofrezco servicio a domicilio
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ubicación habitual
            </label>
            <input
              type="text"
              value={profile.location_address}
              onChange={(e) =>
                setProfile({ ...profile, location_address: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ej: Valencia Padel Center, Calle Ejemplo 123"
            />
          </div>
        </div>
      </div>

      {/* Botón Guardar al final */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
