import { useEffect, useCallback } from 'react'

const HEARTBEAT_INTERVAL = 30 * 1000 // 30 segundos (como WhatsApp)

export function useUserPresence(enabled: boolean = true) {
  const sendHeartbeat = useCallback(async () => {
    try {
      await fetch('/api/presence/heartbeat', {
        method: 'POST'
      })
    } catch (error) {
      // Silencioso
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

    // Enviar heartbeat cuando la página vuelve a estar visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup: Marcar como offline al desmontar o cerrar
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Marcar como offline al salir de /mensajes
      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'offline' }),
        keepalive: true // Importante: permite que la request se complete aunque la página se cierre
      }).catch(() => {})
    }
  }, [enabled, sendHeartbeat])
}
