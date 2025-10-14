-- Add image attribution fields for Unsplash compliance

ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_photographer TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_photographer_url TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_unsplash_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN blogs.image_photographer IS 'Photographer name from Unsplash';
COMMENT ON COLUMN blogs.image_photographer_url IS 'Photographer profile URL on Unsplash';
COMMENT ON COLUMN blogs.image_unsplash_url IS 'Photo URL on Unsplash (for direct linking)';
