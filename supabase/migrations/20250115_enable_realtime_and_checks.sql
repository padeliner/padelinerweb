-- ================================================================
-- HABILITAR REALTIME + AÑADIR COLUMNAS PARA CHECKS DE WHATSAPP
-- ================================================================

-- ================================================================
-- 1. HABILITAR REALTIME EN LAS TABLAS
-- ================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE direct_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;

-- ================================================================
-- 2. AÑADIR COLUMNAS PARA CHECKS DE WHATSAPP
-- ================================================================

-- Añadir columnas de estado a direct_messages
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- ================================================================
-- 3. CREAR TABLA PARA INDICADOR DE "ESCRIBIENDO..."
-- ================================================================
CREATE TABLE IF NOT EXISTS direct_typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES direct_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  is_typing BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_typing_conversation ON direct_typing_indicators(conversation_id);
CREATE INDEX IF NOT EXISTS idx_typing_updated_at ON direct_typing_indicators(updated_at);

-- Habilitar Realtime en typing_indicators
ALTER PUBLICATION supabase_realtime ADD TABLE direct_typing_indicators;

-- ================================================================
-- 4. FUNCIÓN PARA AUTO-LIMPIAR TYPING INDICATORS ANTIGUOS
-- ================================================================
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Eliminar indicadores más antiguos de 10 segundos
  DELETE FROM direct_typing_indicators
  WHERE updated_at < NOW() - INTERVAL '10 seconds';
END;
$$;

-- ================================================================
-- 5. COMENTARIOS
-- ================================================================
COMMENT ON COLUMN direct_messages.delivered_at IS 'Timestamp cuando el mensaje fue entregado al destinatario';
COMMENT ON COLUMN direct_messages.read_at IS 'Timestamp cuando el mensaje fue leído';
COMMENT ON TABLE direct_typing_indicators IS 'Indica cuando un usuario está escribiendo en una conversación';
