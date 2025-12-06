-- ================================================================
-- TEST: Verificar si authenticated puede hacer INSERT
-- Este script simula lo que hace la API
-- ================================================================

-- Ver los GRANTS actuales
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_name = 'direct_conversations'
AND grantee IN ('authenticated', 'anon', 'public')
ORDER BY grantee, privilege_type;

-- Ver si la función is_conversation_participant existe
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_name = 'is_conversation_participant';

-- Probar WITH CHECK de la policy manualmente
-- (esto siempre será true desde postgres, pero muestra la lógica)
SELECT 
    polname as policy_name,
    pg_get_expr(polwithcheck, polrelid) as with_check_expression,
    polpermissive as is_permissive,
    polroles::regrole[] as applies_to_roles
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'direct_conversations'
AND polcmd = 'a';  -- INSERT
