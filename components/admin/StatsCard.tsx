import { LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  loading?: boolean
  color?: 'green' | 'blue' | 'purple' | 'orange'
  trend?: {
    value: number
    label: string
  }
}

const colorClasses = {
  green: 'bg-green-50 text-green-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  loading, 
  color = 'green',
  trend 
}: StatsCardProps) {
  return (
    <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark-admin:text-slate-400">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 bg-neutral-200 dark-admin:bg-slate-700 rounded animate-pulse"></div>
          ) : (
            <p className="mt-2 text-3xl font-bold text-neutral-900 dark-admin:text-slate-100">{value}</p>
          )}
          {trend && !loading && (
            <div className="mt-2 flex items-center text-xs text-green-600 dark-admin:text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+{trend.value} {trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-full', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
