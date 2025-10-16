-- ============================================
-- 2. TODAS LAS COLUMNAS DE TODAS LAS TABLAS
-- ============================================

SELECT 
  table_name AS tabla,
  column_name AS columna,
  data_type AS tipo,
  CASE 
    WHEN character_maximum_length IS NOT NULL 
    THEN data_type || '(' || character_maximum_length || ')'
    ELSE data_type
  END AS tipo_completo,
  CASE WHEN is_nullable = 'YES' THEN 'SÍ' ELSE 'NO' END AS nullable,
  column_default AS valor_default,
  ordinal_position AS posicion
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
