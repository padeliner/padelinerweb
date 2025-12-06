'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { mockCoaches } from '@/lib/mock-data/coaches'
import { Calendar, Clock, MapPin, Users, Home, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

type ClassType = 'individual' | 'group'
type LocationType = 'club' | 'home'

export default function ReservarPage() {
  const params = useParams()
  const router = useRouter()
  const coachId = parseInt(params.id as string)
  const coach = mockCoaches.find(c => c.id === coachId)

  const [step, setStep] = useState(1)
  const [classType, setClassType] = useState<ClassType>('individual')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [locationType, setLocationType] = useState<LocationType>('club')
  const [numberOfPeople, setNumberOfPeople] = useState(1)

  // Generar calendario del mes actual
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  // Horarios disponibles (mock)
  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '16:00', '17:00', '18:00', '19:00', '20:00'
  ]

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const calculatePrice = () => {
    if (!coach) return 0
    let price = coach.pricePerHour
    if (classType === 'group') {
      price = price * 0.7 // 30% descuento en clases grupales
    }
    if (locationType === 'home' && coach.offersHomeService) {
      price = price + 10 // +10€ por desplazamiento
    }
    return price
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Entrenador no encontrado</h1>
          <button onClick={() => router.push('/entrenadores')} className="text-primary-600 hover:text-primary-700 font-semibold">
            Volver a entrenadores
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push(`/entrenador/${coach.id}`)}
            className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver al perfil</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reservar Clase</h1>
                <p className="text-neutral-600 mb-8">con {coach.name}</p>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= s ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
                      }`}>
                        {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                      </div>
                      {s < 4 && (
                        <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary-500' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Tipo de Clase */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Tipo de clase</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setClassType('individual')}
                        className={`p-6 border-2 rounded-xl transition-all ${
                          classType === 'individual'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Users className="w-8 h-8 text-primary-600 mb-3" />
                        <h3 className="font-bold text-lg mb-2">Clase Individual</h3>
                        <p className="text-sm text-neutral-600 mb-3">Atención personalizada 1 a 1</p>
                        <p className="text-2xl font-bold text-primary-600">{coach.pricePerHour}€/h</p>
                      </button>

                      <button
                        onClick={() => setClassType('group')}
                        className={`p-6 border-2 rounded-xl transition-all ${
                          classType === 'group'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Users className="w-8 h-8 text-primary-600 mb-3" />
                        <h3 className="font-bold text-lg mb-2">Clase Grupal</h3>
                        <p className="text-sm text-neutral-600 mb-3">Hasta 4 personas</p>
                        <p className="text-2xl font-bold text-primary-600">{(coach.pricePerHour * 0.7).toFixed(0)}€/h</p>
                      </button>
                    </div>

                    {classType === 'group' && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Número de personas
                        </label>
                        <select
                          value={numberOfPeople}
                          onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                          className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        >
                          <option value={2}>2 personas</option>
                          <option value={3}>3 personas</option>
                          <option value={4}>4 personas</option>
                        </select>
                      </div>
                    )}

                    <button
                      onClick={() => setStep(2)}
                      className="w-full mt-6 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {/* Step 2: Seleccionar Fecha */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Seleccionar fecha</h2>
                    
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={previousMonth}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextMonth}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-6">
                      {dayNames.map((day) => (
                        <div key={day} className="text-center text-sm font-semibold text-neutral-600 py-2">
                          {day}
                        </div>
                      ))}
                      {days.map((date, index) => (
                        <button
                          key={index}
                          disabled={isDateDisabled(date)}
                          onClick={() => date && setSelectedDate(date)}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                            !date
                              ? 'invisible'
                              : isDateDisabled(date)
                              ? 'text-neutral-300 cursor-not-allowed'
                              : selectedDate?.toDateString() === date.toDateString()
                              ? 'bg-primary-500 text-white'
                              : 'hover:bg-neutral-100 text-neutral-900'
                          }`}
                        >
                          {date?.getDate()}
                        </button>
                      ))}
                    </div>

                    {selectedDate && (
                      <div className="p-4 bg-primary-50 rounded-xl mb-6">
                        <p className="text-sm text-primary-900">
                          <span className="font-semibold">Fecha seleccionada:</span> {formatDate(selectedDate)}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 px-6 py-3 border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 font-semibold rounded-xl transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!selectedDate}
                        className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Seleccionar Horario */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Seleccionar horario</h2>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                      {availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                            selectedTime === time
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-neutral-200 hover:border-neutral-300 text-neutral-900'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    {selectedTime && (
                      <div className="p-4 bg-primary-50 rounded-xl mb-6">
                        <p className="text-sm text-primary-900">
                          <span className="font-semibold">Horario seleccionado:</span> {selectedTime}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 px-6 py-3 border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 font-semibold rounded-xl transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        disabled={!selectedTime}
                        className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Ubicación y Confirmación */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Ubicación</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => setLocationType('club')}
                        className={`p-6 border-2 rounded-xl transition-all ${
                          locationType === 'club'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <MapPin className="w-8 h-8 text-primary-600 mb-3" />
                        <h3 className="font-bold text-lg mb-2">En el club</h3>
                        <p className="text-sm text-neutral-600">{coach.city}</p>
                      </button>

                      {coach.offersHomeService && (
                        <button
                          onClick={() => setLocationType('home')}
                          className={`p-6 border-2 rounded-xl transition-all ${
                            locationType === 'home'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <Home className="w-8 h-8 text-primary-600 mb-3" />
                          <h3 className="font-bold text-lg mb-2">A domicilio</h3>
                          <p className="text-sm text-neutral-600">+10€ por desplazamiento</p>
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 px-6 py-3 border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 font-semibold rounded-xl transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => alert('Reserva confirmada! (demo)')}
                        className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                      >
                        Confirmar Reserva
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumen Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Resumen de Reserva</h3>
                
                {/* Coach Info */}
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-neutral-200">
                  <img
                    src={coach.imageUrl}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-neutral-900">{coach.name}</p>
                    <p className="text-sm text-neutral-600">{coach.city}</p>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Tipo de clase</p>
                    <p className="font-semibold text-neutral-900">
                      {classType === 'individual' ? 'Individual' : `Grupal (${numberOfPeople} personas)`}
                    </p>
                  </div>

                  {selectedDate && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Fecha</p>
                      <p className="font-semibold text-neutral-900">
                        {selectedDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  )}

                  {selectedTime && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Horario</p>
                      <p className="font-semibold text-neutral-900">{selectedTime}</p>
                    </div>
                  )}

                  {step >= 4 && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Ubicación</p>
                      <p className="font-semibold text-neutral-900">
                        {locationType === 'club' ? 'En el club' : 'A domicilio'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Precio clase</span>
                    <span className="font-semibold">{coach.pricePerHour}€</span>
                  </div>
                  {classType === 'group' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento grupal (30%)</span>
                      <span className="font-semibold">-{(coach.pricePerHour * 0.3).toFixed(0)}€</span>
                    </div>
                  )}
                  {locationType === 'home' && coach.offersHomeService && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Desplazamiento</span>
                      <span className="font-semibold">+10€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total</span>
                    <span className="text-primary-600">{calculatePrice()}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
