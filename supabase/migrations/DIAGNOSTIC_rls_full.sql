-- ================================================================
-- DIAGNÓSTICO COMPLETO DE RLS EN DIRECT_CONVERSATIONS
-- ================================================================

-- 1. Ver estado de RLS en las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename LIKE 'direct_%'
ORDER BY tablename;

-- 2. Ver TODAS las policies con sus detalles completos
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,  -- PERMISSIVE o RESTRICTIVE
    roles,
    cmd,  -- SELECT, INSERT, UPDATE, DELETE
    qual as "USING expression",
    with_check as "WITH CHECK expression"
FROM pg_policies
WHERE tablename LIKE 'direct_%'
ORDER BY tablename, cmd, policyname;

-- 3. Ver si hay policies RESTRICTIVE que bloquean
SELECT 
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies
WHERE tablename = 'direct_conversations'
AND permissive = 'RESTRICTIVE';

-- 4. Probar si el rol authenticated tiene permisos
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'direct_conversations'
ORDER BY grantee, privilege_type;

-- 5. Ver la definición exacta de la policy de INSERT
SELECT 
    pg_get_expr(polqual, polrelid) as using_clause,
    pg_get_expr(polwithcheck, polrelid) as with_check_clause,
    polpermissive as is_permissive,
    polroles::regrole[] as applies_to_roles,
    polcmd as command
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'direct_conversations'
AND polcmd = 'a'  -- 'a' = INSERT
ORDER BY polname;

-- 6. Test manual: Verificar usuario actual
SELECT 
    'Current auth info:' as info,
    auth.uid() as current_user_id,
    auth.role() as current_auth_role,
    current_user as current_db_user;

-- 7. Intentar INSERT manual (esto fallará con el mismo error)
-- Descomenta para probar:
/*
INSERT INTO direct_conversations (created_by)
VALUES (auth.uid());
*/

-- ================================================================
-- POSIBLES PROBLEMAS:
-- ================================================================
-- A. RLS está habilitado pero policy no aplica al role correcto
-- B. Hay una policy RESTRICTIVE bloqueando
-- C. La policy tiene WITH CHECK que falla
-- D. El usuario no tiene GRANT INSERT en la tabla
-- E. La función auth.uid() retorna NULL
-- ================================================================
