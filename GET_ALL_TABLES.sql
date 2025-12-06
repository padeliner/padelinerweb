-- ================================================================
-- SCRIPT SIMPLE: TODAS LAS TABLAS Y SUS COLUMNAS
-- Copia TODO el resultado y pégamelo
-- ================================================================

-- 1. PRIMERO: Lista simple de todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Ejecuta esto y envíame el resultado ↑↑↑
-- Después ejecuta lo siguiente ↓↓↓

-- 2. SEGUNDO: Columnas de CADA tabla (ejecuta después)
-- Reemplaza 'NOMBRE_TABLA' con cada nombre de tabla que apareció arriba

-- Ejemplo para conversations:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'conversations'
ORDER BY ordinal_position;

-- Repite para cada tabla que viste en el paso 1
