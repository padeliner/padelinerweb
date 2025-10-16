-- ============================================
-- 7. CÓDIGO COMPLETO DE CADA FUNCIÓN
-- ============================================
-- IMPORTANTE: Este query devuelve el código SQL completo
-- de cada función para que puedas recrearlas
-- ============================================

SELECT 
  p.proname AS nombre_funcion,
  pg_get_functiondef(p.oid) AS codigo_completo
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname;
