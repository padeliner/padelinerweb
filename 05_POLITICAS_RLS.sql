-- ============================================
-- 5. POLÍTICAS RLS (Row Level Security)
-- ============================================

SELECT 
  schemaname AS schema,
  tablename AS tabla,
  policyname AS politica,
  permissive AS permisiva,
  roles AS roles,
  cmd AS comando,
  qual AS condicion_using,
  with_check AS condicion_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
