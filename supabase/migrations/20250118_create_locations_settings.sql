-- =====================================================
-- TABLAS DE UBICACIONES Y CONFIGURACIÓN DE ENTRENADORES
-- =====================================================
-- Fecha: 18 Enero 2025
-- Descripción: Tablas para gestionar ubicaciones de clases
--              y configuración avanzada de disponibilidad

-- =====================================================
-- 1. TABLA: coach_locations (Ubicaciones del entrenador)
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relación
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Información de la ubicación
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'both' CHECK (type IN ('indoor', 'outdoor', 'both')),
  
  -- Coordenadas (opcional)
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  
  -- Predeterminada
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices
  CONSTRAINT unique_coach_location UNIQUE (coach_id, name)
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_coach_locations_coach_id ON coach_locations(coach_id);
CREATE INDEX idx_coach_locations_default ON coach_locations(coach_id, is_default);

-- Trigger para updated_at
CREATE TRIGGER update_coach_locations_updated_at
  BEFORE UPDATE ON coach_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. TABLA: coach_settings (Configuración del entrenador)
-- =====================================================

CREATE TABLE IF NOT EXISTS coach_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relación (uno a uno)
  coach_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Configuración de clases
  class_duration INTEGER NOT NULL DEFAULT 60, -- minutos
  buffer_time INTEGER NOT NULL DEFAULT 0, -- minutos entre clases
  
  -- Antelación de reservas
  min_advance_hours INTEGER NOT NULL DEFAULT 2, -- horas mínimas de antelación
  max_advance_days INTEGER NOT NULL DEFAULT 30, -- días máximos de antelación
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_coach_settings_coach_id ON coach_settings(coach_id);

-- Trigger para updated_at
CREATE TRIGGER update_coach_settings_updated_at
  BEFORE UPDATE ON coach_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE coach_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para coach_locations
CREATE POLICY "Los entrenadores pueden ver sus ubicaciones"
  ON coach_locations FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Los entrenadores pueden crear sus ubicaciones"
  ON coach_locations FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Los entrenadores pueden actualizar sus ubicaciones"
  ON coach_locations FOR UPDATE
  USING (auth.uid() = coach_id);

CREATE POLICY "Los entrenadores pueden eliminar sus ubicaciones"
  ON coach_locations FOR DELETE
  USING (auth.uid() = coach_id);

-- Políticas para coach_settings
CREATE POLICY "Los entrenadores pueden ver su configuración"
  ON coach_settings FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Los entrenadores pueden crear su configuración"
  ON coach_settings FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Los entrenadores pueden actualizar su configuración"
  ON coach_settings FOR UPDATE
  USING (auth.uid() = coach_id);

-- =====================================================
-- 4. FUNCIÓN: Asegurar solo una ubicación predeterminada
-- =====================================================

CREATE OR REPLACE FUNCTION ensure_single_default_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Si se está marcando como predeterminada
  IF NEW.is_default = true THEN
    -- Desmarcar todas las demás ubicaciones del mismo entrenador
    UPDATE coach_locations
    SET is_default = false
    WHERE coach_id = NEW.coach_id
      AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para asegurar solo una ubicación predeterminada
CREATE TRIGGER trigger_ensure_single_default_location
  BEFORE INSERT OR UPDATE ON coach_locations
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_location();

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE coach_locations IS 'Ubicaciones donde el entrenador imparte clases';
COMMENT ON TABLE coach_settings IS 'Configuración de disponibilidad y reservas del entrenador';

COMMENT ON COLUMN coach_locations.type IS 'Tipo de pistas: indoor (interior), outdoor (exterior), both (ambas)';
COMMENT ON COLUMN coach_locations.is_default IS 'Ubicación predeterminada para nuevas reservas';
COMMENT ON COLUMN coach_settings.class_duration IS 'Duración estándar de clase en minutos';
COMMENT ON COLUMN coach_settings.buffer_time IS 'Tiempo de descanso entre clases en minutos';
COMMENT ON COLUMN coach_settings.min_advance_hours IS 'Horas mínimas de antelación para reservar';
COMMENT ON COLUMN coach_settings.max_advance_days IS 'Días máximos de antelación para reservar';
