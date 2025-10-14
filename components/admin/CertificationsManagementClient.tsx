'use client'

import { useState, useMemo } from 'react'
import { Search, Award, CheckCircle, XCircle, Clock, Eye, FileText, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Certification {
  id: string
  user_name: string
  user_email: string
  certification_type: string
  certification_name: string
  issuing_organization: string
  issue_date: string
  expiry_date: string | null
  certificate_number: string
  document_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}

// Datos mock de ejemplo
const mockCertifications: Certification[] = [
  {
    id: '1',
    user_name: 'Ana Martínez',
    user_email: 'ana.martinez@email.com',
    certification_type: 'RPT',
    certification_name: 'Técnico Nivel 2 RPT',
    issuing_organization: 'Real Federación Española de Tenis',
    issue_date: '2024-03-15',
    expiry_date: '2026-03-15',
    certificate_number: 'RPT-2024-1234',
    document_url: 'https://example.com/cert1.pdf',
    status: 'pending',
    reviewed_at: null,
    rejection_reason: null,
    created_at: '2025-10-10T10:30:00Z'
  },
  {
    id: '2',
    user_name: 'Carlos Rodríguez',
    user_email: 'carlos.rodriguez@email.com',
    certification_type: 'RFET',
    certification_name: 'Entrenador Nacional Nivel 1',
    issuing_organization: 'Real Federación Española de Tenis',
    issue_date: '2023-06-20',
    expiry_date: null,
    certificate_number: 'RFET-EN1-2023-567',
    document_url: 'https://example.com/cert2.pdf',
    status: 'approved',
    reviewed_at: '2025-10-11T14:20:00Z',
    rejection_reason: null,
    created_at: '2025-10-09T15:45:00Z'
  },
  {
    id: '3',
    user_name: 'Laura Fernández',
    user_email: 'laura.fernandez@email.com',
    certification_type: 'FEP',
    certification_name: 'Monitor de Pádel FEP',
    issuing_organization: 'Federación Española de Pádel',
    issue_date: '2024-01-10',
    expiry_date: '2025-01-10',
    certificate_number: 'FEP-MON-2024-890',
    document_url: null,
    status: 'rejected',
    reviewed_at: '2025-10-12T09:15:00Z',
    rejection_reason: 'El documento adjunto no es legible. Por favor, sube una imagen más clara del certificado.',
    created_at: '2025-10-08T11:20:00Z'
  },
  {
    id: '4',
    user_name: 'Miguel Torres',
    user_email: 'miguel.torres@email.com',
    certification_type: 'RFET',
    certification_name: 'Entrenador Nacional Nivel 2',
    issuing_organization: 'Real Federación Española de Tenis',
    issue_date: '2024-09-05',
    expiry_date: null,
    certificate_number: 'RFET-EN2-2024-321',
    document_url: 'https://example.com/cert4.pdf',
    status: 'approved',
    reviewed_at: '2025-10-13T16:30:00Z',
    rejection_reason: null,
    created_at: '2025-10-12T08:00:00Z'
  },
  {
    id: '5',
    user_name: 'Sara Jiménez',
    user_email: 'sara.jimenez@email.com',
    certification_type: 'PTR',
    certification_name: 'PTR Professional',
    issuing_organization: 'Professional Tennis Registry',
    issue_date: '2023-11-30',
    expiry_date: '2025-11-30',
    certificate_number: 'PTR-PRO-2023-445',
    document_url: 'https://example.com/cert5.pdf',
    status: 'pending',
    reviewed_at: null,
    rejection_reason: null,
    created_at: '2025-10-13T12:45:00Z'
  }
]

export function CertificationsManagementClient() {
  const [certifications] = useState<Certification[]>(mockCertifications)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const stats = useMemo(() => ({
    total: certifications.length,
    pending: certifications.filter(c => c.status === 'pending').length,
    approved: certifications.filter(c => c.status === 'approved').length,
    rejected: certifications.filter(c => c.status === 'rejected').length
  }), [certifications])

  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = 
        cert.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certification_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [certifications, searchTerm, statusFilter])

  const handleApprove = (certId: string) => {
    alert(`Certificación ${certId} aprobada (DEMO)`)
    setShowModal(false)
  }

  const handleReject = (certId: string) => {
    if (!rejectionReason.trim()) {
      alert('Por favor, proporciona un motivo de rechazo')
      return
    }
    alert(`Certificación ${certId} rechazada (DEMO)\nMotivo: ${rejectionReason}`)
    setShowModal(false)
    setRejectionReason('')
  }

  const openModal = (cert: Certification) => {
    setSelectedCert(cert)
    setShowModal(true)
    setRejectionReason('')
  }

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      pending: { 
        label: 'Pendiente', 
        color: 'bg-yellow-100 text-yellow-700 dark-admin:bg-yellow-900/20 dark-admin:text-yellow-400',
        icon: Clock
      },
      approved: { 
        label: 'Aprobada', 
        color: 'bg-green-100 text-green-700 dark-admin:bg-green-900/20 dark-admin:text-green-400',
        icon: CheckCircle
      },
      rejected: { 
        label: 'Rechazada', 
        color: 'bg-red-100 text-red-700 dark-admin:bg-red-900/20 dark-admin:text-red-400',
        icon: XCircle
      }
    }
    const statusInfo = statuses[status]
    const Icon = statusInfo.icon
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100">Gestión de Certificaciones</h1>
        <p className="text-neutral-600 dark-admin:text-slate-400 mt-1">Revisa y aprueba certificaciones de entrenadores (DATOS MOCK)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Total</p>
              <p className="text-2xl font-bold text-neutral-900 dark-admin:text-slate-100 mt-1">{stats.total}</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 dark-admin:text-yellow-400 mt-1">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600 dark-admin:text-green-400 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark-admin:text-slate-400">Rechazadas</p>
              <p className="text-2xl font-bold text-red-600 dark-admin:text-red-400 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o certificación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-neutral-600 dark-admin:text-slate-400">
          Mostrando {filteredCertifications.length} de {certifications.length} certificaciones
        </div>
      </div>

      <div className="bg-white dark-admin:bg-slate-800 rounded-lg border border-neutral-200 dark-admin:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark-admin:bg-slate-900 border-b border-neutral-200 dark-admin:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Entrenador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Certificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Organización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Fecha Envío</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark-admin:text-slate-400 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark-admin:divide-slate-700">
              {filteredCertifications.map((cert) => (
                <tr key={cert.id} className="hover:bg-neutral-50 dark-admin:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark-admin:bg-blue-900/20 flex items-center justify-center text-blue-600 dark-admin:text-blue-400 font-bold">
                        {cert.user_name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{cert.user_name}</div>
                        <div className="text-sm text-neutral-500 dark-admin:text-slate-400">{cert.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{cert.certification_name}</div>
                    <div className="text-xs text-neutral-500 dark-admin:text-slate-400">{cert.certification_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {cert.issuing_organization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(cert.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark-admin:text-slate-400">
                    {formatDistanceToNow(new Date(cert.created_at), { addSuffix: true, locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openModal(cert)}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 dark-admin:bg-green-900/20 text-green-600 dark-admin:text-green-400 hover:bg-green-100 dark-admin:hover:bg-green-900/30 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCertifications.length === 0 && (
          <div className="p-8 text-center text-neutral-500 dark-admin:text-slate-400">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron certificaciones</p>
          </div>
        )}
      </div>

      {showModal && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark-admin:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-neutral-200 dark-admin:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark-admin:text-slate-100">Detalles de Certificación</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-2">Entrenador</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark-admin:bg-blue-900/20 flex items-center justify-center text-blue-600 dark-admin:text-blue-400 font-bold text-lg">
                    {selectedCert.user_name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-neutral-900 dark-admin:text-slate-100">{selectedCert.user_name}</div>
                    <div className="text-sm text-neutral-500 dark-admin:text-slate-400">{selectedCert.user_email}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-1">Nombre</h3>
                  <p className="text-sm text-neutral-900 dark-admin:text-slate-100">{selectedCert.certification_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-1">Tipo</h3>
                  <p className="text-sm text-neutral-900 dark-admin:text-slate-100">{selectedCert.certification_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-1">Organización</h3>
                  <p className="text-sm text-neutral-900 dark-admin:text-slate-100">{selectedCert.issuing_organization}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-1">Nº Certificado</h3>
                  <p className="text-sm text-neutral-900 dark-admin:text-slate-100">{selectedCert.certificate_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-1">Fecha Emisión</h3>
                  <p className="text-sm text-neutral-900 dark-admin:text-slate-100">
                    {new Date(selectedCert.issue_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-1">Fecha Expiración</h3>
                  <p className="text-sm text-neutral-900 dark-admin:text-slate-100">
                    {selectedCert.expiry_date ? new Date(selectedCert.expiry_date).toLocaleDateString('es-ES') : 'Sin expiración'}
                  </p>
                </div>
              </div>

              {selectedCert.document_url && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-2">Documento</h3>
                  <a
                    href={selectedCert.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 dark-admin:bg-blue-900/20 text-blue-600 dark-admin:text-blue-400 rounded-lg hover:bg-blue-100 dark-admin:hover:bg-blue-900/30 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Documento
                  </a>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark-admin:text-slate-400 mb-2">Estado Actual</h3>
                {getStatusBadge(selectedCert.status)}
              </div>

              {selectedCert.status === 'rejected' && selectedCert.rejection_reason && (
                <div className="bg-red-50 dark-admin:bg-red-900/20 border border-red-200 dark-admin:border-red-900/40 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 dark-admin:text-red-400 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-900 dark-admin:text-red-400 mb-1">Motivo de Rechazo</h3>
                      <p className="text-sm text-red-700 dark-admin:text-red-300">{selectedCert.rejection_reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedCert.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark-admin:text-slate-300 mb-2">
                    Motivo de rechazo (opcional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explica por qué se rechaza esta certificación..."
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 dark-admin:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark-admin:bg-slate-700 text-neutral-900 dark-admin:text-slate-100"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 dark-admin:border-slate-700 p-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-neutral-700 dark-admin:text-slate-300 hover:bg-neutral-100 dark-admin:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cerrar
              </button>

              {selectedCert.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedCert.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleApprove(selectedCert.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
