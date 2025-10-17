-- ============================================
-- FIX FINAL: User Presence Automático
-- ============================================
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- PASO 1: Limpiar usuarios offline AHORA
SELECT mark_inactive_users_offline();

-- PASO 2: Modificar función update_user_presence
-- Esta modificación hace que cada vez que alguien hace heartbeat,
-- hay un 10% de probabilidad de limpiar usuarios inactivos

CREATE OR REPLACE FUNCTION public.update_user_presence(p_status text DEFAULT 'online'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Actualizar presencia del usuario actual
  INSERT INTO user_presence (user_id, status, last_seen, updated_at)
  VALUES (auth.uid(), p_status, NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    status = p_status,
    last_seen = NOW(),
    updated_at = NOW();

  -- Cada vez que alguien hace heartbeat, hay 10% chance de limpiar inactivos
  -- Esto asegura que se ejecuta regularmente sin necesidad de cron
  IF random() < 0.1 THEN
    PERFORM mark_inactive_users_offline();
  END IF;
END;
$function$;

-- PASO 3: Verificar que se aplicó correctamente
SELECT 
  proname,
  pg_get_function_arguments(oid) as argumentos,
  CASE 
    WHEN prosrc LIKE '%mark_inactive_users_offline%' THEN '✅ INCLUYE LIMPIEZA AUTOMÁTICA'
    ELSE '❌ NO INCLUYE LIMPIEZA'
  END as estado
FROM pg_proc
WHERE proname = 'update_user_presence'
  AND pronamespace = 'public'::regnamespace;

-- PASO 4: Ver distribución actual de usuarios
SELECT 
  status,
  COUNT(*) as cantidad,
  MAX(updated_at) as ultima_actualizacion
FROM user_presence
GROUP BY status;

-- ============================================
-- ✅ RESULTADO ESPERADO:
-- ============================================
-- Estado: ✅ INCLUYE LIMPIEZA AUTOMÁTICA
-- Cantidad: 
--   - online: 1-5 usuarios (los que están activos ahora)
--   - offline: resto de usuarios
--
-- ✅ A partir de ahora se limpiará automáticamente
-- ✅ No necesitas hacer nada más
-- ✅ Funciona con plan gratis
-- ============================================
