-- ============================================
-- FIX: User Presence - Usuarios siempre online
-- ============================================

-- DIAGNÓSTICO: Verificar estado actual

-- 1. Ver políticas actuales de user_presence
SELECT 
  policyname,
  cmd,
  qual as condicion_using,
  with_check as condicion_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_presence'
ORDER BY policyname;

-- 2. Ver usuarios actualmente en la tabla
SELECT 
  user_id,
  status,
  last_seen,
  updated_at,
  NOW() - updated_at as tiempo_inactivo
FROM user_presence
ORDER BY updated_at DESC
LIMIT 10;

-- 3. Verificar que la función update_user_presence existe
SELECT 
  proname,
  pg_get_functiondef(oid) as definicion
FROM pg_proc
WHERE proname = 'update_user_presence';

-- 4. Verificar que la función mark_inactive_users_offline existe
SELECT 
  proname,
  pg_get_functiondef(oid) as definicion
FROM pg_proc
WHERE proname = 'mark_inactive_users_offline';

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Políticas: Debe haber 2 políticas
--   - "Users can update own presence" (ALL)
--   - "Users can view presence of others" (SELECT)
--
-- Usuarios: Deberían tener diferentes status (online/offline)
--           y updated_at actualizado recientemente para online
--
-- Funciones: Ambas deben existir
-- ============================================

-- SI FALTAN POLÍTICAS, EJECUTA ESTO:
-- (Solo si las políticas no existen)

-- DROP POLICY IF EXISTS "Users can update own presence" ON user_presence;
-- DROP POLICY IF EXISTS "Users can view presence of others" ON user_presence;

-- CREATE POLICY "Users can update own presence"
--   ON user_presence FOR ALL
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can view presence of others"
--   ON user_presence FOR SELECT
--   USING (true);
