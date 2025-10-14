-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON blog_comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON blog_comments;

-- Policy: Anyone can view ONLY approved comments
CREATE POLICY "Public can view approved comments"
  ON blog_comments FOR SELECT
  USING (approved = true);

-- Policy: Admins can view ALL comments (approved and pending)
CREATE POLICY "Admins can view all comments"
  ON blog_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Anyone can create comments (authenticated or not)
CREATE POLICY "Anyone can create comments"
  ON blog_comments FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own comments, Admins can update any
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
