'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Save, X, Trash2, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'

export default function MiPerfilPage() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [activeTab, setActiveTab] = useState<'perfil' | 'reservas'>('perfil')
  const [reservations, setReservations] = useState<any[]>([])
  const [loadingReservations, setLoadingReservations] = useState(false)
  
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

  useEffect(() => {
    if (user && activeTab === 'reservas') {
      loadReservations()
    }
  }, [user, activeTab])

  const loadReservations = async () => {
    if (!user) return
    
    setLoadingReservations(true)
    try {
      // Mock data - en producción vendría de tu tabla de reservas en Supabase
      // const { data, error } = await supabase
      //   .from('reservas')
      //   .select('*, entrenador:entrenadores(*)')
      //   .eq('usuario_id', user.id)
      //   .order('fecha', { ascending: false })
      
      // Mock data de ejemplo
      setReservations([
        {
          id: 1,
          entrenador: { name: 'Carlos Martínez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
          fecha: '2024-03-20',
          hora: '10:00',
          tipo: 'Individual',
          precio: 50,
          estado: 'confirmada',
        },
        {
          id: 2,
          entrenador: { name: 'Laura Sánchez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
          fecha: '2024-03-15',
          hora: '16:00',
          tipo: 'Grupal',
          precio: 35,
          estado: 'completada',
        },
      ])
    } catch (error) {
      console.error('Error loading reservations:', error)
    } finally {
      setLoadingReservations(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
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

  const handleDeleteAccount = async () => {
    if (!user) return
    if (deleteConfirmText !== 'ELIMINAR') {
      alert('Por favor, escribe "ELIMINAR" para confirmar')
      return
    }

    setDeleting(true)
    try {
      // 1. Eliminar el perfil de la tabla users
      const { error: deleteProfileError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (deleteProfileError) throw deleteProfileError

      // 2. Eliminar el usuario de Auth
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
        user.id
      )

      if (deleteUserError) {
        // Si falla el borrado de auth, intentar con el método del cliente
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw signOutError
      }

      // 3. Cerrar sesión y redirigir
      alert('Tu cuenta ha sido eliminada correctamente')
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error al eliminar la cuenta. Por favor, contacta con soporte.')
    } finally {
      setDeleting(false)
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

            {/* Tabs */}
            <div className="border-b border-neutral-200">
              <div className="flex px-6 sm:px-8">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                    activeTab === 'perfil'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => setActiveTab('reservas')}
                  className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                    activeTab === 'reservas'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Mis Reservas
                </button>
              </div>
            </div>

            {/* Contenido de pestañas */}
            <div className="p-6 sm:p-8">
              {activeTab === 'perfil' && (
                <>
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

                  {/* Acciones de cuenta */}
                  <div className="mt-8 pt-6 border-t border-neutral-200 space-y-4">
                    {/* Cerrar Sesión */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-6 py-3 bg-neutral-50 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Cerrar Sesión</span>
                    </button>

                    {/* Eliminar Cuenta */}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Eliminar mi cuenta</span>
                    </button>
                  </div>
                </>
              )}

              {/* Tab de Reservas */}
              {activeTab === 'reservas' && (
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-6">Mis Reservas</h2>
                  
                  {loadingReservations ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto mb-4"></div>
                      <p className="text-neutral-600">Cargando reservas...</p>
                    </div>
                  ) : reservations.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-4">No tienes reservas todavía</p>
                      <button
                        onClick={() => router.push('/entrenadores')}
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                      >
                        Buscar Entrenadores
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <div key={reservation.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Info del entrenador */}
                            <div className="flex items-center space-x-4">
                              <img
                                src={reservation.entrenador.avatar}
                                alt={reservation.entrenador.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold text-neutral-900">{reservation.entrenador.name}</p>
                                <p className="text-sm text-neutral-600">{reservation.tipo}</p>
                              </div>
                            </div>

                            {/* Detalles de la reserva */}
                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6">
                              <div>
                                <p className="text-xs text-neutral-500 mb-1">Fecha</p>
                                <p className="text-sm font-semibold text-neutral-900">
                                  {new Date(reservation.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-500 mb-1">Hora</p>
                                <p className="text-sm font-semibold text-neutral-900">{reservation.hora}</p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-500 mb-1">Precio</p>
                                <p className="text-sm font-semibold text-primary-600">{reservation.precio}€</p>
                              </div>
                              <div>
                                {reservation.estado === 'confirmada' ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Confirmada
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200 text-neutral-700">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Completada
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">¿Eliminar cuenta?</h3>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-neutral-600">
                Esta acción es <span className="font-bold text-red-600">permanente e irreversible</span>.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">Se eliminará:</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>Tu perfil y toda tu información personal</li>
                  <li>Tu historial de reservas</li>
                  <li>Tus mensajes y conversaciones</li>
                  <li>Tu cuenta de acceso</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Para confirmar, escribe <span className="font-bold text-red-600">ELIMINAR</span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Escribe ELIMINAR"
                  className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'ELIMINAR'}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Eliminando...' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
