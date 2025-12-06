-- ============================================
-- 4. ÍNDICES
-- ============================================

SELECT 
  schemaname AS schema,
  tablename AS tabla,
  indexname AS indice,
  indexdef AS definicion
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
