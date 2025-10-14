'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserPlus, Award, DollarSign, Calendar, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  icon: any
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        // Por ahora mostraremos los últimos usuarios registrados
        const { data: recentUsers } = await supabase
          .from('users')
          .select('id, full_name, role, created_at')
          .order('created_at', { ascending: false })
          .limit(10)

        const formattedActivities: Activity[] = (recentUsers || []).map((user: any) => ({
          id: user.id,
          type: 'user_registered',
          description: `${user.full_name || 'Usuario'} se registró como ${user.role}`,
          timestamp: user.created_at,
          icon: UserPlus,
        }))

        setActivities(formattedActivities)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [supabase])

  const getIconColor = (type: string) => {
    switch (type) {
      case 'user_registered':
        return 'bg-blue-50 text-blue-600'
      case 'certification':
        return 'bg-yellow-50 text-yellow-600'
      case 'payment':
        return 'bg-green-50 text-green-600'
      case 'reservation':
        return 'bg-purple-50 text-purple-600'
      case 'report':
        return 'bg-red-50 text-red-600'
      default:
        return 'bg-neutral-50 text-neutral-600'
    }
  }

  return (
    <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Actividad Reciente</h3>
      <p className="text-sm text-neutral-600 dark-admin:text-slate-400 mt-1">Últimas 10 actividades</p>

      <div className="divide-y divide-neutral-200 dark-admin:divide-slate-700 mt-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center space-x-4">
              <div className="w-10 h-10 bg-neutral-200 dark-admin:bg-slate-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-neutral-200 dark-admin:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-neutral-200 dark-admin:bg-slate-700 rounded animate-pulse mt-2"></div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <p>No hay actividad reciente</p>
          </div>
        ) : (
          activities.map((activity) => {
            const ActivityIcon = activity.icon
            return (
              <div key={activity.id} className="p-4 hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getIconColor(activity.type)}`}>
                    <ActivityIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 dark-admin:text-slate-100">{activity.description}</p>
                    <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true,
                        locale: es 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
