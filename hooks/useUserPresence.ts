import { useEffect, useCallback } from 'react'

const HEARTBEAT_INTERVAL = 30 * 1000 // 30 segundos (como WhatsApp)

export function useUserPresence(enabled: boolean = true) {
  const sendHeartbeat = useCallback(async () => {
    try {
      await fetch('/api/presence/heartbeat', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error sending heartbeat:', error)
      // No mostramos error al usuario - heartbeat no es crítico
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Enviar heartbeat inmediatamente al montar
    sendHeartbeat()

    // Configurar interval para heartbeats periódicos
    const intervalId = setInterval(() => {
      sendHeartbeat()
    }, HEARTBEAT_INTERVAL)

    // Enviar heartbeat cuando la página está a punto de cerrarse
    const handleBeforeUnload = () => {
      // Marcar como offline al cerrar
      navigator.sendBeacon('/api/presence/heartbeat', JSON.stringify({ status: 'offline' }))
    }

    // Enviar heartbeat cuando la página vuelve a estar visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      clearInterval(intervalId)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, sendHeartbeat])
}
