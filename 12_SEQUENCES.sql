-- ============================================
-- 12. SEQUENCES (auto-incrementos)
-- ============================================

SELECT 
  sequence_schema AS schema,
  sequence_name AS sequence,
  data_type AS tipo,
  start_value AS valor_inicial,
  minimum_value AS minimo,
  maximum_value AS maximo,
  increment AS incremento
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;
