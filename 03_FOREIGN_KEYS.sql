-- ============================================
-- 3. FOREIGN KEYS (RELACIONES)
-- ============================================

SELECT 
  tc.table_name AS tabla_origen,
  kcu.column_name AS columna_origen,
  ccu.table_name AS tabla_destino,
  ccu.column_name AS columna_destino,
  tc.constraint_name AS nombre_constraint,
  rc.update_rule AS on_update,
  rc.delete_rule AS on_delete
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
