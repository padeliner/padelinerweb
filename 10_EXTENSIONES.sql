-- ============================================
-- 10. EXTENSIONES INSTALADAS
-- ============================================

SELECT 
  extname AS extension,
  extversion AS version,
  (SELECT nspname FROM pg_namespace WHERE oid = extnamespace) AS schema
FROM pg_extension
ORDER BY extname;
