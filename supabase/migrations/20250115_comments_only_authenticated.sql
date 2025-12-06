-- Update policy: Only authenticated users can create comments
DROP POLICY IF EXISTS "Anyone can create comments" ON blog_comments;

CREATE POLICY "Only authenticated users can create comments"
  ON blog_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
