-- Añadir columna is_verified a la tabla users
-- Para marcar usuarios oficiales de Padeliner (check azul como WhatsApp)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Crear índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(is_verified);

-- Marcar al usuario admin de Padeliner como verificado
UPDATE public.users
SET 
  is_verified = true,
  full_name = 'Padeliner',
  avatar_url = 'https://your-supabase-project.supabase.co/storage/v1/object/public/avatars/padeliner-official.png'
WHERE id = 'f6802450-c094-491e-8b44-a36ebc795676';

-- Policy: Todos pueden ver is_verified
-- No se necesita policy adicional, ya está cubierto por las policies existentes de users

-- Comentarios
COMMENT ON COLUMN public.users.is_verified IS 'Badge de verificación oficial de Padeliner (check azul)';
