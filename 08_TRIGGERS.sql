-- ============================================
-- 8. TRIGGERS
-- ============================================

SELECT 
  event_object_schema AS schema,
  event_object_table AS tabla,
  trigger_name AS trigger,
  event_manipulation AS evento,
  action_timing AS timing,
  action_orientation AS orientacion,
  action_statement AS accion
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
