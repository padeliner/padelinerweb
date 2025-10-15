-- ================================================================
-- MESSAGING SYSTEM - Complete Database Schema
-- Version: 1.0
-- Description: Professional messaging system with teams, conversations, SLA tracking
-- ================================================================

-- ================================================================
-- 1. TEAMS - Equipos de trabajo
-- ================================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  email TEXT,
  color TEXT DEFAULT '#059669',
  icon TEXT DEFAULT 'mail',
  auto_assign BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear equipos por defecto
INSERT INTO teams (name, slug, description, email, color, icon) VALUES
  ('Soporte', 'support', 'Atención al cliente y soporte técnico', 'soporte@padeliner.com', '#8b5cf6', 'headphones'),
  ('Ventas', 'sales', 'Consultas comerciales y ventas', 'ventas@padeliner.com', '#ec4899', 'shopping-cart'),
  ('Recursos Humanos', 'hr', 'Solicitudes de empleo', 'empleo@padeliner.com', '#14b8a6', 'users'),
  ('General', 'general', 'Consultas generales', 'contact@padeliner.com', '#6b7280', 'mail');

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view teams" ON teams FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can manage teams" ON teams FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ================================================================
-- 2. TEAM MEMBERS - Miembros de equipos
-- ================================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- member, lead, manager
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view team members" ON team_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can manage team members" ON team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ================================================================
-- 3. CONVERSATIONS - Conversaciones agrupadas
-- ================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contacto
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  
  -- Clasificación
  subject TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'general',
  source TEXT DEFAULT 'email',
  
  -- Asignación
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  
  -- Estado
  status TEXT DEFAULT 'new', -- new, open, pending, solved, closed
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Tags
  tags TEXT[] DEFAULT '{}',
  
  -- Métricas
  first_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  first_response_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  
  -- Contadores
  message_count INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_conversations_team ON conversations(team_id);
CREATE INDEX idx_conversations_assigned ON conversations(assigned_to);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_contact ON conversations(contact_email);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_tags ON conversations USING GIN(tags);
CREATE INDEX idx_conversations_priority ON conversations(priority);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all conversations" ON conversations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Team members can view team conversations" ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.user_id = auth.uid() 
      AND team_members.team_id = conversations.team_id
      AND team_members.is_active = true
    )
  );

CREATE POLICY "Users can view assigned conversations" ON conversations FOR SELECT
  USING (assigned_to = auth.uid());

CREATE POLICY "Admins can manage conversations" ON conversations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- ================================================================
-- 4. MESSAGES - Mensajes de conversaciones
-- ================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Remitente/Destinatario
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  cc_emails TEXT[] DEFAULT '{}',
  bcc_emails TEXT[] DEFAULT '{}',
  
  -- Contenido
  subject TEXT,
  content TEXT NOT NULL,
  html_content TEXT,
  
  -- Tipo
  type TEXT DEFAULT 'message', -- message, note, system
  is_internal BOOLEAN DEFAULT false,
  is_from_customer BOOLEAN DEFAULT true,
  
  -- Metadata
  attachments JSONB DEFAULT '[]',
  headers JSONB DEFAULT '{}',
  raw_email JSONB,
  
  -- Estado
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_from ON messages(from_email);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of visible conversations" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id
    )
  );

CREATE POLICY "Admins can manage messages" ON messages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- ================================================================
-- 5. MESSAGE TEMPLATES - Plantillas de respuesta
-- ================================================================
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_team ON message_templates(team_id);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view templates" ON message_templates FOR SELECT
  USING (is_active = true AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can manage templates" ON message_templates FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ================================================================
-- 6. CONVERSATION NOTES - Notas internas
-- ================================================================
CREATE TABLE conversation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_conversation ON conversation_notes(conversation_id);

ALTER TABLE conversation_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view notes" ON conversation_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_notes.conversation_id
    )
  );

CREATE POLICY "Admins can manage notes" ON conversation_notes FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ================================================================
-- 7. CONVERSATION ACTIVITIES - Log de actividad
-- ================================================================
CREATE TABLE conversation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_conversation ON conversation_activities(conversation_id);
CREATE INDEX idx_activities_created ON conversation_activities(created_at DESC);

ALTER TABLE conversation_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view activities" ON conversation_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_activities.conversation_id
    )
  );

CREATE POLICY "System can insert activities" ON conversation_activities FOR INSERT
  WITH CHECK (true);

-- ================================================================
-- 8. SAVED REPLIES - Respuestas rápidas (snippets)
-- ================================================================
CREATE TABLE saved_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shortcut TEXT NOT NULL,
  content TEXT NOT NULL,
  is_global BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shortcut)
);

CREATE INDEX idx_saved_replies_user ON saved_replies(user_id);

ALTER TABLE saved_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their snippets" ON saved_replies FOR SELECT
  USING (user_id = auth.uid() OR is_global = true);

CREATE POLICY "Users can manage their snippets" ON saved_replies FOR ALL
  USING (user_id = auth.uid());

-- ================================================================
-- 9. SLA RULES - Service Level Agreements
-- ================================================================
CREATE TABLE sla_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  priority TEXT,
  first_response_minutes INTEGER,
  resolution_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SLA por defecto
INSERT INTO sla_rules (name, team_id, priority, first_response_minutes, resolution_minutes) VALUES
  ('SLA Soporte Urgente', (SELECT id FROM teams WHERE slug = 'support'), 'urgent', 30, 240),
  ('SLA Soporte Normal', (SELECT id FROM teams WHERE slug = 'support'), 'normal', 120, 1440),
  ('SLA Ventas', (SELECT id FROM teams WHERE slug = 'sales'), NULL, 60, 480);

ALTER TABLE sla_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view SLA rules" ON sla_rules FOR SELECT
  USING (is_active = true AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can manage SLA rules" ON sla_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ================================================================
-- 10. CONVERSATION SLA STATUS - Estado SLA por conversación
-- ================================================================
CREATE TABLE conversation_sla_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sla_rule_id UUID REFERENCES sla_rules(id) ON DELETE SET NULL,
  first_response_due_at TIMESTAMPTZ,
  first_response_breached BOOLEAN DEFAULT false,
  resolution_due_at TIMESTAMPTZ,
  resolution_breached BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id)
);

CREATE INDEX idx_sla_status_conversation ON conversation_sla_status(conversation_id);

ALTER TABLE conversation_sla_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view SLA status" ON conversation_sla_status FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_sla_status.conversation_id
    )
  );

-- ================================================================
-- FUNCTIONS - Funciones auxiliares
-- ================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para conversations
CREATE TRIGGER conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Función para crear actividad automática
CREATE OR REPLACE FUNCTION log_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log status change
    IF OLD.status != NEW.status THEN
      INSERT INTO conversation_activities (conversation_id, user_id, action, details)
      VALUES (NEW.id, auth.uid(), 'status_changed', json_build_object('from', OLD.status, 'to', NEW.status)::jsonb);
    END IF;
    
    -- Log assignment change
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO conversation_activities (conversation_id, user_id, action, details)
      VALUES (NEW.id, auth.uid(), 'assigned', json_build_object('to', NEW.assigned_to)::jsonb);
    END IF;
    
    -- Log priority change
    IF OLD.priority != NEW.priority THEN
      INSERT INTO conversation_activities (conversation_id, user_id, action, details)
      VALUES (NEW.id, auth.uid(), 'priority_changed', json_build_object('from', OLD.priority, 'to', NEW.priority)::jsonb);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_conversation_changes
AFTER UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION log_conversation_activity();

-- Función para actualizar contadores de conversación
CREATE OR REPLACE FUNCTION update_conversation_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE conversations
    SET 
      message_count = message_count + 1,
      last_message_at = NEW.created_at,
      unread_count = CASE 
        WHEN NEW.is_from_customer THEN unread_count + 1 
        ELSE unread_count 
      END,
      first_response_at = CASE
        WHEN first_response_at IS NULL AND NOT NEW.is_from_customer THEN NEW.created_at
        ELSE first_response_at
      END
    WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_counters();

-- ================================================================
-- VIEWS - Vistas útiles
-- ================================================================

-- Vista para estadísticas de conversaciones
CREATE OR REPLACE VIEW conversation_stats AS
SELECT 
  c.id,
  c.status,
  c.priority,
  c.team_id,
  c.assigned_to,
  c.message_count,
  c.unread_count,
  c.first_message_at,
  c.last_message_at,
  c.first_response_at,
  c.closed_at,
  EXTRACT(EPOCH FROM (c.first_response_at - c.first_message_at))/60 as first_response_minutes,
  EXTRACT(EPOCH FROM (c.closed_at - c.first_message_at))/60 as resolution_minutes,
  CASE 
    WHEN s.first_response_breached THEN 'breached'
    WHEN c.first_response_at IS NULL AND NOW() > s.first_response_due_at THEN 'at_risk'
    ELSE 'on_track'
  END as sla_status
FROM conversations c
LEFT JOIN conversation_sla_status s ON c.id = s.conversation_id;

-- ================================================================
-- INITIAL DATA - Datos iniciales
-- ================================================================

-- Plantillas de respuesta por defecto
INSERT INTO message_templates (name, subject, content, team_id) VALUES
  (
    'Bienvenida', 
    'Gracias por contactarnos',
    'Hola {{nombre}},\n\nGracias por contactar con Padeliner. Hemos recibido tu mensaje y te responderemos lo antes posible.\n\n¡Saludos!\nEquipo Padeliner',
    (SELECT id FROM teams WHERE slug = 'general')
  ),
  (
    'Resolución exitosa',
    'Problema resuelto',
    'Hola {{nombre}},\n\nNos alegra informarte que hemos resuelto tu consulta. Si tienes alguna otra pregunta, no dudes en contactarnos.\n\n¡Saludos!\nEquipo Padeliner',
    (SELECT id FROM teams WHERE slug = 'support')
  );

-- ================================================================
-- GRANTS - Permisos
-- ================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ================================================================
-- COMPLETION
-- ================================================================

-- Índice de búsqueda full-text para conversaciones
CREATE INDEX idx_conversations_search ON conversations 
USING gin(to_tsvector('spanish', coalesce(subject, '') || ' ' || coalesce(contact_name, '') || ' ' || coalesce(contact_email, '')));

COMMENT ON TABLE conversations IS 'Main table for customer conversations - grouped email threads';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON TABLE teams IS 'Support teams for routing and assignment';
COMMENT ON TABLE conversation_notes IS 'Internal notes visible only to team members';
