-- ============================================
-- VERSIÓN SIMPLIFICADA (por si la otra falla)
-- Ejecuta cada sección por separado
-- ============================================

-- 1. LISTA DE TABLAS
SELECT 
  schemaname,
  tablename,
  n_live_tup as filas,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as tamaño
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. COLUMNAS DE CADA TABLA
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 3. FOREIGN KEYS
SELECT 
  tc.table_name as tabla_origen,
  kcu.column_name as columna_origen,
  ccu.table_name as tabla_destino,
  ccu.column_name as columna_destino,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. ÍNDICES
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 5. POLÍTICAS RLS
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. FUNCIONES (nombres)
SELECT 
  p.proname as funcion,
  pg_get_function_arguments(p.oid) as argumentos,
  pg_get_function_result(p.oid) as retorna
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname;

-- 7. CÓDIGO COMPLETO DE FUNCIONES (ejecuta uno por uno)
SELECT pg_get_functiondef(p.oid) as codigo_funcion
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND p.proname = 'NOMBRE_DE_TU_FUNCION'; -- Cambia por cada función

-- 8. TRIGGERS
SELECT 
  event_object_table as tabla,
  trigger_name,
  event_manipulation as evento,
  action_timing,
  action_statement as funcion
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- 9. ENUMS
SELECT 
  t.typname as enum_type,
  array_agg(e.enumlabel ORDER BY e.enumsortorder) as valores
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname
ORDER BY t.typname;

-- 10. EXTENSIONES
SELECT 
  extname,
  extversion,
  (SELECT nspname FROM pg_namespace WHERE oid = extnamespace) as schema
FROM pg_extension
ORDER BY extname;

-- 11. ESTADÍSTICAS
SELECT 
  'Total Tablas' as metrica,
  COUNT(*)::text as valor
FROM pg_tables 
WHERE schemaname = 'public'

UNION ALL

SELECT 
  'Total Funciones',
  COUNT(*)::text
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' AND p.prokind = 'f'

UNION ALL

SELECT 
  'Tamaño Total DB',
  pg_size_pretty(pg_database_size(current_database()));
