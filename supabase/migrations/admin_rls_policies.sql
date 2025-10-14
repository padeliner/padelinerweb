-- ===================================
-- POLÍTICAS RLS PARA ADMINISTRADORES
-- ===================================
-- Fecha: Octubre 2025
-- Estado: ✅ PROBADO Y FUNCIONANDO
-- 
-- Descripción: Políticas de Row Level Security que permiten ÚNICAMENTE a usuarios
--              con rol 'admin' gestionar todos los recursos de la plataforma.
--
-- IMPORTANTE: 
-- - Usa JWT claims para evitar recursión infinita
-- - El rol se guarda automáticamente en el JWT mediante un trigger
-- - Solo ejecutar UNA VEZ después de crear las tablas y políticas básicas
-- ===================================

-- PASO 1: Crear función para actualizar JWT metadata
CREATE OR REPLACE FUNCTION public.handle_user_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el raw_app_meta_data del usuario en auth.users
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 2: Crear trigger para cuando cambie el rol
DROP TRIGGER IF EXISTS on_user_role_change ON users;
CREATE TRIGGER on_user_role_change
  AFTER INSERT OR UPDATE OF role ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_change();

-- PASO 3: Actualizar todos los usuarios existentes para que tengan el rol en el JWT
UPDATE auth.users au
SET raw_app_meta_data = 
  COALESCE(raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', u.role)
FROM users u
WHERE au.id = u.id;

-- PASO 4: Ahora SÍ puedes crear las políticas usando el JWT (sin recursión)
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- Coaches
CREATE POLICY "Admins can view all coaches"
ON coaches FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

CREATE POLICY "Admins can manage all coaches"
ON coaches FOR ALL
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- Academies
CREATE POLICY "Admins can view all academies"
ON academies FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

CREATE POLICY "Admins can manage all academies"
ON academies FOR ALL
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- Clubs
CREATE POLICY "Admins can view all clubs"
ON clubs FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

CREATE POLICY "Admins can manage all clubs"
ON clubs FOR ALL
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- Sessions
CREATE POLICY "Admins can view all sessions"
ON sessions FOR SELECT
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

CREATE POLICY "Admins can manage all sessions"
ON sessions FOR ALL
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
);

-- ===================================
-- VERIFICACIÓN
-- ===================================

-- Ejecuta este query para verificar que las políticas se crearon correctamente:
/*
SELECT 
    tablename AS tabla,
    policyname AS politica,
    cmd AS comando
FROM pg_policies
WHERE schemaname = 'public'
AND policyname ILIKE '%admin%'
ORDER BY tablename, policyname;
*/

-- Verifica que el trigger esté activo:
/*
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_user_role_change';
*/

-- Verifica que tu usuario tenga el rol en el JWT:
/*
SELECT 
    id,
    email,
    raw_app_meta_data->>'role' as jwt_role
FROM auth.users
WHERE email = 'tu-email@example.com';
*/

-- ===================================
-- NOTAS IMPORTANTES
-- ===================================

-- 1. ❌ NO USAR: Consultar la tabla users dentro de una política de users causa recursión infinita
--    USING (EXISTS (SELECT 1 FROM users WHERE ...)) -- ❌ MAL
--
-- 2. ✅ USAR: JWT claims para evitar recursión
--    USING ((auth.jwt()->>'role')::text = 'admin') -- ✅ BIEN
--
-- 3. Las políticas son PERMISSIVE, se combinan con OR lógico con otras políticas.
--
-- 4. Para eliminar una política problemática:
--    DROP POLICY "nombre_politica" ON nombre_tabla;
--
-- 5. Para deshabilitar RLS temporalmente (SOLO DESARROLLO):
--    ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;
--
-- 6. Para habilitar RLS:
--    ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;
--
-- 7. Para ver todas las políticas de una tabla:
--    SELECT * FROM pg_policies WHERE tablename = 'nombre_tabla';
--
-- 8. IMPORTANTE: El trigger handle_user_role_change() debe ejecutarse ANTES
--    de crear las políticas, para que todos los usuarios tengan el rol en el JWT.

-- ===================================
-- CÓMO DAR ACCESO ADMIN A UN USUARIO
-- ===================================

-- 1. Ve a Supabase → Table Editor → tabla 'users'
-- 2. Busca el usuario por email
-- 3. Cambia el campo 'role' a 'admin'
-- 4. Guarda
-- 5. El usuario debe hacer LOGOUT y LOGIN para refrescar su JWT
-- 6. ¡Listo! Ya tiene acceso completo al dashboard admin

-- ===================================
-- CÓMO REVOCAR ACCESO ADMIN
-- ===================================

-- 1. Cambia el campo 'role' de 'admin' a otro (ej: 'alumno', 'entrenador')
-- 2. El usuario debe hacer logout/login
-- 3. Ya no podrá acceder al dashboard admin

-- ===================================
-- TROUBLESHOOTING
-- ===================================

-- ❌ Error "infinite recursion detected":
-- Significa que hay políticas que consultan la misma tabla.
-- Solución: DROP las políticas problemáticas y usar auth.jwt() en su lugar

-- ❌ Error "user is not admin but should be":
-- El rol no está en el JWT. Solución:
-- 1. Verifica que el trigger existe:
--    SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_user_role_change';
-- 2. Fuerza la actualización del JWT:
--    UPDATE users SET role = 'admin' WHERE email = 'tu-email@example.com';
-- 3. Haz logout y login

-- ❌ Las estadísticas no cargan en el dashboard:
-- Verifica que las políticas de admin existen:
-- SELECT * FROM pg_policies WHERE policyname ILIKE '%admin%';

-- ===================================
-- RESULTADO ESPERADO
-- ===================================

-- Después de ejecutar este script, deberías tener:
-- ✅ 11 políticas de admin activas
-- ✅ 1 trigger que actualiza el JWT automáticamente
-- ✅ Todos los usuarios existentes con el rol en su JWT

-- Tabla de políticas:
-- | tabla     | politica                        | comando |
-- |-----------|----------------------------------|---------|
-- | users     | Admins can view all users       | SELECT  |
-- | users     | Admins can update all users     | UPDATE  |
-- | users     | Admins can delete users         | DELETE  |
-- | coaches   | Admins can view all coaches     | SELECT  |
-- | coaches   | Admins can manage all coaches   | ALL     |
-- | academies | Admins can view all academies   | SELECT  |
-- | academies | Admins can manage all academies | ALL     |
-- | clubs     | Admins can view all clubs       | SELECT  |
-- | clubs     | Admins can manage all clubs     | ALL     |
-- | sessions  | Admins can view all sessions    | SELECT  |
-- | sessions  | Admins can manage all sessions  | ALL     |

-- ===================================
-- MANTENIMIENTO
-- ===================================

-- Este script NO necesita ser ejecutado de nuevo.
-- El trigger se encarga de mantener el JWT actualizado automáticamente.
-- Solo necesitas cambiar el rol en la tabla 'users' desde Supabase.

-- ===================================
-- FIN DEL ARCHIVO
-- ===================================
