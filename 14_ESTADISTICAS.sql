-- ============================================
-- 14. ESTADÍSTICAS GENERALES
-- ============================================

SELECT 
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS total_tablas,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public') AS total_columnas,
  (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.prokind = 'f') AS total_funciones,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') AS total_politicas_rls,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') AS total_indices,
  (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') AS total_triggers,
  pg_size_pretty(pg_database_size(current_database())) AS tamaño_total_db;
