-- ================================================================
-- UPDATE COACHES TABLE - Añadir columnas faltantes para mocks
-- ================================================================

-- Añadir columnas necesarias que faltan
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS specialties TEXT[];
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2);
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,7);
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS location_lng DECIMAL(10,7);
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS offers_home_service BOOLEAN DEFAULT false;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}';
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS images TEXT[];

-- Crear índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_location_city ON coaches(location_city);
CREATE INDEX IF NOT EXISTS idx_coaches_rating ON coaches(rating DESC);
CREATE INDEX IF NOT EXISTS idx_coaches_price ON coaches(price_per_hour);
CREATE INDEX IF NOT EXISTS idx_coaches_featured ON coaches(is_featured) WHERE is_featured = true;

-- Comentarios para documentación
COMMENT ON COLUMN coaches.specialties IS 'Especialidades del entrenador (Adultos, Junior, Iniciación, etc)';
COMMENT ON COLUMN coaches.rating IS 'Valoración promedio del entrenador (0.0 - 5.0)';
COMMENT ON COLUMN coaches.reviews_count IS 'Número total de reseñas';
COMMENT ON COLUMN coaches.price_per_hour IS 'Precio por hora en euros';
COMMENT ON COLUMN coaches.location_city IS 'Ciudad donde ofrece servicios';
COMMENT ON COLUMN coaches.location_lat IS 'Latitud de la ubicación principal';
COMMENT ON COLUMN coaches.location_lng IS 'Longitud de la ubicación principal';
COMMENT ON COLUMN coaches.avatar_url IS 'URL de la foto de perfil';
COMMENT ON COLUMN coaches.offers_home_service IS 'Si ofrece servicio a domicilio';
COMMENT ON COLUMN coaches.is_featured IS 'Si es entrenador destacado';
COMMENT ON COLUMN coaches.availability IS 'Disponibilidad horaria por día (JSON)';
COMMENT ON COLUMN coaches.images IS 'URLs de imágenes adicionales del perfil';
