'use client'

import { useEffect, useState } from 'react'
import { Users, Search, Calendar, MessageCircle, FileText } from 'lucide-react'

interface Student {
  id: string
  full_name: string
  avatar_url: string
  total_classes: number
  completed_classes: number
  pending_classes: number
  last_class_date: string
  notes: string
}

export default function TabAlumnos() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentNotes, setStudentNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const res = await fetch('/api/coaches/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedStudent) return

    try {
      setSavingNotes(true)
      const res = await fetch(`/api/coaches/students/${selectedStudent.id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: studentNotes }),
      })

      if (res.ok) {
        alert('✅ Notas guardadas exitosamente')
        loadStudents()
      } else {
        alert('❌ Error al guardar notas')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('❌ Error al guardar notas')
    } finally {
      setSavingNotes(false)
    }
  }

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con búsqueda */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Mis Alumnos</h2>
          <span className="ml-auto px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            {students.length} alumnos
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alumno por nombre..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Lista de Alumnos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
            <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {searchQuery ? 'No se encontraron alumnos' : 'Aún no tienes alumnos'}
            </h3>
            <p className="text-neutral-600">
              {searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'Los alumnos aparecerán aquí después de su primera clase contigo'}
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
              onClick={() => {
                setSelectedStudent(student)
                setStudentNotes(student.notes || '')
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                    <Users className="w-6 h-6 text-neutral-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 truncate">
                    {student.full_name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {student.completed_classes} clases completadas
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Clases totales:</span>
                  <span className="font-semibold text-neutral-900">
                    {student.total_classes}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Pendientes:</span>
                  <span className="font-semibold text-orange-600">
                    {student.pending_classes}
                  </span>
                </div>
                {student.last_class_date && (
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-600">
                      Última clase:{' '}
                      {new Date(student.last_class_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalles del Alumno */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                {selectedStudent.avatar_url ? (
                  <img
                    src={selectedStudent.avatar_url}
                    alt={selectedStudent.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
                    <Users className="w-8 h-8 text-neutral-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {selectedStudent.full_name}
                  </h2>
                  <p className="text-neutral-600">
                    {selectedStudent.completed_classes} clases completadas
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="ml-auto text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedStudent.total_classes}
                  </p>
                  <p className="text-sm text-neutral-600">Total clases</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedStudent.completed_classes}
                  </p>
                  <p className="text-sm text-neutral-600">Completadas</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedStudent.pending_classes}
                  </p>
                  <p className="text-sm text-neutral-600">Pendientes</p>
                </div>
              </div>

              {/* Notas Privadas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-neutral-600" />
                  <h3 className="font-semibold text-neutral-900">Notas privadas</h3>
                </div>
                <textarea
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Añade notas sobre este alumno (nivel, objetivos, áreas de mejora, etc.)"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-3 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {savingNotes ? 'Guardando...' : 'Guardar notas'}
                </button>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <a
                  href={`/mensajes?user=${selectedStudent.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar mensaje
                </a>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-6 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
