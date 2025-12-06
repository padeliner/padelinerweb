-- ============================================
-- MIGRACIÓN COMPLETA: Admin Verificado + Presencia Online
-- ============================================

-- ============================================
-- PARTE 1: USER PRESENCE (Estado Online)
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

-- Función para actualizar presencia (heartbeat)
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

-- Función para marcar inactivos como offline
CREATE OR REPLACE FUNCTION public.mark_inactive_users_offline()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_presence
  SET 
    status = 'offline',
    updated_at = NOW()
  WHERE 
    status = 'online'
    AND last_seen < NOW() - INTERVAL '2 minutes';
END;
$$;

-- Habilitar Realtime (ignorar si ya existe)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Comentarios
COMMENT ON TABLE public.user_presence IS 'Rastreo de presencia online de usuarios (última vez visto)';
COMMENT ON FUNCTION public.update_user_presence IS 'Actualiza la presencia del usuario actual (heartbeat)';

-- ============================================
-- PARTE 2: BADGE DE VERIFICACIÓN
-- ============================================

-- Columna is_verified
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Índice
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(is_verified);

-- Actualizar admin Padeliner
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
-- PARTE 3: RLS POLICY PARA CHAT
-- ============================================

-- Policy: Solo puedes ver usuarios con los que tienes conversaciones
DROP POLICY IF EXISTS "Users can view conversation participants" ON public.users;
CREATE POLICY "Users can view conversation participants"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    -- Puedes ver tu propio perfil
    auth.uid() = id
    OR
    -- O puedes ver usuarios con los que compartes una conversación
    EXISTS (
      SELECT 1 
      FROM direct_conversation_participants dcp1
      INNER JOIN direct_conversation_participants dcp2 
        ON dcp1.conversation_id = dcp2.conversation_id
      WHERE dcp1.user_id = auth.uid()
        AND dcp2.user_id = users.id
    )
  );

COMMENT ON POLICY "Users can view conversation participants" ON public.users IS 
  'Permite ver solo a usuarios con los que compartes conversaciones activas';

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar admin actualizado
SELECT 
  'Admin Padeliner' as verificacion,
  id, 
  full_name, 
  email, 
  role,
  is_verified,
  avatar_url
FROM public.users 
WHERE email = 'padeliner@gmail.com';

-- Verificar tabla user_presence
SELECT 
  'Tabla user_presence' as verificacion,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_presence'
  ) as existe;

-- Verificar columna is_verified
SELECT 
  'Columna is_verified' as verificacion,
  EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
    AND column_name = 'is_verified'
  ) as existe;

-- Verificar policies
SELECT 
  'Policies creadas' as verificacion,
  COUNT(*) as total
FROM pg_policies
WHERE tablename IN ('users', 'user_presence')
  AND policyname IN (
    'Users can view presence of others',
    'Users can update own presence',
    'Users can view conversation participants'
  );
