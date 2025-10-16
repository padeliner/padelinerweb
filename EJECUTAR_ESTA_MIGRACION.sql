-- ============================================
-- EJECUTAR ESTA MIGRACIÓN EN SUPABASE
-- ============================================
-- Ve a: Supabase Dashboard → SQL Editor
-- Copia y pega TODO este archivo
-- Click en "RUN" para ejecutar
-- ============================================

-- 1. Añadir columna is_verified a la tabla users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 2. Crear índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(is_verified);

-- 3. IMPORTANTE: Actualizar datos del admin Padeliner
UPDATE public.users
SET 
  is_verified = true,
  full_name = 'Padeliner',
  avatar_url = 'https://ui-avatars.com/api/?name=Padeliner&background=10b981&color=fff&size=200'
WHERE id = 'f6802450-c094-491e-8b44-a36ebc795676';

-- 4. Comentarios
COMMENT ON COLUMN public.users.is_verified IS 'Badge de verificación oficial de Padeliner (check azul)';

-- ============================================
-- VERIFICAR QUE FUNCIONÓ
-- ============================================
-- Ejecuta esta query después de la migración:
-- SELECT id, full_name, email, is_verified, avatar_url 
-- FROM public.users 
-- WHERE id = 'f6802450-c094-491e-8b44-a36ebc795676';
-- 
-- Deberías ver:
-- - full_name: "Padeliner"
-- - is_verified: true
-- - avatar_url: la URL del avatar
-- ============================================
