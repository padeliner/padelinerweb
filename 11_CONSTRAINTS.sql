-- ============================================
-- 11. CONSTRAINTS (PRIMARY KEY, UNIQUE, CHECK)
-- ============================================

SELECT 
  tc.table_name AS tabla,
  tc.constraint_name AS constraint,
  tc.constraint_type AS tipo,
  kcu.column_name AS columna,
  cc.check_clause AS condicion_check
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE', 'CHECK')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;
