-- ================================================================
-- EXPORTAR ESTRUCTURA COMPLETA DE LA BASE DE DATOS
-- Ejecuta este script y copia TODO el resultado
-- ================================================================

-- ================================================================
-- LISTAR TODAS LAS TABLAS CON SUS COLUMNAS EN FORMATO LEGIBLE
-- ================================================================
SELECT 
    t.table_name,
    string_agg(
        c.column_name || ' | ' || 
        c.data_type || 
        CASE 
            WHEN c.character_maximum_length IS NOT NULL 
            THEN '(' || c.character_maximum_length || ')'
            ELSE ''
        END || 
        CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
        E'\n    '
        ORDER BY c.ordinal_position
    ) as columns
FROM information_schema.tables t
LEFT JOIN information_schema.columns c 
    ON t.table_name = c.table_name 
    AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;

-- ================================================================
-- ALTERNATIVA: FORMATO TABLA POR TABLA (más detallado)
-- ================================================================

-- Generar script que muestra cada tabla individualmente
DO $$
DECLARE
    tabla text;
BEGIN
    FOR tabla IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        RAISE NOTICE E'\n========================================';
        RAISE NOTICE 'TABLA: %', tabla;
        RAISE NOTICE '========================================';
        
        -- Mostrar columnas
        FOR rec IN 
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = tabla
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  % | % | % | %', 
                rec.column_name, 
                rec.data_type, 
                rec.is_nullable,
                COALESCE(rec.column_default, 'no default');
        END LOOP;
    END LOOP;
END $$;

-- ================================================================
-- BUSCAR TABLAS QUE PUEDAN SER DE CONVERSACIONES/MENSAJES
-- ================================================================
SELECT 
    table_name,
    (
        SELECT COUNT(*) 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND columns.table_name = tables.table_name
    ) as num_columns
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
AND (
    table_name LIKE '%conversation%' OR
    table_name LIKE '%message%' OR
    table_name LIKE '%chat%' OR
    table_name LIKE '%participant%' OR
    table_name LIKE '%mensaj%' OR
    table_name LIKE '%conversacion%'
)
ORDER BY table_name;
