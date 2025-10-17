-- =====================================================
-- MIGRAR CIUDAD Y FECHA DE NACIMIENTO A PÚBLICO
-- =====================================================
-- Fecha: 2025-01-17
-- Descripción: Mueve city y birth_date de users a player_profiles
--              Solo phone permanece privado en users
--              Email ya está en users por defecto (auth.users)
-- =====================================================

-- 1. Añadir columnas a player_profiles (si no existen)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN city VARCHAR(100);
    RAISE NOTICE 'Columna city añadida a player_profiles';
  ELSE
    RAISE NOTICE 'Columna city ya existe en player_profiles';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN birth_date DATE;
    RAISE NOTICE 'Columna birth_date añadida a player_profiles';
  ELSE
    RAISE NOTICE 'Columna birth_date ya existe en player_profiles';
  END IF;
END $$;

-- 2. Migrar datos existentes de users a player_profiles (si existen en users)
DO $$
BEGIN
  -- Solo migrar si existen las columnas en users
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'city'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'birth_date'
  ) THEN
    -- Migrar datos
    UPDATE player_profiles pp
    SET 
      city = u.city,
      birth_date = u.birth_date
    FROM users u
    WHERE pp.user_id = u.id
      AND (u.city IS NOT NULL OR u.birth_date IS NOT NULL);
    
    RAISE NOTICE 'Datos migrados de users a player_profiles';
  ELSE
    RAISE NOTICE 'No hay datos que migrar o columnas no existen en users';
  END IF;
END $$;

-- 3. Añadir comentarios
COMMENT ON COLUMN player_profiles.city IS 'Ciudad del jugador (PÚBLICO)';
COMMENT ON COLUMN player_profiles.birth_date IS 'Fecha de nacimiento del jugador (PÚBLICO)';
COMMENT ON COLUMN users.phone IS 'Teléfono del usuario (PRIVADO - solo visible para el usuario y admins)';

-- 4. Verificar resultado
SELECT 
  'player_profiles' as tabla,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'player_profiles' 
  AND column_name IN ('city', 'birth_date')
UNION ALL
SELECT 
  'users' as tabla,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name IN ('phone')
ORDER BY tabla, column_name;

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================
-- ESTRUCTURA FINAL:
--
-- player_profiles (PÚBLICO):
--  - city (VARCHAR(100))
--  - birth_date (DATE)
--  - display_name, bio, skill_level, etc.
--
-- users (PRIVADO):
--  - phone (VARCHAR(20)) ← PRIVADO
--  - email (de auth.users) ← PRIVADO
--
-- VISIBILIDAD:
--  - Email y Teléfono: Solo en dashboard privado
--  - Ciudad y Fecha: Visible en perfil público
-- =====================================================
