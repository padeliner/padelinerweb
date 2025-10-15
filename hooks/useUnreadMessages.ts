import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from './useAuth'

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()

  // Función para obtener el conteo
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) {
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/messages/unread-count')
      const data = await response.json()
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()

    if (!isAuthenticated || !user) return

    // Suscribirse a cambios en tiempo real
    const supabase = createClient()

    // Escuchar nuevos mensajes
    const messagesChannel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=neq.${user.id}` // Solo mensajes de otros
        },
        (payload: any) => {
          console.log('Nuevo mensaje recibido:', payload)
          // Incrementar contador si no somos el remitente
          setUnreadCount(prev => prev + 1)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_conversation_participants',
          filter: `user_id=eq.${user.id}` // Solo nuestras actualizaciones
        },
        (payload: any) => {
          console.log('Actualización de last_read_at:', payload)
          // Cuando marcamos como leído, refrescar el conteo
          fetchUnreadCount()
        }
      )
      .subscribe()

    // Polling cada 30 segundos como fallback
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => {
      supabase.removeChannel(messagesChannel)
      clearInterval(interval)
    }
  }, [isAuthenticated, user?.id])

  return { unreadCount, loading, refresh: fetchUnreadCount }
}
