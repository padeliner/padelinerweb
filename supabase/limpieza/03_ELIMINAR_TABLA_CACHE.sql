-- ============================================
-- PASO 2: ELIMINAR TABLA NO USADA
-- ============================================
-- location_distance_cache NO se usa en el código

-- Ver datos antes de eliminar (por si acaso)
SELECT COUNT(*) as registros_actuales FROM location_distance_cache;

-- Si quieres ver los datos antes de borrar (opcional)
-- SELECT * FROM location_distance_cache LIMIT 10;

-- Eliminar la tabla y todas sus dependencias
DROP TABLE IF EXISTS location_distance_cache CASCADE;

-- Verificar que se eliminó
SELECT COUNT(*) as tabla_existe
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'location_distance_cache';

-- RESULTADO ESPERADO:
-- tabla_existe: 0

-- ✅ Si el resultado es 0, la tabla se eliminó correctamente
-- Espacio recuperado: ~5-10 KB
