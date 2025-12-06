'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface AvatarUploadProps {
  currentAvatar?: string | null
  onUploadComplete: (url: string) => void
  userId: string
}

export function AvatarUpload({ currentAvatar, onUploadComplete, userId }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede pesar más de 5MB')
      return
    }

    setUploading(true)

    try {
      // Crear preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading:', uploadError)
        throw uploadError
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('player_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        throw updateError
      }

      // Notificar al componente padre
      onUploadComplete(publicUrl)

      alert('Imagen actualizada correctamente')

    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message || 'Error al subir la imagen')
      setPreview(currentAvatar || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!confirm('¿Eliminar tu foto de perfil?')) return

    setUploading(true)

    try {
      // Actualizar en la base de datos
      const { error } = await supabase
        .from('player_profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId)

      if (error) throw error

      setPreview(null)
      onUploadComplete('')

      alert('Foto eliminada correctamente')

    } catch (error: any) {
      console.error('Error:', error)
      alert('Error al eliminar la foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-200 border-4 border-white shadow-lg">
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-400">
              👤
            </div>
          )}
        </div>

        {/* Camera Button Overlay */}
        {!uploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            type="button"
          >
            <Camera className="w-5 h-5" />
          </button>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          type="button"
        >
          <Upload className="w-4 h-4" />
          Subir Foto
        </button>

        {preview && (
          <button
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            type="button"
          >
            <X className="w-4 h-4" />
            Eliminar
          </button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-neutral-500 text-center max-w-xs">
        Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
      </p>
    </div>
  )
}
