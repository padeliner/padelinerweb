'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface UserPresenceIndicatorProps {
  userId: string
  showText?: boolean // Mostrar texto "En línea" o solo el indicador visual
  showLastSeen?: boolean // Mostrar "Hace X min" o solo "En línea/Desconectado"
  className?: string
}

export function UserPresenceIndicator({ 
  userId, 
  showText = true,
  showLastSeen = true,
  className = ''
}: UserPresenceIndicatorProps) {
  const [status, setStatus] = useState<'online' | 'offline'>('offline')
  const [lastSeen, setLastSeen] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Cargar presencia inicial
    loadPresence()

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel(`presence:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          const presence = payload.new
          if (presence) {
            setStatus(presence.status)
            setLastSeen(presence.last_seen)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const loadPresence = async () => {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setStatus(data.status)
        setLastSeen(data.last_seen)
      }
    } catch (error) {
      console.error('Error loading presence:', error)
    }
  }

  const getLastSeenText = () => {
    if (status === 'online') {
      return 'En línea'
    }

    // Si no queremos mostrar "Hace X min", solo mostrar "Desconectado"
    if (!showLastSeen) {
      return 'Desconectado'
    }

    if (!lastSeen) {
      return 'Desconectado'
    }

    try {
      const lastSeenDate = new Date(lastSeen)
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60))

      // Menos de 1 minuto
      if (diffMinutes < 1) {
        return 'Hace un momento'
      }

      // Menos de 60 minutos
      if (diffMinutes < 60) {
        return `Hace ${diffMinutes} min`
      }

      // Menos de 24 horas
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60)
        return `Hace ${hours}h`
      }

      // Más de 24 horas
      return formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: es })
    } catch {
      return 'Desconectado'
    }
  }

  if (!showText) {
    // Solo mostrar el indicador visual (punto verde)
    return (
      <div className={`relative ${className}`}>
        {status === 'online' && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`text-xs ${status === 'online' ? 'text-green-600 font-medium' : 'text-neutral-500'}`}>
        {getLastSeenText()}
      </span>
    </div>
  )
}
