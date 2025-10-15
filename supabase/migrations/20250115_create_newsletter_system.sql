-- ================================================================
-- NEWSLETTER SYSTEM - Database Schema
-- Description: Sistema de newsletter con suscriptores y campañas
-- ================================================================

-- ================================================================
-- 1. NEWSLETTER SUBSCRIBERS - Suscriptores
-- ================================================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT DEFAULT 'website', -- website, landing, popup, etc
  tags TEXT[], -- Etiquetas para segmentación
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Si está registrado
  ip_address TEXT,
  user_agent TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  confirmed BOOLEAN DEFAULT false,
  confirmation_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at);

-- ================================================================
-- 2. NEWSLETTER CAMPAIGNS - Campañas de email
-- ================================================================
CREATE TABLE newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT, -- Texto de preview
  content_html TEXT NOT NULL,
  content_text TEXT, -- Versión texto plano
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  
  -- Segmentación
  target_tags TEXT[], -- Enviar solo a suscriptores con estos tags
  target_all BOOLEAN DEFAULT true, -- Enviar a todos los activos
  
  -- Estadísticas
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  
  -- Fechas
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX idx_campaigns_created_at ON newsletter_campaigns(created_at);

-- ================================================================
-- 3. NEWSLETTER SENDS - Registro de envíos individuales
-- ================================================================
CREATE TABLE newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sends_campaign ON newsletter_sends(campaign_id);
CREATE INDEX idx_sends_subscriber ON newsletter_sends(subscriber_id);
CREATE INDEX idx_sends_status ON newsletter_sends(status);

-- ================================================================
-- 4. ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Policy: Cualquiera puede suscribirse (INSERT público)
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Solo admins pueden ver suscriptores
CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Solo admins pueden actualizar suscriptores
CREATE POLICY "Admins can update subscribers" ON newsletter_subscribers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Usuarios pueden darse de baja con su email
CREATE POLICY "Users can unsubscribe themselves" ON newsletter_subscribers
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Solo admins pueden gestionar campañas
CREATE POLICY "Admins can manage campaigns" ON newsletter_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Solo admins pueden ver envíos
CREATE POLICY "Admins can view sends" ON newsletter_sends
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ================================================================
-- 5. TRIGGERS - Actualizar updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_campaigns_updated_at
  BEFORE UPDATE ON newsletter_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
