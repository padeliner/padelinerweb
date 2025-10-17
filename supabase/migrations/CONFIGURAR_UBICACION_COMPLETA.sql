-- =====================================================
-- CONFIGURAR UBICACIÓN COMPLETA CON GPS
-- =====================================================
-- Fecha: 2025-01-17
-- 
-- CAMPOS DE UBICACIÓN (PÚBLICOS en player_profiles):
--   - city (ciudad extraída de Google Places)
--   - location_formatted (dirección completa formateada)
--   - location_lat (latitud GPS)
--   - location_lng (longitud GPS)
--   - country (país)
--
-- CAMPOS PRIVADOS (users):
--   - phone (teléfono)
--   - email (ya existe)
-- =====================================================

-- 1. AÑADIR TELÉFONO A USERS (PRIVADO)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    RAISE NOTICE '✅ Columna phone añadida a users (PRIVADO)';
  ELSE
    RAISE NOTICE 'ℹ️  Columna phone ya existe en users';
  END IF;
END $$;

-- 2. AÑADIR CAMPOS DE UBICACIÓN A PLAYER_PROFILES (PÚBLICOS)

-- 2.1 Ciudad
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN city VARCHAR(100);
    RAISE NOTICE '✅ Columna city añadida a player_profiles';
  ELSE
    RAISE NOTICE 'ℹ️  Columna city ya existe';
  END IF;
END $$;

-- 2.2 Dirección formateada
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'location_formatted'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN location_formatted VARCHAR(255);
    RAISE NOTICE '✅ Columna location_formatted añadida';
  ELSE
    RAISE NOTICE 'ℹ️  Columna location_formatted ya existe';
  END IF;
END $$;

-- 2.3 Latitud
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'location_lat'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN location_lat DECIMAL(10, 8);
    RAISE NOTICE '✅ Columna location_lat añadida';
  ELSE
    RAISE NOTICE 'ℹ️  Columna location_lat ya existe';
  END IF;
END $$;

-- 2.4 Longitud
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'location_lng'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN location_lng DECIMAL(11, 8);
    RAISE NOTICE '✅ Columna location_lng añadida';
  ELSE
    RAISE NOTICE 'ℹ️  Columna location_lng ya existe';
  END IF;
END $$;

-- 2.5 País
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN country VARCHAR(100) DEFAULT 'España';
    RAISE NOTICE '✅ Columna country añadida';
  ELSE
    RAISE NOTICE 'ℹ️  Columna country ya existe';
  END IF;
END $$;

-- 2.6 Fecha de nacimiento
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN birth_date DATE;
    RAISE NOTICE '✅ Columna birth_date añadida';
  ELSE
    RAISE NOTICE 'ℹ️  Columna birth_date ya existe';
  END IF;
END $$;

-- 3. CREAR ÍNDICE PARA BÚSQUEDAS POR UBICACIÓN
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_player_profiles_location'
  ) THEN
    CREATE INDEX idx_player_profiles_location ON player_profiles(location_lat, location_lng);
    RAISE NOTICE '✅ Índice de ubicación creado';
  ELSE
    RAISE NOTICE 'ℹ️  Índice de ubicación ya existe';
  END IF;
END $$;

-- 4. AÑADIR COMENTARIOS EXPLICATIVOS
COMMENT ON COLUMN users.phone IS 'Teléfono - PRIVADO (solo dashboard privado)';
COMMENT ON COLUMN player_profiles.city IS 'Ciudad - PÚBLICO (extraída de Google Places)';
COMMENT ON COLUMN player_profiles.location_formatted IS 'Dirección completa - PÚBLICO (de Google Places)';
COMMENT ON COLUMN player_profiles.location_lat IS 'Latitud GPS - PÚBLICO (para calcular distancias)';
COMMENT ON COLUMN player_profiles.location_lng IS 'Longitud GPS - PÚBLICO (para calcular distancias)';
COMMENT ON COLUMN player_profiles.country IS 'País - PÚBLICO (de Google Places)';
COMMENT ON COLUMN player_profiles.birth_date IS 'Fecha de nacimiento - PÚBLICO (para calcular edad)';

-- 5. VERIFICAR RESULTADO
SELECT 
  '📊 RESUMEN DE CAMPOS' as info;

SELECT 
  '🔒 PRIVADOS (users)' as categoria,
  column_name as campo, 
  data_type as tipo,
  CASE 
    WHEN column_name = 'email' THEN 'Email del usuario (auth.users)'
    WHEN column_name = 'phone' THEN 'Teléfono del usuario'
  END as descripcion
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name IN ('email', 'phone')

UNION ALL

SELECT 
  '🌐 PÚBLICOS - Ubicación (player_profiles)' as categoria,
  column_name as campo, 
  data_type as tipo,
  CASE 
    WHEN column_name = 'city' THEN 'Ciudad (Google Places)'
    WHEN column_name = 'location_formatted' THEN 'Dirección completa'
    WHEN column_name = 'location_lat' THEN 'Latitud GPS'
    WHEN column_name = 'location_lng' THEN 'Longitud GPS'
    WHEN column_name = 'country' THEN 'País'
  END as descripcion
FROM information_schema.columns
WHERE table_name = 'player_profiles' 
  AND column_name IN ('city', 'location_formatted', 'location_lat', 'location_lng', 'country')

UNION ALL

SELECT 
  '🌐 PÚBLICOS - Otros (player_profiles)' as categoria,
  column_name as campo, 
  data_type as tipo,
  'Fecha de nacimiento' as descripcion
FROM information_schema.columns
WHERE table_name = 'player_profiles' 
  AND column_name = 'birth_date'

ORDER BY categoria DESC, campo;

-- =====================================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- =====================================================
--
-- ESTRUCTURA FINAL:
--
-- 🔒 PRIVADOS (tabla users):
--    ├─ email      → Solo dashboard privado
--    └─ phone      → Solo dashboard privado
--
-- 🌐 PÚBLICOS (tabla player_profiles):
--    ├─ city                → Ciudad
--    ├─ location_formatted  → "Calle Mayor, 1, Madrid, España"
--    ├─ location_lat        → 40.4168
--    ├─ location_lng        → -3.7038
--    ├─ country             → "España"
--    ├─ birth_date          → Fecha de nacimiento
--    └─ ... (resto de campos del perfil)
--
-- 📍 FUNCIONALIDAD:
--    • Autocompletado con Google Places API
--    • GPS automático del navegador
--    • Cálculo de distancias entre jugadores
--    • Búsqueda por ubicación
--    • Mostrar ciudad y edad en perfil público
-- =====================================================
