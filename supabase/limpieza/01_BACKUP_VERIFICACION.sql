-- ============================================
-- PASO 0: VERIFICACIÓN ANTES DE EMPEZAR
-- ============================================
-- Ejecuta esto PRIMERO para verificar el estado actual

-- 1. Verificar que location_distance_cache existe (la vamos a eliminar)
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as tamaño,
  (SELECT COUNT(*) FROM location_distance_cache) as num_registros
FROM pg_stat_user_tables
WHERE tablename = 'location_distance_cache';

-- 2. Contar políticas duplicadas que vamos a eliminar
SELECT COUNT(*) as politicas_a_eliminar
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname IN (
    'Admins can view all academies',
    'Admins can view all clubs', 
    'Admins can view all coaches',
    'Anyone can view coaches',
    'Admins can view all conversations',
    'Admins can view all comments',
    'Admins can view all sessions',
    'Admins can view team members',
    'Admins can view teams'
  );

-- 3. Verificar que la función is_admin NO existe aún
SELECT COUNT(*) as funcion_is_admin_existe
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'is_admin';

-- 4. Verificar índices actuales en direct_messages
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'direct_messages' 
  AND schemaname = 'public'
ORDER BY indexname;

-- RESULTADO ESPERADO:
-- location_distance_cache: existe con 0 o pocos registros
-- politicas_a_eliminar: 9 (las que vamos a borrar)
-- funcion_is_admin_existe: 0 (aún no existe)
-- índices: solo los PKs y FKs actuales
