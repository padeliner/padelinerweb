# 📊 PROPUESTA: Dashboard del Entrenador - Padeliner (PARTE 1)

## 🎯 OBJETIVO PRINCIPAL
Crear el mejor sistema de gestión de reservas de clases de pádel del mundo, donde:
- Los jugadores puedan encontrar y reservar entrenadores fácilmente
- Los entrenadores puedan gestionar sus clases, horarios y alumnos de forma eficiente
- Todo sea intuitivo, rápido y profesional

---

## 📋 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Lo que ya funciona:
1. **Sistema de autenticación** (Supabase Auth)
2. **Perfiles públicos de entrenadores** con información completa
3. **Sistema de búsqueda y filtrado** de entrenadores
4. **Sistema de mensajería** entre usuarios
5. **Sistema de favoritos** (entrenadores y jugadores)
6. **Home con entrenadores destacados** (datos reales)
7. **Botones de acción** (Reservar Clase, Enviar mensaje)
8. **Dashboard básico del entrenador** con estadísticas placeholder

### ❌ Lo que falta:
1. **Sistema completo de reservas/bookings**
2. **Calendario funcional** para entrenadores
3. **Gestión de disponibilidad** horaria
4. **Sistema de pagos** integrado
5. **Gestión de clases** (historial, próximas, completadas)
6. **Notificaciones** de nuevas reservas
7. **Dashboard del entrenador** completamente funcional
8. **Estadísticas reales** (no placeholder)
9. **Gestión de alumnos** y su progreso

---

## 🏗️ ARQUITECTURA DE BASE DE DATOS PROPUESTA

### 📅 Tabla: `bookings` (Reservas)
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relaciones
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Información de la clase
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Tipo de clase
  class_type VARCHAR(20) NOT NULL CHECK (class_type IN ('individual', 'group')),
  participants INTEGER DEFAULT 1,
  
  -- Ubicación
  location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('coach_location', 'player_location', 'other')),
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  
  -- Precio y pago
  price_per_hour DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Estado de la reserva
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')
  ),
  
  -- Pago
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'refunded', 'failed')
  ),
  payment_intent_id TEXT,
  
  -- Cancelación
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  
  -- Notas
  player_notes TEXT,
  coach_notes TEXT,
  
  -- Valoración
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_booking_date CHECK (booking_date >= CURRENT_DATE)
);
```

### ⏰ Tabla: `coach_availability` (Disponibilidad)
```sql
CREATE TABLE coach_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  UNIQUE(coach_id, day_of_week, start_time, end_time)
);
```

### 🚫 Tabla: `coach_blocked_dates` (Fechas bloqueadas)
```sql
CREATE TABLE coach_blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 📧 Tabla: `notifications` (Notificaciones)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_booking_id UUID REFERENCES bookings(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
