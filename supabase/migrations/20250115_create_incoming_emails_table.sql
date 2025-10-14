-- Create incoming_emails table for storing received emails
CREATE TABLE IF NOT EXISTS incoming_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,
  text_content TEXT,
  html_content TEXT,
  raw_email JSONB,
  read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  category TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_incoming_emails_to ON incoming_emails(to_email);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_from ON incoming_emails(from_email);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_read ON incoming_emails(read);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_created ON incoming_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incoming_emails_assigned ON incoming_emails(assigned_to);

-- Enable RLS
ALTER TABLE incoming_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view incoming emails
CREATE POLICY "Admins can view incoming emails"
  ON incoming_emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Only admins can update incoming emails
CREATE POLICY "Admins can update incoming emails"
  ON incoming_emails FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: System can insert incoming emails (via webhook)
CREATE POLICY "System can insert incoming emails"
  ON incoming_emails FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_incoming_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_incoming_emails_timestamp
  BEFORE UPDATE ON incoming_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_incoming_emails_updated_at();

-- Create email_replies table for tracking responses
CREATE TABLE IF NOT EXISTS email_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incoming_email_id UUID NOT NULL REFERENCES incoming_emails(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_replies ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view email replies
CREATE POLICY "Admins can view email replies"
  ON email_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Only admins can insert email replies
CREATE POLICY "Admins can insert email replies"
  ON email_replies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
