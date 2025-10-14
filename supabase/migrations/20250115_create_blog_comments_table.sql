-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX idx_blog_comments_parent ON blog_comments(parent_comment_id);
CREATE INDEX idx_blog_comments_approved ON blog_comments(approved);
CREATE INDEX idx_blog_comments_created ON blog_comments(created_at DESC);

-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view approved comments
CREATE POLICY "Anyone can view approved comments"
  ON blog_comments FOR SELECT
  USING (approved = true);

-- Policy: Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON blog_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL OR auth.uid() IS NULL);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON blog_comments FOR UPDATE
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Admins can delete any comment
CREATE POLICY "Admins can delete comments"
  ON blog_comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_blog_comments_timestamp
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_comments_updated_at();

-- Function to increment comment count on blogs table (optional)
CREATE OR REPLACE FUNCTION increment_blog_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.approved = true THEN
    UPDATE blogs 
    SET comment_count = COALESCE(comment_count, 0) + 1
    WHERE id = NEW.blog_id;
  ELSIF TG_OP = 'DELETE' AND OLD.approved = true THEN
    UPDATE blogs 
    SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
    WHERE id = OLD.blog_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add comment_count column to blogs if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blogs' AND column_name = 'comment_count'
  ) THEN
    ALTER TABLE blogs ADD COLUMN comment_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Trigger to maintain comment count
CREATE TRIGGER maintain_blog_comment_count
  AFTER INSERT OR DELETE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_blog_comment_count();
