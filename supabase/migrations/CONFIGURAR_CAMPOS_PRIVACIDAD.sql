-- =====================================================
-- CONFIGURAR CAMPOS DE PRIVACIDAD
-- =====================================================
-- Fecha: 2025-01-17
-- 
-- CAMPOS PRIVADOS (solo en dashboard privado):
--   - email (ya existe en users/auth)
--   - phone (se añade a users)
--
-- CAMPOS PÚBLICOS (visibles en perfil público):
--   - city (se añade a player_profiles)
--   - birth_date (se añade a player_profiles)
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

-- 2. AÑADIR CIUDAD A PLAYER_PROFILES (PÚBLICO)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN city VARCHAR(100);
    RAISE NOTICE '✅ Columna city añadida a player_profiles (PÚBLICO)';
  ELSE
    RAISE NOTICE 'ℹ️  Columna city ya existe en player_profiles';
  END IF;
END $$;

-- 3. AÑADIR FECHA DE NACIMIENTO A PLAYER_PROFILES (PÚBLICO)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'player_profiles' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE player_profiles ADD COLUMN birth_date DATE;
    RAISE NOTICE '✅ Columna birth_date añadida a player_profiles (PÚBLICO)';
  ELSE
    RAISE NOTICE 'ℹ️  Columna birth_date ya existe en player_profiles';
  END IF;
END $$;

-- 4. AÑADIR COMENTARIOS EXPLICATIVOS
COMMENT ON COLUMN users.phone IS 'Teléfono del usuario - PRIVADO (solo visible en dashboard privado y para admins)';
COMMENT ON COLUMN player_profiles.city IS 'Ciudad del jugador - PÚBLICO (visible en perfil público)';
COMMENT ON COLUMN player_profiles.birth_date IS 'Fecha de nacimiento del jugador - PÚBLICO (visible en perfil público)';

-- 5. VERIFICAR RESULTADO
SELECT 
  '📊 RESUMEN DE CAMPOS DE PRIVACIDAD' as info;

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
  '🌐 PÚBLICOS (player_profiles)' as categoria,
  column_name as campo, 
  data_type as tipo,
  CASE 
    WHEN column_name = 'city' THEN 'Ciudad del jugador'
    WHEN column_name = 'birth_date' THEN 'Fecha de nacimiento'
  END as descripcion
FROM information_schema.columns
WHERE table_name = 'player_profiles' 
  AND column_name IN ('city', 'birth_date')

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
--    ├─ city       → Visible en perfil público
--    ├─ birth_date → Visible en perfil público
--    ├─ display_name
--    ├─ bio
--    ├─ skill_level
--    └─ ... (resto de campos del perfil)
--
-- 📍 UBICACIONES:
--    • Email y Teléfono: /dashboard/jugador (tab Editar Perfil)
--    • Ciudad y Fecha:   /dashboard/jugador (tab Editar Perfil)
--                        /jugadores/[id] (perfil público)
-- =====================================================
