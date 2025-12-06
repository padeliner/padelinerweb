# 📊 PROPUESTA: Dashboard del Entrenador - Parte 3: APIS Y FUNCIONALIDADES

## 🔌 APIS NECESARIAS

### 1. **Bookings API** - `/api/coaches/bookings`

#### GET - Listar reservas
```typescript
GET /api/coaches/bookings
Query params:
  - status: pending | confirmed | cancelled | completed
  - from_date: YYYY-MM-DD
  - to_date: YYYY-MM-DD
  - player_id: UUID

Response:
{
  bookings: [
    {
      id: "uuid",
      player: { id, name, avatar, level },
      date: "2025-01-20",
      start_time: "18:00",
      end_time: "19:00",
      duration: 60,
      class_type: "individual",
      location: "Valencia Padel Center",
      price: 45,
      status: "pending",
      payment_status: "pending",
      player_notes: "...",
      coach_notes: "..."
    }
  ],
  total: 156,
  stats: {
    pending: 3,
    confirmed: 12,
    completed: 134,
    cancelled: 7
  }
}
```

#### GET - Detalles de una reserva
```typescript
GET /api/coaches/bookings/:id

Response:
{
  id: "uuid",
  player: {
    id, name, avatar, email, phone,
    level, total_classes_with_me: 5
  },
  date: "2025-01-20",
  start_time: "18:00",
  end_time: "19:00",
  duration: 60,
  class_type: "individual",
  participants: 1,
  location_type: "coach_location",
  location_address: "Valencia Padel Center",
  price: 45,
  status: "pending",
  payment_status: "pending",
  player_notes: "Quiero mejorar mi derecha",
  coach_notes: "",
  created_at: "2025-01-18T10:30:00Z"
}
```

#### POST - Confirmar reserva
```typescript
POST /api/coaches/bookings/:id/confirm

Response:
{
  success: true,
  booking: { ... },
  notification_sent: true
}
```

#### POST - Rechazar reserva
```typescript
POST /api/coaches/bookings/:id/reject
Body:
{
  reason: "No disponible en ese horario"
}

Response:
{
  success: true,
  refund_issued: true
}
```

#### POST - Completar clase
```typescript
POST /api/coaches/bookings/:id/complete
Body:
{
  coach_notes: "Clase excelente, trabajamos derecha",
  actual_end_time: "19:15" // opcional
}

Response:
{
  success: true,
  booking: { ... },
  earnings_added: 45
}
```

#### POST - Cancelar reserva
```typescript
POST /api/coaches/bookings/:id/cancel
Body:
{
  reason: "Enfermedad",
  refund: true
}

Response:
{
  success: true,
  refund_issued: true,
  penalty: 0
}
```

---

### 2. **Availability API** - `/api/coaches/availability`

#### GET - Obtener disponibilidad
```typescript
GET /api/coaches/availability

Response:
{
  weekly_schedule: [
    {
      day_of_week: 1, // Lunes
      slots: [
        { start_time: "09:00", end_time: "13:00" },
        { start_time: "16:00", end_time: "21:00" }
      ]
    }
  ],
  blocked_dates: [
    {
      id: "uuid",
      date: "2025-01-25",
      start_time: null,
      end_time: null,
      reason: "Vacaciones"
    }
  ]
}
```

#### PUT - Actualizar horario semanal
```typescript
PUT /api/coaches/availability
Body:
{
  weekly_schedule: [
    {
      day_of_week: 1,
      slots: [
        { start_time: "09:00", end_time: "13:00" }
      ]
    }
  ]
}

Response:
{
  success: true,
  updated_at: "2025-01-18T12:00:00Z"
}
```

#### POST - Bloquear fecha
```typescript
POST /api/coaches/availability/block
Body:
{
  date: "2025-01-25",
  start_time: null, // null = todo el día
  end_time: null,
  reason: "Vacaciones"
}

Response:
{
  success: true,
  blocked_date: { ... }
}
```

#### DELETE - Desbloquear fecha
```typescript
DELETE /api/coaches/availability/block/:id

Response:
{
  success: true
}
```

---

### 3. **Calendar API** - `/api/coaches/calendar`

#### GET - Vista de calendario
```typescript
GET /api/coaches/calendar
Query params:
  - from_date: YYYY-MM-DD
  - to_date: YYYY-MM-DD
  - view: day | week | month

Response:
{
  events: [
    {
      id: "uuid",
      type: "booking",
      title: "María González",
      start: "2025-01-20T18:00:00",
      end: "2025-01-20T19:00:00",
      status: "confirmed",
      color: "#10b981",
      booking: { ... }
    },
    {
      id: "uuid",
      type: "blocked",
      title: "Bloqueado",
      start: "2025-01-25T00:00:00",
      end: "2025-01-25T23:59:59",
      color: "#6b7280"
    }
  ],
  available_slots: [
    {
      date: "2025-01-20",
      slots: [
        { start: "09:00", end: "10:00" },
        { start: "10:00", end: "11:00" }
      ]
    }
  ]
}
```

---

### 4. **Students API** - `/api/coaches/students`

#### GET - Listar alumnos
```typescript
GET /api/coaches/students
Query params:
  - status: active | inactive | all
  - search: string
  - sort_by: last_class | name | total_classes

Response:
{
  students: [
    {
      id: "uuid",
      name: "María González",
      avatar: "url",
      level: "intermediate",
      total_classes: 24,
      last_class_date: "2025-01-17",
      next_class_date: "2025-01-20",
      attendance_rate: 96,
      rating_given: 5.0
    }
  ],
  total: 45,
  active: 38,
  inactive: 7
}
```

#### GET - Perfil del alumno
```typescript
GET /api/coaches/students/:id

Response:
{
  id: "uuid",
  name: "María González",
  avatar: "url",
  email: "maria@example.com",
  phone: "+34123456789",
  level: "intermediate",
  goals: ["Mejorar derecha", "Juego en red"],
  stats: {
    total_classes: 24,
    first_class: "2024-03-15",
    last_class: "2025-01-17",
    attendance_rate: 96,
    no_shows: 1
  },
  next_class: {
    date: "2025-01-20",
    time: "18:00",
    location: "Valencia Padel"
  },
  coach_notes: "Progresa rápido. Trabajar smash.",
  class_history: [
    {
      date: "2025-01-17",
      duration: 60,
      type: "individual",
      rating: 5,
      notes: "Excelente progreso"
    }
  ]
}
```

#### PUT - Actualizar notas del alumno
```typescript
PUT /api/coaches/students/:id/notes
Body:
{
  notes: "Progresa rápido. Necesita trabajar más el smash."
}

Response:
{
  success: true
}
```

---

### 5. **Stats API** - `/api/coaches/stats`

#### GET - Estadísticas generales
```typescript
GET /api/coaches/stats
Query params:
  - period: today | week | month | year | custom
  - from: YYYY-MM-DD
  - to: YYYY-MM-DD

Response:
{
  overview: {
    total_students: 45,
    active_students: 38,
    upcoming_classes: 12,
    monthly_earnings: 1240,
    rating: 4.8,
    total_reviews: 24
  },
  classes: {
    total: 156,
    completed: 134,
    cancelled: 7,
    no_shows: 3,
    completion_rate: 93
  },
  earnings: {
    today: 90,
    week: 360,
    month: 1240,
    year: 14880,
    pending: 180,
    paid: 1060,
    average_per_class: 45
  },
  chart_data: {
    classes_per_day: [
      { date: "2025-01-13", count: 3 },
      { date: "2025-01-14", count: 5 }
    ],
    earnings_per_month: [
      { month: "2024-01", amount: 980 },
      { month: "2024-02", amount: 1120 }
    ]
  }
}
```

---

### 6. **Notifications API** - `/api/coaches/notifications`

#### GET - Listar notificaciones
```typescript
GET /api/coaches/notifications
Query params:
  - unread_only: boolean
  - limit: number

Response:
{
  notifications: [
    {
      id: "uuid",
      type: "new_booking",
      title: "Nueva reserva",
      message: "María González solicitó una clase",
      related_booking_id: "uuid",
      is_read: false,
      created_at: "2025-01-18T10:30:00Z"
    }
  ],
  unread_count: 3
}
```

#### POST - Marcar como leída
```typescript
POST /api/coaches/notifications/:id/read

Response:
{
  success: true
}
```

#### POST - Marcar todas como leídas
```typescript
POST /api/coaches/notifications/read-all

Response:
{
  success: true,
  marked: 5
}
```

---

### 7. **Finances API** - `/api/coaches/finances`

#### GET - Resumen financiero
```typescript
GET /api/coaches/finances
Query params:
  - period: month | year
  - month: YYYY-MM

Response:
{
  summary: {
    total_earned: 1240,
    pending: 180,
    paid: 1060,
    refunded: 0
  },
  transactions: [
    {
      id: "uuid",
      date: "2025-01-18",
      student: "María González",
      description: "Clase individual 60min",
      amount: 45,
      status: "paid",
      payment_method: "stripe"
    }
  ],
  chart_data: {
    monthly: [
      { month: "2024-01", amount: 980 },
      { month: "2024-02", amount: 1120 }
    ]
  }
}
```

#### GET - Exportar transacciones
```typescript
GET /api/coaches/finances/export
Query params:
  - format: csv | pdf
  - from: YYYY-MM-DD
  - to: YYYY-MM-DD

Response: File download
```

---

## 🔄 FLUJOS DE USUARIO PRINCIPALES

### 📝 FLUJO 1: Nuevo Alumno Reserva Clase

1. **Alumno** → Ve perfil del entrenador
2. **Alumno** → Click "Reservar Clase"
3. **Sistema** → Muestra calendario con disponibilidad
4. **Alumno** → Selecciona fecha, hora, tipo de clase
5. **Alumno** → Añade notas (opcional)
6. **Alumno** → Confirma y paga con Stripe
7. **Sistema** → Crea booking (status: pending)
8. **Sistema** → Envía notificación al entrenador
9. **Entrenador** → Recibe notificación push/email
10. **Entrenador** → Abre dashboard, ve nueva solicitud
11. **Entrenador** → Revisa detalles y perfil del alumno
12. **Entrenador** → Click "Aceptar" o "Rechazar"
13. **Sistema** → Actualiza status a "confirmed"
14. **Sistema** → Notifica al alumno (confirmación)
15. **Sistema** → Añade clase al calendario

### ⏰ FLUJO 2: Clase Completada y Valoración

1. **Sistema** → Hora de la clase llega
2. **Entrenador** → Ve clase en "Próximas clases"
3. **Entrenador** → Click "Completar clase"
4. **Sistema** → Modal para confirmar
5. **Entrenador** → Añade notas privadas (opcional)
6. **Entrenador** → Confirma completación
7. **Sistema** → Status → "completed"
8. **Sistema** → Procesa pago al entrenador
9. **Sistema** → Envía email al alumno pidiendo valoración
10. **Alumno** → Deja rating y comentario
11. **Sistema** → Actualiza perfil del entrenador
12. **Sistema** → Notifica al entrenador de nueva review

### 🚫 FLUJO 3: Cancelación de Clase

**Cancelación por Entrenador:**
1. **Entrenador** → Abre detalles de booking
2. **Entrenador** → Click "Cancelar"
3. **Sistema** → Modal: "¿Razón? ¿Reembolsar?"
4. **Entrenador** → Añade razón, confirma
5. **Sistema** → Status → "cancelled"
6. **Sistema** → Procesa reembolso automático
7. **Sistema** → Notifica al alumno
8. **Sistema** → Ofrece reprogramar

**Cancelación por Alumno:**
1. **Alumno** → Cancela desde su dashboard
2. **Sistema** → Verifica política de cancelación
   - Más de 24h: Reembolso completo
   - Menos de 24h: Sin reembolso (configurable)
3. **Sistema** → Status → "cancelled"
4. **Sistema** → Procesa reembolso si aplica
5. **Sistema** → Notifica al entrenador
6. **Sistema** → Libera slot en calendario

### 📅 FLUJO 4: Gestión de Disponibilidad

1. **Entrenador** → Abre tab "Disponibilidad"
2. **Entrenador** → Edita horarios semanales
3. **Entrenador** → Click "Guardar cambios"
4. **Sistema** → Valida no solapamiento con bookings
5. **Sistema** → Guarda en coach_availability
6. **Sistema** → Actualiza calendario público

**Bloquear fecha específica:**
1. **Entrenador** → Click "Bloquear fecha"
2. **Sistema** → Modal con date picker
3. **Entrenador** → Selecciona fecha/rango
4. **Entrenador** → Añade razón (opcional)
5. **Sistema** → Verifica si hay bookings
6. **Sistema** → Si hay bookings → Alerta
7. **Entrenador** → Confirma o cancela
8. **Sistema** → Guarda en blocked_dates
9. **Sistema** → Oculta slots en calendario público

---

## 🔐 POLÍTICAS Y REGLAS DE NEGOCIO

### Cancelación
- **+24h antes**: Reembolso 100%
- **24h-12h antes**: Reembolso 50%
- **-12h antes**: Sin reembolso
- **No show alumno**: Sin reembolso
- **Cancelación entrenador**: Siempre reembolso 100%

### Pagos
- **Reserva**: Pago adelantado con Stripe
- **Hold**: El dinero se retiene hasta clase completada
- **Release**: Pago al entrenador 24h después de clase
- **Comisión Padeliner**: 15% por transacción

### Disponibilidad
- Mínimo 1 hora por slot
- No solapamiento de clases
- Buffer de 15min entre clases (configurable)
- Máximo 3 meses de antelación para reservar

### Notificaciones
- **24h antes**: Recordatorio automático
- **2h antes**: Recordatorio urgente
- **Nueva reserva**: Notificación inmediata
- **Cancelación**: Notificación inmediata
