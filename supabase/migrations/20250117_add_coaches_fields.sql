-- Agregar campos faltantes en tabla coaches para match con mock data

-- Agregar columna location (nombre del club/lugar)
ALTER TABLE coaches
ADD COLUMN IF NOT EXISTS location TEXT;

-- Comentario en las columnas para claridad
COMMENT ON COLUMN coaches.location IS 'Nombre del club o lugar donde el entrenador da clases';
COMMENT ON COLUMN coaches.images IS 'Array de URLs de imágenes adicionales del entrenador';
COMMENT ON COLUMN coaches.is_featured IS 'Indica si el entrenador aparece como destacado';

-- Actualizar el entrenador existente con datos completos
UPDATE coaches
SET 
  location = 'Valencia Padel Center',
  images = ARRAY[
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'
  ]
WHERE user_id = '900d2812-8c39-4b08-a967-344c494f6b81';
