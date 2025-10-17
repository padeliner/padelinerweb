# 📊 DASHBOARD DEL ENTRENADOR - RESUMEN EJECUTIVO Y PLAN

## 📚 DOCUMENTACIÓN COMPLETA

Este proyecto está documentado en 4 archivos:

1. **PARTE 1: Tabs Principales** (`DASHBOARD_SOLO_PARTE1_TABS_PRINCIPALES.md`)
   - Tab Resumen (KPIs, próximas clases, solicitudes)
   - Tab Calendario (semanal/mensual/diario)
   - Tab Reservas (lista completa, filtros, gestión)

2. **PARTE 2: Gestión Avanzada** (`DASHBOARD_SOLO_PARTE2_GESTION_AVANZADA.md`)
   - Tab Alumnos (lista, perfiles, historial, notas)
   - Tab Disponibilidad (horarios semanales, fechas bloqueadas)
   - Tab Finanzas (ingresos, transacciones, gráficos, exportar)

3. **PARTE 3: Configuración y Flujos** (`DASHBOARD_SOLO_PARTE3_CONFIG_Y_FLUJOS.md`)
   - Tab Mensajes (integración del chat)
   - Tab Configuración (perfil, precios, preferencias)
   - Flujos completos del sistema (reserva, completar, cancelar, disponibilidad)
   - Sistema de notificaciones

4. **ESTE ARCHIVO: Resumen y Plan** (`DASHBOARD_SOLO_RESUMEN_Y_PLAN.md`)
   - Resumen ejecutivo
   - Plan de implementación por fases
   - Prioridades y MVP
   - Base de datos necesaria
   - APIs necesarias

---

## 🎯 QUÉ VAMOS A CONSTRUIR

**Dashboard completo para entrenadores con 8 tabs:**

```
┌────────────────────────────────────────────────────────┐
│  DASHBOARD DEL ENTRENADOR                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. 📊 RESUMEN                                         │
│     • 4 KPIs principales                               │
│     • Próximas clases (HOY y MAÑANA)                   │
│     • Nuevas solicitudes pendientes                    │
│     • Gráfico de rendimiento                           │
│                                                        │
│  2. 📅 CALENDARIO                                      │
│     • Vista semanal/mensual/diaria                     │
│     • Clases programadas con colores por estado       │
│     • Fechas bloqueadas visibles                       │
│     • Click para ver detalles o bloquear               │
│                                                        │
│  3. 📋 RESERVAS                                        │
│     • Lista completa con filtros                       │
│     • Confirmar/Rechazar solicitudes                   │
│     • Completar clases realizadas                      │
│     • Cancelar con reembolso automático                │
│     • Notas privadas por clase                         │
│                                                        │
│  4. 👥 ALUMNOS                                         │
│     • Lista de todos los alumnos                       │
│     • Perfil detallado con estadísticas                │
│     • Historial de clases juntos                       │
│     • Notas privadas permanentes                       │
│     • Acciones rápidas (mensaje, agendar)              │
│                                                        │
│  5. ⏰ DISPONIBILIDAD                                  │
│     • Editor de horarios semanales                     │
│     • Múltiples rangos por día                         │
│     • Bloquear fechas (vacaciones)                     │
│     • Validación de conflictos                         │
│                                                        │
│  6. 💰 FINANZAS                                        │
│     • Resumen: total, pendiente, cobrado               │
│     • Gráfico de ingresos mensuales                    │
│     • Lista detallada de transacciones                 │
│     • Exportar reportes (CSV, PDF)                     │
│                                                        │
│  7. 💬 MENSAJES                                        │
│     • Chat con alumnos (sistema existente)             │
│                                                        │
│  8. ⚙️ CONFIGURACIÓN                                   │
│     • Perfil profesional                               │
│     • Precios y servicios                              │
│     • Notificaciones                                   │
│     • Cuenta de Stripe                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🗄️ BASE DE DATOS NECESARIA

### **Tablas NUEVAS a crear:**

#### **1. `bookings` (Reservas de clases)**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relaciones
  coach_id UUID NOT NULL REFERENCES users(id),
  player_id UUID NOT NULL REFERENCES users(id),
  
  -- Fecha y hora
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Tipo
  class_type VARCHAR(20) NOT NULL CHECK (class_type IN ('individual', 'group')),
  participants INTEGER DEFAULT 1,
  
  -- Ubicación
  location_type VARCHAR(20) NOT NULL,
  location_address TEXT,
  
  -- Precio
  price_per_hour DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  
  -- Pago
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_intent_id TEXT,
  
  -- Cancelación
  cancelled_at TIMESTAMP,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  
  -- Notas
  player_notes TEXT,
  coach_notes TEXT,
  
  -- Valoración
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  reviewed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_bookings_coach ON bookings(coach_id);
CREATE INDEX idx_bookings_player ON bookings(player_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

#### **2. `coach_availability` (Disponibilidad semanal)**
```sql
CREATE TABLE coach_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id),
  
  -- Día de la semana (0=domingo, 1=lunes, 6=sábado)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Horario
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Estado
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(coach_id, day_of_week, start_time, end_time)
);

CREATE INDEX idx_availability_coach ON coach_availability(coach_id);
```

#### **3. `coach_blocked_dates` (Fechas bloqueadas)**
```sql
CREATE TABLE coach_blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id),
  
  -- Fecha bloqueada
  blocked_date DATE NOT NULL,
  start_time TIME,  -- NULL = todo el día
  end_time TIME,
  
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blocked_dates_coach ON coach_blocked_dates(coach_id);
CREATE INDEX idx_blocked_dates_date ON coach_blocked_dates(blocked_date);
```

#### **4. `notifications` (Sistema de notificaciones)**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Tipo
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'new_booking', 'booking_confirmed', 'booking_cancelled',
    'booking_reminder', 'new_message', 'new_review', 'payment_received'
  )),
  
  -- Contenido
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Relacionado
  related_booking_id UUID REFERENCES bookings(id),
  related_user_id UUID REFERENCES users(id),
  
  -- Estado
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
```

---

## 🔌 APIS NECESARIAS

### **Bookings API** - `/api/coaches/bookings`

```typescript
// Listar reservas
GET /api/coaches/bookings
  ?status=pending|confirmed|cancelled|completed
  &from_date=2025-01-01
  &to_date=2025-01-31

// Detalles de una reserva
GET /api/coaches/bookings/:id

// Confirmar reserva
POST /api/coaches/bookings/:id/confirm

// Rechazar reserva
POST /api/coaches/bookings/:id/reject
  Body: { reason: string }

// Completar clase
POST /api/coaches/bookings/:id/complete
  Body: { coach_notes?: string }

// Cancelar clase
POST /api/coaches/bookings/:id/cancel
  Body: { reason: string, refund: boolean }
```

### **Availability API** - `/api/coaches/availability`

```typescript
// Obtener disponibilidad
GET /api/coaches/availability

// Actualizar horarios semanales
PUT /api/coaches/availability
  Body: { 
    weekly_schedule: [{
      day_of_week: number,
      slots: [{ start_time, end_time }]
    }]
  }

// Bloquear fecha
POST /api/coaches/availability/block
  Body: { 
    date: string, 
    start_time?: string, 
    end_time?: string,
    reason?: string 
  }

// Desbloquear fecha
DELETE /api/coaches/availability/block/:id
```

### **Calendar API** - `/api/coaches/calendar`

```typescript
// Vista de calendario
GET /api/coaches/calendar
  ?from_date=2025-01-20
  &to_date=2025-01-26
  &view=week
```

### **Students API** - `/api/coaches/students`

```typescript
// Listar alumnos
GET /api/coaches/students
  ?status=active|inactive
  &search=maria

// Perfil del alumno
GET /api/coaches/students/:id

// Actualizar notas del alumno
PUT /api/coaches/students/:id/notes
  Body: { notes: string }
```

### **Stats API** - `/api/coaches/stats`

```typescript
// Estadísticas generales
GET /api/coaches/stats
  ?period=today|week|month|year
  &from=2025-01-01
  &to=2025-01-31
```

### **Finances API** - `/api/coaches/finances`

```typescript
// Resumen financiero
GET /api/coaches/finances
  ?period=month
  &month=2025-01

// Exportar transacciones
GET /api/coaches/finances/export
  ?format=csv|pdf
  &from=2025-01-01
  &to=2025-01-31
```

### **Notifications API** - `/api/coaches/notifications`

```typescript
// Listar notificaciones
GET /api/coaches/notifications
  ?unread_only=true
  &limit=10

// Marcar como leída
POST /api/coaches/notifications/:id/read

// Marcar todas como leídas
POST /api/coaches/notifications/read-all
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### **FASE 1: FUNDAMENTOS (MVP) - 3-4 SEMANAS**
**CRÍTICO - Debe estar para lanzar**

#### **Semana 1: Base de Datos + APIs Básicas**
- ✅ Crear tabla `bookings`
- ✅ Crear tabla `coach_availability`
- ✅ Crear tabla `coach_blocked_dates`
- ✅ Crear tabla `notifications`
- ✅ Configurar RLS policies
- ✅ API: Listar reservas
- ✅ API: Confirmar/Rechazar reservas
- ✅ API: Obtener disponibilidad
- ✅ API: Actualizar disponibilidad

#### **Semana 2: Dashboard Básico**
- ✅ Layout principal del dashboard
- ✅ Tab "Resumen" con KPIs reales
- ✅ Tab "Resumen" con próximas clases
- ✅ Tab "Resumen" con solicitudes pendientes
- ✅ Tab "Reservas" con lista y filtros
- ✅ Modal de detalles de reserva
- ✅ Botones Confirmar/Rechazar funcionales

#### **Semana 3: Calendario + Disponibilidad**
- ✅ Tab "Calendario" vista semanal
- ✅ Tab "Calendario" vista mensual
- ✅ Integración con bookings
- ✅ Mostrar fechas bloqueadas
- ✅ Tab "Disponibilidad" editor horarios
- ✅ Tab "Disponibilidad" bloquear fechas
- ✅ Validación de conflictos

#### **Semana 4: Integración Stripe + Testing**
- ✅ Integración Stripe Connect
- ✅ Payment flow completo
- ✅ Hold de dinero hasta completar
- ✅ Release después de 24h
- ✅ Reembolsos automáticos
- ✅ Tab "Finanzas" básico
- ✅ Testing completo del MVP

**RESULTADO MVP:**
El entrenador puede:
- Ver sus clases en calendario
- Recibir y confirmar/rechazar reservas
- Configurar su disponibilidad
- Ver sus ingresos
- Todo con pagos reales de Stripe

---

### **FASE 2: GESTIÓN AVANZADA - 2-3 SEMANAS**
**ALTA PRIORIDAD**

#### **Semana 5-6: Alumnos + Completar Clases**
- ✅ Tab "Alumnos" lista completa
- ✅ Perfil detallado del alumno
- ✅ Estadísticas por alumno
- ✅ Notas privadas del entrenador
- ✅ Funcionalidad "Completar clase"
- ✅ Sistema de reviews post-clase
- ✅ Historial de clases

#### **Semana 7: Finanzas Avanzadas**
- ✅ Gráficos de ingresos
- ✅ Exportar a CSV
- ✅ Exportar a PDF
- ✅ Filtros avanzados
- ✅ Estadísticas detalladas

---

### **FASE 3: NOTIFICACIONES Y AUTOMATIZACIONES - 1-2 SEMANAS**
**MEDIA PRIORIDAD**

#### **Semana 8-9:**
- ✅ Sistema de notificaciones en tiempo real
- ✅ Bell icon con contador
- ✅ Panel de notificaciones
- ✅ Emails automáticos (Resend/SendGrid)
- ✅ Recordatorios 24h y 2h antes
- ✅ Email pidiendo review
- ✅ Push notifications (opcional)

---

### **FASE 4: PULIDO Y OPTIMIZACIONES - 1 SEMANA**
**BAJA PRIORIDAD**

#### **Semana 10:**
- ✅ Mejoras UX/UI
- ✅ Animaciones suaves
- ✅ Loading states elegantes
- ✅ Skeleton loaders
- ✅ Mobile responsive perfecto
- ✅ Testing E2E completo
- ✅ Optimizaciones de performance

---

## 🎯 MVP - QUÉ LANZAR PRIMERO (4 SEMANAS)

### **DEBE TENER (CRÍTICO):**

1. **Tab Resumen**
   - ✅ KPIs principales
   - ✅ Próximas clases
   - ✅ Nuevas solicitudes
   - ✅ Gráfico básico

2. **Tab Calendario**
   - ✅ Vista semanal
   - ✅ Vista mensual
   - ✅ Ver clases programadas
   - ✅ Click para detalles

3. **Tab Reservas**
   - ✅ Lista con filtros
   - ✅ Confirmar/Rechazar
   - ✅ Ver detalles completos
   - ✅ Completar clase

4. **Tab Disponibilidad**
   - ✅ Editor de horarios semanales
   - ✅ Bloquear fechas

5. **Tab Finanzas**
   - ✅ Resumen básico
   - ✅ Lista de transacciones
   - ✅ Gráfico simple

6. **Integración Stripe**
   - ✅ Pagos completos
   - ✅ Hold y release
   - ✅ Reembolsos

7. **Notificaciones**
   - ✅ Emails básicos
   - ✅ Badge de contador

---

### **PUEDE ESPERAR (FASE 2+):**

- ⏳ Tab Alumnos completo
- ⏳ Notas privadas por alumno
- ⏳ Gráficos avanzados
- ⏳ Exportar reportes
- ⏳ Push notifications
- ⏳ Animaciones elaboradas
- ⏳ Dark mode

---

## 📊 STACK TECNOLÓGICO

### **Frontend:**
```
- Next.js 14 (App Router) ✅
- TypeScript ✅
- Tailwind CSS ✅
- Framer Motion (animaciones) ✅
- Lucide Icons ✅
- Recharts (gráficos)
- FullCalendar o react-big-calendar (calendario)
- date-fns (manejo de fechas)
- React Hook Form (formularios)
- Zod (validación)
```

### **Backend:**
```
- Next.js API Routes ✅
- Supabase (database) ✅
- Supabase Auth ✅
- Supabase Realtime (notificaciones)
- Stripe (pagos)
- Resend o SendGrid (emails)
```

### **DevOps:**
```
- Vercel (hosting) ✅
- GitHub (version control) ✅
- Supabase (database hosting) ✅
```

---

## ⚠️ DECISIONES IMPORTANTES

### **1. Sistema de Pagos:**
- **Stripe Connect** para los entrenadores
- **15% de comisión** para Padeliner
- **Hold de 24h** después de completar clase
- **Reembolsos automáticos** en cancelaciones

### **2. Políticas de Cancelación:**
- **+24h antes**: Reembolso 100%
- **24h-12h antes**: Reembolso 50% (configurable)
- **-12h antes**: Sin reembolso
- **Cancelación entrenador**: Siempre reembolso 100%

### **3. Notificaciones:**
- **Email**: Obligatorio para eventos críticos
- **Push**: Opcional, activable por usuario
- **In-app**: Badge con contador siempre visible

### **4. Seguridad:**
- **RLS policies** estrictas en Supabase
- **Validación** en cliente Y servidor
- **Rate limiting** en APIs sensibles
- **Sanitización** de inputs

---

## 🎬 PRÓXIMOS PASOS INMEDIATOS

1. ✅ **REVISAR** esta documentación completa
2. ✅ **APROBAR** el diseño y arquitectura
3. 🚀 **COMENZAR** Fase 1 - Semana 1:
   - Crear tablas en Supabase
   - Implementar APIs básicas
   - Layout inicial del dashboard

4. 📝 **MANTENER** comunicación constante para ajustes

---

## 📈 MÉTRICAS DE ÉXITO

### **Para el Dashboard:**
- ⏱️ Tiempo de carga: < 2 segundos
- 📱 Mobile responsive: 100%
- ✅ Tasa de adopción de entrenadores: > 80%
- 😊 Satisfacción: > 4.5/5

### **Para el Negocio:**
- 💰 Reservas completadas/mes: +20% mensual
- 💵 Valor promedio por reserva: €45-60
- 🔁 Tasa de retención: > 70%
- 💸 Ingresos comisión: 15% por transacción

---

## 💡 CONCLUSIÓN

Este dashboard transformará la experiencia de los entrenadores en Padeliner, dándoles todas las herramientas profesionales necesarias para gestionar su negocio de forma eficiente.

**MVP en 4 semanas** es realista y lanzable.
**Versión completa en 10 semanas** con todas las funcionalidades.

**¿Listo para empezar?** 🚀
