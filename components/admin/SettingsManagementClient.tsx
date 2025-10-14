'use client'

import { useState } from 'react'
import { Settings, Globe, CreditCard, Mail, Bell, Shield, Database, Users } from 'lucide-react'

export function SettingsManagementClient() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    siteName: 'Padeliner',
    siteUrl: 'https://padeliner.com',
    supportEmail: 'soporte@padeliner.com',
    commissionRate: 10,
    minBookingHours: 1,
    maxBookingHours: 48,
    enableNotifications: true,
    enableEmailMarketing: false,
    maintenanceMode: false,
    allowNewRegistrations: true
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'database', label: 'Base de Datos', icon: Database }
  ]

  const handleSave = () => {
    alert('Configuración guardada correctamente')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Configuración del Sistema</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Gestiona los ajustes de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors mb-1 ${
                    activeTab === tab.id
                      ? 'bg-green-50 dark-admin:bg-green-900/20 text-green-600 dark-admin:text-green-400'
                      : 'text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-50 dark-admin:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Configuración General</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                        Nombre del Sitio
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                        URL del Sitio
                      </label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                        Email de Soporte
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark-admin:border-slate-700 pt-6">
                  <h3 className="text-md font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Opciones del Sistema</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                      <span className="text-sm text-neutral-700 dark-admin:text-slate-300">Modo Mantenimiento</span>
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                      <span className="text-sm text-neutral-700 dark-admin:text-slate-300">Permitir Nuevos Registros</span>
                      <input
                        type="checkbox"
                        checked={settings.allowNewRegistrations}
                        onChange={(e) => setSettings({ ...settings, allowNewRegistrations: e.target.checked })}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Configuración de Pagos</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                      Tasa de Comisión (%)
                    </label>
                    <input
                      type="number"
                      value={settings.commissionRate}
                      onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                    />
                    <p className="text-xs text-neutral-500 dark-admin:text-slate-400 mt-1">
                      Comisión aplicada a todas las transacciones
                    </p>
                  </div>
                  <div className="bg-blue-50 dark-admin:bg-blue-900/20 border border-blue-200 dark-admin:border-blue-900/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 dark-admin:text-blue-400 mb-2">Métodos de Pago Activos</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800 dark-admin:text-blue-300">Tarjeta de Crédito/Débito</span>
                        <span className="px-2 py-1 text-xs bg-green-100 dark-admin:bg-green-900/20 text-green-700 dark-admin:text-green-400 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800 dark-admin:text-blue-300">PayPal</span>
                        <span className="px-2 py-1 text-xs bg-green-100 dark-admin:bg-green-900/20 text-green-700 dark-admin:text-green-400 rounded">Activo</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800 dark-admin:text-blue-300">Transferencia Bancaria</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark-admin:bg-gray-900/20 text-gray-700 dark-admin:text-gray-400 rounded">Inactivo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Configuración de Email</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark-admin:bg-yellow-900/20 border border-yellow-200 dark-admin:border-yellow-900/40 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark-admin:text-yellow-300">
                      La configuración SMTP se gestiona a través de variables de entorno por seguridad.
                    </p>
                  </div>
                  <label className="flex items-center justify-between p-3 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 block">Email Marketing</span>
                      <span className="text-xs text-neutral-500 dark-admin:text-slate-400">Enviar newsletters y promociones</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableEmailMarketing}
                      onChange={(e) => setSettings({ ...settings, enableEmailMarketing: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Configuración de Notificaciones</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 block">Notificaciones Push</span>
                      <span className="text-xs text-neutral-500 dark-admin:text-slate-400">Enviar notificaciones al navegador</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 block">Notificaciones de Reservas</span>
                      <span className="text-xs text-neutral-500 dark-admin:text-slate-400">Avisos sobre nuevas reservas</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-neutral-50 dark-admin:bg-slate-900 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-neutral-700 dark-admin:text-slate-300 block">Notificaciones de Pagos</span>
                      <span className="text-xs text-neutral-500 dark-admin:text-slate-400">Avisos sobre transacciones</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Configuración de Seguridad</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 dark-admin:bg-green-900/20 border border-green-200 dark-admin:border-green-900/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-900 dark-admin:text-green-400 mb-2">Estado de Seguridad</h3>
                    <div className="space-y-2 text-sm text-green-800 dark-admin:text-green-300">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        SSL/TLS Activo
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        RLS Policies Configuradas
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        Autenticación 2FA Disponible
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                      Tiempo de Sesión (minutos)
                    </label>
                    <input
                      type="number"
                      defaultValue={60}
                      className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark-admin:text-slate-100 mb-4">Base de Datos</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark-admin:bg-blue-900/20 border border-blue-200 dark-admin:border-blue-900/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 dark-admin:text-blue-400 mb-2">Estado de la Base de Datos</h3>
                    <div className="space-y-2 text-sm text-blue-800 dark-admin:text-blue-300">
                      <div className="flex justify-between">
                        <span>Tipo:</span>
                        <span className="font-medium">PostgreSQL (Supabase)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estado:</span>
                        <span className="font-medium text-green-600 dark-admin:text-green-400">Conectado</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Último Backup:</span>
                        <span className="font-medium">Hace 2 horas</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Ejecutar Backup
                    </button>
                    <button className="flex-1 px-4 py-2 bg-neutral-200 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg hover:bg-neutral-300 dark-admin:hover:bg-slate-600 transition-colors">
                      Ver Logs
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-200 dark-admin:border-slate-700 flex justify-end space-x-3">
              <button className="px-6 py-2 bg-neutral-200 dark-admin:bg-slate-700 text-neutral-700 dark-admin:text-slate-300 rounded-lg hover:bg-neutral-300 dark-admin:hover:bg-slate-600 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
