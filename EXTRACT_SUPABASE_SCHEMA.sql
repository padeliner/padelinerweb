-- ============================================
-- SCRIPT PARA EXTRAER TODO EL SCHEMA DE SUPABASE
-- Ejecuta esto en el SQL Editor de Supabase
-- Copia el resultado en un archivo .md
-- ============================================

-- 1. RESUMEN GENERAL
SELECT '# 📊 SCHEMA COMPLETO DE PADELINER - SUPABASE' AS markdown
UNION ALL
SELECT ''
UNION ALL
SELECT '**Fecha de extracción:** ' || NOW()::date
UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 2. TABLAS
SELECT '## 📋 TABLAS'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Tabla | Filas | Tamaño | Descripción |'
UNION ALL
SELECT '|-------|-------|--------|-------------|'
UNION ALL
SELECT 
  '| `' || schemaname || '.' || tablename || '` | ' ||
  COALESCE(n_live_tup::text, '0') || ' | ' ||
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) || ' | ' ||
  COALESCE(obj_description((schemaname||'.'||tablename)::regclass), '-') || ' |'
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 3. COLUMNAS POR TABLA
SELECT '## 🔧 COLUMNAS DETALLADAS'
UNION ALL
SELECT ''
UNION ALL
(
  SELECT string_agg(
    '### 📦 Tabla: `' || table_name || '`' || E'\n' ||
    E'\n' ||
    '| Columna | Tipo | Nullable | Default | Descripción |' || E'\n' ||
    '|---------|------|----------|---------|-------------|' || E'\n' ||
    column_info || E'\n',
    E'\n'
  )
  FROM (
    SELECT 
      c.table_name,
      string_agg(
        '| `' || c.column_name || '` | ' ||
        c.data_type || 
        CASE WHEN c.character_maximum_length IS NOT NULL 
          THEN '(' || c.character_maximum_length || ')' 
          ELSE '' 
        END || ' | ' ||
        CASE WHEN c.is_nullable = 'YES' THEN '✅' ELSE '❌' END || ' | ' ||
        COALESCE('`' || c.column_default || '`', '-') || ' | ' ||
        COALESCE(pgd.description, '-') || ' |',
        E'\n'
        ORDER BY c.ordinal_position
      ) as column_info
    FROM information_schema.columns c
    LEFT JOIN pg_catalog.pg_statio_all_tables st ON 
      c.table_schema = st.schemaname AND c.table_name = st.relname
    LEFT JOIN pg_catalog.pg_description pgd ON 
      pgd.objoid = st.relid AND pgd.objsubid = c.ordinal_position
    WHERE c.table_schema = 'public'
    GROUP BY c.table_name
    ORDER BY c.table_name
  ) t
)

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 4. FOREIGN KEYS
SELECT '## 🔗 FOREIGN KEYS (Relaciones)'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Tabla Origen | Columna | → | Tabla Destino | Columna | Acción |'
UNION ALL
SELECT '|--------------|---------|---|---------------|---------|--------|'
UNION ALL
SELECT 
  '| `' || tc.table_name || '` | ' ||
  '`' || kcu.column_name || '` | → | ' ||
  '`' || ccu.table_name || '` | ' ||
  '`' || ccu.column_name || '` | ' ||
  rc.update_rule || '/' || rc.delete_rule || ' |'
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
ORDER BY tc.table_name, kcu.column_name

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 5. ÍNDICES
SELECT '## ⚡ ÍNDICES'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Tabla | Índice | Columnas | Tipo | Único |'
UNION ALL
SELECT '|-------|--------|----------|------|-------|'
UNION ALL
SELECT 
  '| `' || tablename || '` | ' ||
  '`' || indexname || '` | ' ||
  COALESCE(indexdef, '-') || ' | ' ||
  CASE WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE' ELSE 'INDEX' END || ' | ' ||
  CASE WHEN indexdef LIKE '%UNIQUE%' THEN '✅' ELSE '❌' END || ' |'
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 6. POLÍTICAS RLS
SELECT '## 🔒 POLÍTICAS RLS (Row Level Security)'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Tabla | Política | Comando | Roles | Using | With Check |'
UNION ALL
SELECT '|-------|----------|---------|-------|-------|------------|'
UNION ALL
SELECT 
  '| `' || tablename || '` | ' ||
  '`' || policyname || '` | ' ||
  cmd || ' | ' ||
  COALESCE(roles::text, '-') || ' | ' ||
  COALESCE(LEFT(qual, 50), '-') || '... | ' ||
  COALESCE(LEFT(with_check, 50), '-') || '... |'
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 7. FUNCIONES
SELECT '## ⚙️ FUNCIONES (Functions)'
UNION ALL
SELECT ''
UNION ALL
SELECT '### ' || p.proname
UNION ALL
SELECT ''
UNION ALL
SELECT '```sql'
UNION ALL
SELECT pg_get_functiondef(p.oid)
UNION ALL
SELECT '```'
UNION ALL
SELECT ''
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 8. TRIGGERS
SELECT '## ⚡ TRIGGERS'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Tabla | Trigger | Evento | Timing | Función |'
UNION ALL
SELECT '|-------|---------|--------|--------|---------|'
UNION ALL
SELECT 
  '| `' || event_object_table || '` | ' ||
  '`' || trigger_name || '` | ' ||
  event_manipulation || ' | ' ||
  action_timing || ' | ' ||
  '`' || action_statement || '` |'
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 9. ENUMS
SELECT '## 📝 TIPOS ENUMERADOS (ENUMs)'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Tipo | Valores |'
UNION ALL
SELECT '|------|---------|'
UNION ALL
SELECT 
  '| `' || t.typname || '` | ' ||
  string_agg('`' || e.enumlabel || '`', ', ' ORDER BY e.enumsortorder) || ' |'
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname
ORDER BY t.typname

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 10. EXTENSIONES
SELECT '## 🔌 EXTENSIONES INSTALADAS'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Extensión | Versión | Schema | Descripción |'
UNION ALL
SELECT '|-----------|---------|--------|-------------|'
UNION ALL
SELECT 
  '| `' || extname || '` | ' ||
  extversion || ' | ' ||
  (SELECT nspname FROM pg_namespace WHERE oid = extnamespace) || ' | ' ||
  COALESCE(
    (SELECT comment FROM pg_description WHERE objoid = ext.oid), 
    '-'
  ) || ' |'
FROM pg_extension ext
ORDER BY extname

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''

UNION ALL

-- 11. RESUMEN ESTADÍSTICAS
SELECT '## 📊 ESTADÍSTICAS GENERALES'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Métrica | Valor |'
UNION ALL
SELECT '|---------|-------|'
UNION ALL
SELECT '| **Total Tablas** | ' || COUNT(*)::text || ' |' FROM pg_tables WHERE schemaname = 'public'
UNION ALL
SELECT '| **Total Funciones** | ' || COUNT(*)::text || ' |' FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.prokind = 'f'
UNION ALL
SELECT '| **Total Triggers** | ' || COUNT(*)::text || ' |' FROM information_schema.triggers WHERE trigger_schema = 'public'
UNION ALL
SELECT '| **Total Índices** | ' || COUNT(*)::text || ' |' FROM pg_indexes WHERE schemaname = 'public'
UNION ALL
SELECT '| **Total Políticas RLS** | ' || COUNT(*)::text || ' |' FROM pg_policies WHERE schemaname = 'public'
UNION ALL
SELECT '| **Tamaño Total DB** | ' || pg_size_pretty(pg_database_size(current_database())) || ' |'

UNION ALL
SELECT ''
UNION ALL
SELECT '---'
UNION ALL
SELECT ''
UNION ALL
SELECT '**🎾 Fin del schema - Padeliner**';
