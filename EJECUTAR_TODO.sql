-- ============================================
-- EJECUTAR TODO EN SUPABASE - COPIAR Y PEGAR
-- ============================================

-- ============================================
-- PARTE 1: VERIFICAR ESTADO ACTUAL
-- ============================================
-- Primero verifica qué se ejecutó
SELECT 
  id, 
  full_name, 
  email, 
  role,
  is_verified,
  avatar_url
FROM public.users 
WHERE email = 'padeliner@gmail.com';

-- ============================================
-- PARTE 2: USER PRESENCE (ESTADO ONLINE)
-- ============================================

-- Tabla para rastrear presencia de usuarios
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON public.user_presence(last_seen);

-- RLS
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view presence of others" ON public.user_presence;
CREATE POLICY "Users can view presence of others"
  ON public.user_presence
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own presence" ON public.user_presence;
CREATE POLICY "Users can update own presence"
  ON public.user_presence
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Función para actualizar presencia
CREATE OR REPLACE FUNCTION public.update_user_presence(
  p_status TEXT DEFAULT 'online'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, status, last_seen, updated_at)
  VALUES (auth.uid(), p_status, NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    status = EXCLUDED.status,
    last_seen = NOW(),
    updated_at = NOW();
END;
$$;

-- Habilitar Realtime (ignorar si ya existe)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Ya existe, continuar
END $$;

-- ============================================
-- PARTE 3: BADGE VERIFICADO
-- ============================================

-- Columna is_verified
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Índice
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(is_verified);

-- ACTUALIZAR ADMIN
UPDATE public.users
SET 
  is_verified = true,
  full_name = 'Padeliner',
  avatar_url = 'https://htawjnjewvyjkabxmbnu.supabase.co/storage/v1/object/public/avatars/padeliner-official.png',
  role = 'admin'
WHERE id = 'f6802450-c094-491e-8b44-a36ebc795676';

-- Comentario
COMMENT ON COLUMN public.users.is_verified IS 'Badge de verificación oficial de Padeliner (check azul)';

-- ============================================
-- PARTE 4: VERIFICAR QUE TODO FUNCIONÓ
-- ============================================

-- 1. Verificar admin actualizado
SELECT 
  id, 
  full_name, 
  email, 
  role,
  is_verified,
  avatar_url,
  created_at
FROM public.users 
WHERE email = 'padeliner@gmail.com';

-- 2. Verificar tabla user_presence existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_presence'
) as user_presence_table_exists;

-- 3. Verificar columna is_verified existe
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
  AND column_name = 'is_verified'
) as is_verified_column_exists;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- full_name: "Padeliner"
-- is_verified: true
-- avatar_url: https://ui-avatars.com/...
-- role: admin
-- user_presence_table_exists: true
-- is_verified_column_exists: true
-- ============================================
