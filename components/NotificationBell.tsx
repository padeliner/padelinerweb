'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  action_url: string | null
  icon: string | null
  read: boolean
  priority: string
  created_at: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
    
    // Refrescar cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/players/me/notifications?limit=10')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unread_count)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/players/me/notifications/${id}/read`, {
        method: 'PATCH'
      })
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/players/me/notifications', {
        method: 'PATCH'
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    
    if (seconds < 60) return 'Hace un momento'
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`
    return `Hace ${Math.floor(seconds / 86400)} días`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300'
      case 'normal': return 'bg-blue-100 border-blue-300'
      case 'low': return 'bg-neutral-100 border-neutral-300'
      default: return 'bg-neutral-100 border-neutral-300'
    }
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-neutral-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-neutral-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div>
                <h3 className="font-bold text-neutral-900">Notificaciones</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-neutral-600">{unreadCount} sin leer</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Marcar todas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id)
                        }
                        if (notification.action_url) {
                          window.location.href = notification.action_url
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getPriorityColor(notification.priority)}`}>
                          {notification.icon || '🔔'}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-neutral-900">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-700 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {getTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-neutral-200 p-3">
                <a
                  href="/dashboard/jugador?tab=notifications"
                  className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas las notificaciones
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
