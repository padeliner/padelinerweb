-- ================================================================
-- HABILITAR RLS EN SISTEMA DE CHAT DIRECTO
-- Usando SECURITY DEFINER functions para evitar recursión
-- ================================================================

-- ================================================================
-- 1. FUNCIONES HELPER CON SECURITY DEFINER (bypassean RLS)
-- ================================================================

-- Función para verificar si un usuario es participante de una conversación
CREATE OR REPLACE FUNCTION is_conversation_participant(conversation_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM direct_conversation_participants
    WHERE conversation_id = conversation_uuid 
    AND user_id = user_uuid
  );
$$;

-- ================================================================
-- 2. HABILITAR ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 3. POLICIES PARA CONVERSATIONS
-- ================================================================

-- Cualquier usuario autenticado puede crear conversaciones
CREATE POLICY "authenticated_users_can_create_conversations" 
ON direct_conversations
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Solo puedes ver conversaciones donde eres participante (usando función SECURITY DEFINER)
CREATE POLICY "users_can_view_own_conversations" 
ON direct_conversations
FOR SELECT 
TO authenticated
USING (is_conversation_participant(id, auth.uid()));

-- Solo puedes actualizar conversaciones donde eres participante
CREATE POLICY "users_can_update_own_conversations" 
ON direct_conversations
FOR UPDATE 
TO authenticated
USING (is_conversation_participant(id, auth.uid()));

-- ================================================================
-- 4. POLICIES PARA PARTICIPANTS
-- ================================================================

-- Cualquiera puede añadir participantes (para crear chat con otro usuario)
CREATE POLICY "authenticated_users_can_add_participants" 
ON direct_conversation_participants
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Solo puedes ver participantes de tus conversaciones (usando función SECURITY DEFINER)
CREATE POLICY "users_can_view_participants_of_own_conversations" 
ON direct_conversation_participants
FOR SELECT 
TO authenticated
USING (is_conversation_participant(conversation_id, auth.uid()));

-- Solo puedes actualizar tu propia participación (ej: last_read_at)
CREATE POLICY "users_can_update_own_participation" 
ON direct_conversation_participants
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ================================================================
-- 5. POLICIES PARA MESSAGES
-- ================================================================

-- Solo puedes ver mensajes de conversaciones donde participas (usando función SECURITY DEFINER)
CREATE POLICY "users_can_view_messages_of_own_conversations" 
ON direct_messages
FOR SELECT 
TO authenticated
USING (is_conversation_participant(conversation_id, auth.uid()));

-- Solo puedes enviar mensajes como tú mismo y en conversaciones donde participas
CREATE POLICY "users_can_send_messages_in_own_conversations" 
ON direct_messages
FOR INSERT 
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND is_conversation_participant(conversation_id, auth.uid())
);

-- ================================================================
-- RESUMEN DE SEGURIDAD:
-- ================================================================
-- ✅ Cualquier usuario puede iniciar chat con otro usuario
-- ✅ Solo ves conversaciones donde participas
-- ✅ Solo ves mensajes de tus conversaciones
-- ✅ Solo envías mensajes como tú mismo
-- ✅ Solo envías mensajes en tus conversaciones
-- ✅ Sin recursión infinita (usando SECURITY DEFINER function)
-- ✅ La función is_conversation_participant() bypasea RLS
-- ================================================================
