-- ================================================================
-- LIMPIAR SISTEMA DE CHAT DIRECTO ANTES DE RECREARLO
-- Ejecuta este script PRIMERO, luego ejecuta 20250115_create_direct_messaging.sql
-- ================================================================

-- Deshabilitar RLS primero
ALTER TABLE IF EXISTS direct_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS direct_conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS direct_messages DISABLE ROW LEVEL SECURITY;

-- Eliminar policies (todas las versiones)
DROP POLICY IF EXISTS "authenticated_users_can_create_conversations" ON direct_conversations;
DROP POLICY IF EXISTS "users_can_view_own_conversations" ON direct_conversations;
DROP POLICY IF EXISTS "users_can_update_own_conversations" ON direct_conversations;
DROP POLICY IF EXISTS "insert_conversations_policy" ON direct_conversations;
DROP POLICY IF EXISTS "select_conversations_policy" ON direct_conversations;
DROP POLICY IF EXISTS "update_conversations_policy" ON direct_conversations;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON direct_conversations;
DROP POLICY IF EXISTS "allow_all_insert" ON direct_conversations;

DROP POLICY IF EXISTS "authenticated_users_can_add_participants" ON direct_conversation_participants;
DROP POLICY IF EXISTS "users_can_view_participants_of_own_conversations" ON direct_conversation_participants;
DROP POLICY IF EXISTS "users_can_update_own_participation" ON direct_conversation_participants;
DROP POLICY IF EXISTS "insert_participants_policy" ON direct_conversation_participants;
DROP POLICY IF EXISTS "select_participants_policy" ON direct_conversation_participants;
DROP POLICY IF EXISTS "update_participants_policy" ON direct_conversation_participants;

DROP POLICY IF EXISTS "users_can_view_messages_of_own_conversations" ON direct_messages;
DROP POLICY IF EXISTS "users_can_send_messages_in_own_conversations" ON direct_messages;
DROP POLICY IF EXISTS "insert_messages_policy" ON direct_messages;
DROP POLICY IF EXISTS "select_messages_policy" ON direct_messages;

-- Eliminar triggers
DROP TRIGGER IF EXISTS update_conversation_on_message ON direct_messages;

-- Eliminar funciones
DROP FUNCTION IF EXISTS update_direct_conversation_timestamp();
DROP FUNCTION IF EXISTS find_direct_conversation(UUID, UUID);
DROP FUNCTION IF EXISTS is_conversation_participant(UUID, UUID);

-- Eliminar tablas (en orden inverso por las foreign keys)
DROP TABLE IF EXISTS direct_messages CASCADE;
DROP TABLE IF EXISTS direct_conversation_participants CASCADE;
DROP TABLE IF EXISTS direct_conversations CASCADE;
