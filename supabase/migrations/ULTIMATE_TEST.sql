-- ================================================================
-- TEST DEFINITIVO: Desactivar RLS temporalmente para confirmar
-- ================================================================

-- 1. Ver si hay policies RESTRICTIVE (bloquean aunque haya PERMISSIVE)
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE WHEN permissive = 'RESTRICTIVE' THEN '⚠️ BLOCKING' ELSE '✅ OK' END as status,
    permissive,
    cmd
FROM pg_policies
WHERE tablename = 'direct_conversations'
ORDER BY permissive DESC, policyname;

-- 2. Ver la expresión EXACTA del WITH CHECK
SELECT 
    polname as policy_name,
    polcmd as command,
    CASE polcmd
        WHEN 'a' THEN 'INSERT'
        WHEN 'r' THEN 'SELECT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        ELSE polcmd::text
    END as command_text,
    polpermissive as is_permissive,
    polroles::regrole[] as roles,
    COALESCE(pg_get_expr(polqual, polrelid), 'NO USING') as using_expression,
    COALESCE(pg_get_expr(polwithcheck, polrelid), 'NO WITH CHECK') as with_check_expression
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'direct_conversations'
AND polcmd = 'a'  -- INSERT only
ORDER BY polname;

-- ================================================================
-- OPCIÓN 1: DESHABILITAR RLS TEMPORALMENTE
-- ================================================================
-- Ejecuta esto SOLO si quieres probarlo sin RLS:
/*
ALTER TABLE direct_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE direct_conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages DISABLE ROW LEVEL SECURITY;
*/

-- ================================================================
-- OPCIÓN 2: RECREAR POLICY DE INSERT MÁS SIMPLE
-- ================================================================
-- Eliminar policy actual
DROP POLICY IF EXISTS "insert_conversations_policy" ON direct_conversations;

-- Crear la policy MÁS permisiva posible
CREATE POLICY "insert_conversations_policy"
ON direct_conversations
FOR INSERT
-- NO especificar TO, aplica a todos los roles
WITH CHECK (true);  -- Siempre permitir

-- Verificar que se creó correctamente
SELECT 
    polname,
    polroles::regrole[] as applies_to,
    pg_get_expr(polwithcheck, polrelid) as with_check
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'direct_conversations'
AND polcmd = 'a';
