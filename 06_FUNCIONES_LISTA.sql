-- ============================================
-- 6. LISTA DE FUNCIONES (nombres y detalles)
-- ============================================

SELECT 
  p.proname AS funcion,
  pg_get_function_arguments(p.oid) AS argumentos,
  pg_get_function_result(p.oid) AS retorna,
  l.lanname AS lenguaje,
  CASE p.provolatile
    WHEN 'i' THEN 'IMMUTABLE'
    WHEN 's' THEN 'STABLE'
    WHEN 'v' THEN 'VOLATILE'
  END AS volatilidad
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_language l ON p.prolang = l.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname;
