'use client'

import { 
  Users, 
  GraduationCap, 
  Building2, 
  UserCheck, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { RecentActivity } from '@/components/admin/RecentActivity'

interface Stats {
  totalUsers: number
  trainers: number
  academies: number
  clubs: number
  students: number
  monthRevenue: number
  monthReservations: number
  newUsersWeek: number
}

interface AdminDashboardClientProps {
  stats: Stats
}

export function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Bienvenido al panel de administración de Padeliner</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: stats.newUsersWeek, label: 'últimos 7 días' }}
        />
        <StatsCard
          title="Entrenadores"
          value={stats.trainers}
          icon={GraduationCap}
          color="blue"
        />
        <StatsCard
          title="Academias"
          value={stats.academies}
          icon={Building2}
          color="purple"
        />
        <StatsCard
          title="Clubes"
          value={stats.clubs}
          icon={Building2}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Alumnos"
          value={stats.students}
          icon={UserCheck}
          color="green"
        />
        <StatsCard
          title="Ingresos del Mes"
          value={`${stats.monthRevenue}€`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Reservas del Mes"
          value={stats.monthReservations}
          icon={Calendar}
        />
        <StatsCard
          title="Nuevos (7 días)"
          value={stats.newUsersWeek}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts Section (TODO) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Evolución de Usuarios</h3>
          <div className="h-64 flex items-center justify-center text-neutral-400 dark-admin:text-slate-500">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico próximamente</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Ingresos Mensuales</h3>
          <div className="h-64 flex items-center justify-center text-neutral-400 dark-admin:text-slate-500">
            <div className="text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico próximamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
