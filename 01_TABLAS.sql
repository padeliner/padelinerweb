-- ============================================
-- 1. LISTA DE TODAS LAS TABLAS
-- ============================================

SELECT 
  t.table_name AS tabla,
  pg_stat_get_live_tuples(c.oid) AS filas,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS tamaño
FROM information_schema.tables t
LEFT JOIN pg_class c ON c.relname = t.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;
