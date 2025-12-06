-- =====================================================
-- AGREGAR CAMPOS PRIVADOS A TABLA USERS
-- =====================================================
-- Fecha: 2025-01-17
-- Descripción: Añade campos privados (phone, city, birth_date) 
--              a la tabla users si no existen
-- =====================================================

-- Añadir columna phone (teléfono)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    RAISE NOTICE 'Columna phone añadida a users';
  ELSE
    RAISE NOTICE 'Columna phone ya existe en users';
  END IF;
END $$;

-- Añadir columna city (ciudad)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'city'
  ) THEN
    ALTER TABLE users ADD COLUMN city VARCHAR(100);
    RAISE NOTICE 'Columna city añadida a users';
  ELSE
    RAISE NOTICE 'Columna city ya existe en users';
  END IF;
END $$;

-- Añadir columna birth_date (fecha de nacimiento)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE users ADD COLUMN birth_date DATE;
    RAISE NOTICE 'Columna birth_date añadida a users';
  ELSE
    RAISE NOTICE 'Columna birth_date ya existe en users';
  END IF;
END $$;

-- Verificar que las columnas se crearon
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name IN ('phone', 'city', 'birth_date')
ORDER BY column_name;

COMMENT ON COLUMN users.phone IS 'Teléfono del usuario (PRIVADO - solo visible para el usuario y admins)';
COMMENT ON COLUMN users.city IS 'Ciudad del usuario (PRIVADO - solo visible para el usuario y admins)';
COMMENT ON COLUMN users.birth_date IS 'Fecha de nacimiento del usuario (PRIVADO - solo visible para el usuario y admins)';

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================
-- Campos añadidos:
--  - phone (VARCHAR(20))
--  - city (VARCHAR(100))
--  - birth_date (DATE)
--
-- Todos los campos son PRIVADOS y solo visibles en:
--  1. Dashboard privado del jugador (/dashboard/jugador)
--  2. Panel de administración
--  3. NUNCA en perfil público (/jugadores/[id])
-- =====================================================
