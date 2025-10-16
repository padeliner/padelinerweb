-- Tabla para rastrear presencia de usuarios (online/offline/última vez)
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para consultas rápidas por estado
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON public.user_presence(last_seen);

-- Habilitar RLS
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Policy: Todos pueden ver la presencia de otros usuarios
CREATE POLICY "Users can view presence of others"
  ON public.user_presence
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Usuarios solo pueden actualizar su propia presencia
CREATE POLICY "Users can update own presence"
  ON public.user_presence
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Función para actualizar presencia automáticamente
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

-- Función para marcar usuarios como offline si no han enviado heartbeat (> 2 minutos)
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

-- Habilitar Realtime para la tabla (para ver cambios en tiempo real)
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- Comentarios
COMMENT ON TABLE public.user_presence IS 'Rastreo de presencia online de usuarios (última vez visto)';
COMMENT ON COLUMN public.user_presence.status IS 'Estado actual: online o offline';
COMMENT ON COLUMN public.user_presence.last_seen IS 'Última vez que el usuario estuvo activo';
COMMENT ON FUNCTION public.update_user_presence IS 'Actualiza la presencia del usuario actual (heartbeat)';
COMMENT ON FUNCTION public.mark_inactive_users_offline IS 'Marca como offline a usuarios sin heartbeat reciente';
