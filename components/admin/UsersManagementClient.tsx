'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, UserPlus, Edit2, Trash2, Ban, CheckCircle, Crown, User as UserIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
  suspended_at: string | null
}

interface Stats {
  total: number
  active: number
  admins: number
  suspended: number
}

interface Props {
  initialUsers: User[]
  stats: Stats
}

export function UsersManagementClient({ initialUsers, stats: initialStats }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [stats, setStats] = useState(initialStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && !user.suspended_at) ||
        (statusFilter === 'suspended' && user.suspended_at)
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!confirm(`¿Cambiar el rol del usuario a "${newRole}"?`)) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      alert('Rol actualizado correctamente')
    } catch (error) {
      alert('Error al actualizar el rol')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSuspend = async (userId: string, currentlySuspended: boolean) => {
    const action = currentlySuspended ? 'activar' : 'suspender'
    if (!confirm(`¿Seguro que quieres ${action} este usuario?`)) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          suspended_at: currentlySuspended ? null : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, suspended_at: currentlySuspended ? null : new Date().toISOString() }
          : u
      ))

      // Actualizar stats
      if (currentlySuspended) {
        setStats({ ...stats, active: stats.active + 1, suspended: stats.suspended - 1 })
      } else {
        setStats({ ...stats, active: stats.active - 1, suspended: stats.suspended + 1 })
      }

      alert(`Usuario ${action === 'activar' ? 'activado' : 'suspendido'} correctamente`)
    } catch (error) {
      alert('Error al cambiar el estado del usuario')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      admin: { label: 'Admin', color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400' },
      entrenador: { label: 'Entrenador', color: 'bg-blue-100 text-blue-700 dark-admin:bg-blue-900/20 dark-admin:text-blue-400' },
      academia: { label: 'Academia', color: 'bg-purple-100 text-purple-700 dark-admin:bg-purple-900/20 dark-admin:text-purple-400' },
      club: { label: 'Club', color: 'bg-orange-100 text-orange-700 dark-admin:bg-orange-900/20 dark-admin:text-orange-400' },
      alumno: { label: 'Alumno', color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400' },
    }
    const roleInfo = roles[role] || { label: role, color: 'bg-gray-100 text-gray-700' }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
        {roleInfo.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Usuarios</h1>
          <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Administra todos los usuarios de la plataforma</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total</p>
              <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
            </div>
            <UserIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Activos</p>
              <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Admins</p>
              <p className="text-2xl font-bold text-red-600 dark-admin:text-red-400 mt-1">{stats.admins}</p>
            </div>
            <Crown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Suspendidos</p>
              <p className="text-2xl font-bold text-orange-600 dark-admin:text-orange-400 mt-1">{stats.suspended}</p>
            </div>
            <Ban className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 placeholder-neutral-400 dark-admin:placeholder-slate-400"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="entrenador">Entrenador</option>
              <option value="academia">Academia</option>
              <option value="club">Club</option>
              <option value="alumno">Alumno</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="suspended">Suspendidos</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-neutral-600 dark-admin:text-slate-400">
          <span>
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </span>
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setRoleFilter('all')
                setStatusFilter('all')
              }}
              className="text-green-600 dark-admin:text-green-400 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark-admin:bg-green-900/20 flex items-center justify-center text-green-600 dark-admin:text-green-400 font-bold">
                        {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">
                          {user.full_name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-neutral-500 dark-admin:text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.suspended_at ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400">
                        Suspendido
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400">
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Change Role */}
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        disabled={loading}
                        className="text-xs px-2 py-1 border border-neutral-300 dark-admin:border-slate-600 rounded focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100 disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="entrenador">Entrenador</option>
                        <option value="academia">Academia</option>
                        <option value="club">Club</option>
                        <option value="alumno">Alumno</option>
                      </select>

                      {/* Suspend/Activate */}
                      <button
                        onClick={() => handleToggleSuspend(user.id, !!user.suspended_at)}
                        disabled={loading}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                          user.suspended_at
                            ? 'text-green-600 hover:bg-green-50 dark-admin:text-green-400 dark-admin:hover:bg-green-900/20'
                            : 'text-red-600 hover:bg-red-50 dark-admin:text-red-400 dark-admin:hover:bg-red-900/20'
                        }`}
                        title={user.suspended_at ? 'Activar usuario' : 'Suspender usuario'}
                      >
                        {user.suspended_at ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <p>No se encontraron usuarios con los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  )
}
