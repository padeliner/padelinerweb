-- ================================================================
-- CONFIGURAR REPLICA IDENTITY PARA REALTIME UPDATES
-- ================================================================
-- Esto asegura que Realtime envíe TODOS los campos en eventos UPDATE,
-- no solo la clave primaria

-- Configurar REPLICA IDENTITY FULL en direct_messages
-- Esto permite que Supabase Realtime envíe el row completo en UPDATEs
ALTER TABLE direct_messages REPLICA IDENTITY FULL;

-- También en las otras tablas por si acaso
ALTER TABLE direct_conversations REPLICA IDENTITY FULL;
ALTER TABLE direct_conversation_participants REPLICA IDENTITY FULL;
ALTER TABLE direct_typing_indicators REPLICA IDENTITY FULL;

-- Verificar que las publicaciones estén correctas
-- (Esto es solo informativo, no ejecuta nada)
-- SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

COMMENT ON TABLE direct_messages IS 'Mensajes directos - REPLICA IDENTITY FULL para Realtime';
