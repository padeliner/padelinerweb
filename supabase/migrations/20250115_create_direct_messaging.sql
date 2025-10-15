-- ================================================================
-- SISTEMA DE CHAT DIRECTO USUARIO-A-USUARIO
-- Para chat entre entrenadores y usuarios
-- ================================================================

-- ================================================================
-- 1. DIRECT CONVERSATIONS - Conversaciones directas entre usuarios
-- ================================================================
CREATE TABLE IF NOT EXISTS direct_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 2. DIRECT CONVERSATION PARTICIPANTS - Participantes
-- ================================================================
CREATE TABLE IF NOT EXISTS direct_conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES direct_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

-- ================================================================
-- 3. DIRECT MESSAGES - Mensajes del chat
-- ================================================================
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES direct_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 4. INDICES para rendimiento
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_direct_conversations_created_by ON direct_conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_direct_conversations_updated_at ON direct_conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_direct_participants_conversation ON direct_conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_direct_participants_user ON direct_conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation ON direct_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at DESC);

-- ================================================================
-- 5. ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Policies para conversations: solo participantes pueden ver
CREATE POLICY "Users can view their conversations" ON direct_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM direct_conversation_participants
      WHERE direct_conversation_participants.conversation_id = direct_conversations.id
      AND direct_conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations" ON direct_conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Policies para participants: solo participantes
CREATE POLICY "Users can view conversation participants" ON direct_conversation_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM direct_conversation_participants dcp
      WHERE dcp.conversation_id = direct_conversation_participants.conversation_id
      AND dcp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join conversations" ON direct_conversation_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their participation" ON direct_conversation_participants
  FOR UPDATE USING (user_id = auth.uid());

-- Policies para messages: solo participantes pueden ver/enviar
CREATE POLICY "Participants can view messages" ON direct_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM direct_conversation_participants
      WHERE direct_conversation_participants.conversation_id = direct_messages.conversation_id
      AND direct_conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages" ON direct_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM direct_conversation_participants
      WHERE direct_conversation_participants.conversation_id = direct_messages.conversation_id
      AND direct_conversation_participants.user_id = auth.uid()
    )
  );

-- ================================================================
-- 6. TRIGGER para actualizar updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_direct_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE direct_conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_direct_conversation_timestamp();

-- ================================================================
-- 7. FUNCIÓN helper para buscar conversación entre 2 usuarios
-- ================================================================
CREATE OR REPLACE FUNCTION find_direct_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  SELECT dc.id INTO conversation_id
  FROM direct_conversations dc
  WHERE EXISTS (
    SELECT 1 FROM direct_conversation_participants
    WHERE conversation_id = dc.id AND user_id = user1_id
  )
  AND EXISTS (
    SELECT 1 FROM direct_conversation_participants
    WHERE conversation_id = dc.id AND user_id = user2_id
  )
  LIMIT 1;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;
