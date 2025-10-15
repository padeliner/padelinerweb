-- ================================================================
-- VERIFICAR SI ALGO BLOQUEA BASADO EN ROLES DE APLICACIÓN
-- ================================================================

-- 1. Ver si hay alguna policy que mencione 'role' en su expresión
SELECT 
    schemaname,
    tablename,
    policyname,
    COALESCE(pg_get_expr(polqual, polrelid), 'NO USING') as using_expr,
    COALESCE(pg_get_expr(polwithcheck, polrelid), 'NO WITH CHECK') as with_check_expr
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
WHERE nsp.nspname = 'public'
AND (
    pg_get_expr(polqual, polrelid) ILIKE '%role%'
    OR pg_get_expr(polwithcheck, polrelid) ILIKE '%role%'
)
ORDER BY tablename, policyname;

-- 2. Ver datos específicos del usuario admin que está intentando
SELECT 
    id,
    email,
    role,
    full_name,
    'Usuario que intenta contactar' as nota
FROM users
WHERE id = 'f6802450-c094-491e-8b44-a36ebc795676';

-- 3. Ver datos del entrenador objetivo
SELECT 
    id,
    email,
    role,
    full_name,
    'Entrenador objetivo' as nota
FROM users
WHERE id = '900d2812-8c39-4b08-a967-344c494f6b81';

-- 4. Ver si hay triggers que puedan estar bloqueando
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('direct_conversations', 'direct_conversation_participants', 'direct_messages')
ORDER BY event_object_table, trigger_name;

-- 5. Intentar un INSERT manual simulando el usuario admin
-- IMPORTANTE: Esto se ejecutará como postgres, no como el usuario
-- Solo para ver si hay otros errores
/*
SET LOCAL role TO authenticated;
INSERT INTO direct_conversations (created_by) 
VALUES ('f6802450-c094-491e-8b44-a36ebc795676')
RETURNING *;
ROLLBACK;
*/
