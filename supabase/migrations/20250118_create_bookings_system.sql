-- =====================================================
-- SISTEMA DE RESERVAS PARA DASHBOARD DEL ENTRENADOR
-- =====================================================
-- Fecha: 18 Enero 2025
-- Descripción: Crea todas las tablas necesarias para el
--              sistema de reservas de clases de pádel

-- =====================================================
-- 1. TABLA: bookings (Reservas de clases)
-- =====================================================

CREATE TABLE IF NOT EXISTS bookings (
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
  
  -- Pago (Stripe)
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'refunded', 'failed')
  ),
  payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  -- Cancelación
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  
  -- Notas
  player_notes TEXT,
  coach_notes TEXT,
  
  -- Valoración (después de la clase)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validaciones
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_booking_date CHECK (booking_date >= CURRENT_DATE - INTERVAL '1 day'),
  CONSTRAINT valid_participants CHECK (participants >= 1 AND participants <= 10)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_bookings_coach_id ON bookings(coach_id);
CREATE INDEX IF NOT EXISTS idx_bookings_player_id ON bookings(player_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_coach_date ON bookings(coach_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_coach_status ON bookings(coach_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment ON bookings(payment_status);

-- Comentarios
COMMENT ON TABLE bookings IS 'Reservas de clases entre entrenadores y jugadores';
COMMENT ON COLUMN bookings.status IS 'pending: esperando confirmación, confirmed: confirmada, cancelled: cancelada, completed: realizada, no_show: alumno no apareció';
COMMENT ON COLUMN bookings.payment_status IS 'pending: pendiente, paid: pagado, refunded: reembolsado, failed: fallido';

-- =====================================================
-- 2. TABLA: coach_availability (Disponibilidad semanal)
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Día de la semana (0 = domingo, 1 = lunes, 6 = sábado)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Horario
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Estado
  is_available BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar solapamientos para el mismo día
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  UNIQUE(coach_id, day_of_week, start_time, end_time)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_availability_coach ON coach_availability(coach_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON coach_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_coach_day ON coach_availability(coach_id, day_of_week);

-- Comentarios
COMMENT ON TABLE coach_availability IS 'Horarios semanales de disponibilidad de los entrenadores';
COMMENT ON COLUMN coach_availability.day_of_week IS '0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado';

-- =====================================================
-- 3. TABLA: coach_blocked_dates (Fechas bloqueadas)
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Fecha y horario bloqueado
  blocked_date DATE NOT NULL,
  start_time TIME,  -- NULL = todo el día bloqueado
  end_time TIME,
  
  -- Razón del bloqueo
  reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validación
  CONSTRAINT valid_blocked_range CHECK (
    (start_time IS NULL AND end_time IS NULL) OR 
    (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blocked_dates_coach ON coach_blocked_dates(coach_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON coach_blocked_dates(blocked_date);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_coach_date ON coach_blocked_dates(coach_id, blocked_date);

-- Comentarios
COMMENT ON TABLE coach_blocked_dates IS 'Fechas específicas bloqueadas por el entrenador (vacaciones, torneos, etc.)';
COMMENT ON COLUMN coach_blocked_dates.start_time IS 'NULL significa que todo el día está bloqueado';

-- =====================================================
-- 4. TABLA: notifications (Sistema de notificaciones)
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tipo de notificación
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'new_booking', 
    'booking_confirmed', 
    'booking_cancelled',
    'booking_reminder', 
    'booking_completed',
    'new_message', 
    'new_review', 
    'payment_received',
    'payment_pending'
  )),
  
  -- Contenido
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Relacionado con...
  related_booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Metadata adicional (JSON)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Estado
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Comentarios
COMMENT ON TABLE notifications IS 'Sistema de notificaciones para entrenadores y jugadores';
COMMENT ON COLUMN notifications.type IS 'Tipo de notificación para filtrar y agrupar';

-- =====================================================
-- TRIGGERS para updated_at
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para bookings
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para coach_availability
DROP TRIGGER IF EXISTS update_coach_availability_updated_at ON coach_availability;
CREATE TRIGGER update_coach_availability_updated_at
    BEFORE UPDATE ON coach_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (Row Level Security) POLICIES
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============ POLICIES PARA: bookings ============

-- Los entrenadores pueden ver sus propias reservas
CREATE POLICY "Coaches can view their own bookings"
ON bookings FOR SELECT
TO authenticated
USING (coach_id = auth.uid());

-- Los jugadores pueden ver sus propias reservas
CREATE POLICY "Players can view their own bookings"
ON bookings FOR SELECT
TO authenticated
USING (player_id = auth.uid());

-- Los jugadores pueden crear reservas
CREATE POLICY "Players can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (player_id = auth.uid());

-- Los entrenadores pueden actualizar sus reservas (confirmar, rechazar, completar)
CREATE POLICY "Coaches can update their bookings"
ON bookings FOR UPDATE
TO authenticated
USING (coach_id = auth.uid())
WITH CHECK (coach_id = auth.uid());

-- Los jugadores pueden cancelar sus propias reservas
CREATE POLICY "Players can cancel their bookings"
ON bookings FOR UPDATE
TO authenticated
USING (player_id = auth.uid() AND status = 'confirmed')
WITH CHECK (player_id = auth.uid());

-- ============ POLICIES PARA: coach_availability ============

-- Todos pueden ver la disponibilidad de los entrenadores (para reservar)
CREATE POLICY "Everyone can view coach availability"
ON coach_availability FOR SELECT
TO authenticated
USING (true);

-- Los entrenadores solo pueden gestionar su propia disponibilidad
CREATE POLICY "Coaches can manage their own availability"
ON coach_availability FOR ALL
TO authenticated
USING (coach_id = auth.uid())
WITH CHECK (coach_id = auth.uid());

-- ============ POLICIES PARA: coach_blocked_dates ============

-- Todos pueden ver fechas bloqueadas (para no intentar reservar)
CREATE POLICY "Everyone can view blocked dates"
ON coach_blocked_dates FOR SELECT
TO authenticated
USING (true);

-- Los entrenadores solo pueden gestionar sus propias fechas bloqueadas
CREATE POLICY "Coaches can manage their own blocked dates"
ON coach_blocked_dates FOR ALL
TO authenticated
USING (coach_id = auth.uid())
WITH CHECK (coach_id = auth.uid());

-- ============ POLICIES PARA: notifications ============

-- Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Sistema puede crear notificaciones (usando service_role key)
CREATE POLICY "Service can create notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Los usuarios pueden actualizar sus notificaciones (marcar como leídas)
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Los usuarios pueden eliminar sus notificaciones
CREATE POLICY "Users can delete their own notifications"
ON notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =====================================================
-- FUNCIONES AUXILIARES ÚTILES
-- =====================================================

-- Función: Obtener slots disponibles de un entrenador en una fecha
CREATE OR REPLACE FUNCTION get_coach_available_slots(
  p_coach_id UUID,
  p_date DATE
)
RETURNS TABLE (
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ca.start_time,
    ca.end_time,
    NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.coach_id = p_coach_id
        AND b.booking_date = p_date
        AND b.status IN ('confirmed', 'pending')
        AND (
          (b.start_time, b.end_time) OVERLAPS (ca.start_time, ca.end_time)
        )
    ) AND NOT EXISTS (
      SELECT 1 FROM coach_blocked_dates cbd
      WHERE cbd.coach_id = p_coach_id
        AND cbd.blocked_date = p_date
        AND (
          (cbd.start_time IS NULL) OR
          ((cbd.start_time, cbd.end_time) OVERLAPS (ca.start_time, ca.end_time))
        )
    ) as is_available
  FROM coach_availability ca
  WHERE ca.coach_id = p_coach_id
    AND ca.day_of_week = EXTRACT(DOW FROM p_date)::INTEGER
    AND ca.is_available = true
  ORDER BY ca.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION get_coach_available_slots IS 'Devuelve los slots horarios de un entrenador en una fecha, indicando si están disponibles o no';

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - SOLO PARA TESTING)
-- =====================================================

-- Puedes descomentar esto para crear datos de prueba:
/*
-- Insertar disponibilidad de ejemplo para un entrenador
INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time)
VALUES 
  ('900d2812-8c39-4b08-a967-344c494f6b81', 1, '09:00', '13:00'), -- Lunes mañana
  ('900d2812-8c39-4b08-a967-344c494f6b81', 1, '16:00', '21:00'), -- Lunes tarde
  ('900d2812-8c39-4b08-a967-344c494f6b81', 2, '09:00', '13:00'), -- Martes mañana
  ('900d2812-8c39-4b08-a967-344c494f6b81', 2, '16:00', '21:00'); -- Martes tarde
*/

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================
