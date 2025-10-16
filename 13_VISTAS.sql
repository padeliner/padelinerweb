-- ============================================
-- 13. VISTAS (VIEWS)
-- ============================================

SELECT 
  table_schema AS schema,
  table_name AS vista,
  view_definition AS definicion
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;
