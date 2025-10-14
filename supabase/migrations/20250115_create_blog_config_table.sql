-- Create blog_config table for auto-generation settings
CREATE TABLE IF NOT EXISTS blog_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auto_generate_enabled BOOLEAN DEFAULT false,
  last_auto_generation TIMESTAMPTZ,
  total_auto_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO blog_config (auto_generate_enabled) 
VALUES (false)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE blog_config ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view and update config
CREATE POLICY "Admins can manage blog config"
  ON blog_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_blog_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_blog_config_timestamp
  BEFORE UPDATE ON blog_config
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_config_updated_at();
