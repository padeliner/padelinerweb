-- ================================================================
-- SOLUCIÓN DEFINITIVA: RLS funcionando correctamente
-- ================================================================

-- ================================================================
-- PASO 1: Asegurar permisos de tabla para usuarios autenticados
-- ================================================================
GRANT ALL ON direct_conversations TO authenticated;
GRANT ALL ON direct_conversation_participants TO authenticated;
GRANT ALL ON direct_messages TO authenticated;

-- ================================================================
-- PASO 2: Limpiar policies de INSERT existentes
-- ================================================================
DROP POLICY IF EXISTS "authenticated_users_can_create_conversations" ON direct_conversations;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON direct_conversations;
DROP POLICY IF EXISTS "allow_all_insert" ON direct_conversations;

DROP POLICY IF EXISTS "authenticated_users_can_add_participants" ON direct_conversation_participants;

DROP POLICY IF EXISTS "users_can_send_messages_in_own_conversations" ON direct_messages;

-- ================================================================
-- PASO 3: Crear policies PERMISSIVE simples
-- ================================================================

-- Policy INSERT para conversations (cualquier usuario autenticado puede crear)
CREATE POLICY "insert_conversations_policy"
ON direct_conversations
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy INSERT para participants (cualquiera puede añadir participantes)
CREATE POLICY "insert_participants_policy"
ON direct_conversation_participants
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy INSERT para messages (solo si eres el sender Y participas)
CREATE POLICY "insert_messages_policy"
ON direct_messages
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND is_conversation_participant(conversation_id, auth.uid())
);

-- ================================================================
-- PASO 4: Recrear policies SELECT y UPDATE simplificadas
-- ================================================================

-- SELECT conversations
DROP POLICY IF EXISTS "users_can_view_own_conversations" ON direct_conversations;
CREATE POLICY "select_conversations_policy"
ON direct_conversations
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (is_conversation_participant(id, auth.uid()));

-- SELECT participants
DROP POLICY IF EXISTS "users_can_view_participants_of_own_conversations" ON direct_conversation_participants;
CREATE POLICY "select_participants_policy"
ON direct_conversation_participants
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (is_conversation_participant(conversation_id, auth.uid()));

-- SELECT messages
DROP POLICY IF EXISTS "users_can_view_messages_of_own_conversations" ON direct_messages;
CREATE POLICY "select_messages_policy"
ON direct_messages
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (is_conversation_participant(conversation_id, auth.uid()));

-- UPDATE conversations
DROP POLICY IF EXISTS "users_can_update_own_conversations" ON direct_conversations;
CREATE POLICY "update_conversations_policy"
ON direct_conversations
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (is_conversation_participant(id, auth.uid()));

-- UPDATE participants
DROP POLICY IF EXISTS "users_can_update_own_participation" ON direct_conversation_participants;
CREATE POLICY "update_participants_policy"
ON direct_conversation_participants
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ================================================================
-- PASO 5: Verificar que RLS está habilitado
-- ================================================================
ALTER TABLE direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- PASO 6: Verificar policies creadas
-- ================================================================
SELECT 
    tablename,
    policyname,
    permissive,
    cmd,
    roles
FROM pg_policies
WHERE tablename LIKE 'direct_%'
ORDER BY tablename, cmd, policyname;

-- ================================================================
-- TEST: Probar INSERT manual
-- ================================================================
-- Ejecuta esto después para verificar:
-- INSERT INTO direct_conversations (created_by) VALUES (auth.uid()) RETURNING *;
-- ================================================================
