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
    if (!userId) return

    let isMounted = true

    // Cargar presencia inicial
    loadPresence()

    // Polling cada 1 segundo para actualización instantánea
    const pollingInterval = setInterval(() => {
      if (isMounted) {
        loadPresence()
      }
    }, 1000)

    // Suscribirse a cambios en tiempo real con canal único
    const channelName = `presence-${userId}-${Math.random().toString(36).substring(7)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_presence',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          if (isMounted && payload.new) {
            console.log('🔄 Presencia actualizada:', payload.new.status)
            setStatus(payload.new.status)
            setLastSeen(payload.new.last_seen)
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      clearInterval(pollingInterval)
      supabase.removeChannel(channel)
    }
  }, [userId])

  const loadPresence = async () => {
    try {
      const startTime = Date.now()
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .single()

      const loadTime = Date.now() - startTime
      
      if (!error && data) {
        const changed = data.status !== status
        console.log(`📊 Polling (${loadTime}ms):`, {
          userId,
          status: data.status,
          lastSeen: data.last_seen,
          changed,
          oldStatus: status
        })
        setStatus(data.status)
        setLastSeen(data.last_seen)
      } else if (error) {
        console.error('❌ Error loading presence:', error)
      }
    } catch (error) {
      console.error('❌ Exception loading presence:', error)
    }
  }

  const getLastSeenText = () => {
    if (status === 'online') {
      return 'En línea'
    }

    // Si no queremos mostrar "Hace X min", no mostrar nada
    if (!showLastSeen) {
      return null
    }

    if (!lastSeen) {
      return 'Última vez hace un momento'
    }

    try {
      const lastSeenDate = new Date(lastSeen)
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60))

      // Menos de 1 minuto
      if (diffMinutes < 1) {
        return 'Última vez hace un momento'
      }

      // Menos de 60 minutos
      if (diffMinutes < 60) {
        return `Última vez hace ${diffMinutes} min`
      }

      // Menos de 24 horas
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60)
        return `Última vez hace ${hours}h`
      }

      // Más de 24 horas
      const formattedDate = formatDistanceToNow(lastSeenDate, { addSuffix: false, locale: es })
      return `Última vez ${formattedDate}`
    } catch {
      return 'Última vez hace un momento'
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

  const text = getLastSeenText()
  
  if (!text) {
    return null
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`text-xs ${status === 'online' ? 'text-green-600 font-medium' : 'text-neutral-500'}`}>
        {text}
      </span>
    </div>
  )
}
