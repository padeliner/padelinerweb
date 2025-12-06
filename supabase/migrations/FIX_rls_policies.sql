-- ================================================================
-- FIX: Políticas RLS más permisivas para debugging
-- ================================================================

-- Eliminar policies existentes
DROP POLICY IF EXISTS "authenticated_users_can_create_conversations" ON direct_conversations;
DROP POLICY IF EXISTS "users_can_view_own_conversations" ON direct_conversations;
DROP POLICY IF EXISTS "users_can_update_own_conversations" ON direct_conversations;

-- Recrear policy de INSERT más permisiva
CREATE POLICY "allow_insert_conversations" 
ON direct_conversations
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Recrear policy de SELECT
CREATE POLICY "allow_select_own_conversations" 
ON direct_conversations
FOR SELECT 
USING (is_conversation_participant(id, auth.uid()));

-- Recrear policy de UPDATE
CREATE POLICY "allow_update_own_conversations" 
ON direct_conversations
FOR UPDATE 
USING (is_conversation_participant(id, auth.uid()));

-- Verificar que RLS está habilitado
ALTER TABLE direct_conversations ENABLE ROW LEVEL SECURITY;

-- Mostrar policies creadas
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'direct_conversations'
ORDER BY policyname;
