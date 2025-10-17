-- ============================================
-- SOLUCIÓN: User Presence - Usuarios siempre online
-- ============================================
-- PROBLEMA: Los usuarios aparecen siempre online
-- CAUSA: La función mark_inactive_users_offline no se ejecuta automáticamente
-- ============================================

-- PASO 1: EJECUTAR MANUALMENTE para limpiar usuarios offline ahora
SELECT mark_inactive_users_offline();

-- Verificar resultado
SELECT 
  status,
  COUNT(*) as cantidad
FROM user_presence
GROUP BY status;

-- Deberías ver usuarios con status='offline' ahora

-- ============================================
-- PASO 2: SOLUCIÓN PERMANENTE - Opción A
-- ============================================
-- Crear Edge Function que ejecute esto cada minuto
-- (Necesitas crear esto en Supabase Dashboard → Edge Functions)

/*
// Archivo: supabase/functions/cleanup-presence/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { error } = await supabase.rpc('mark_inactive_users_offline')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

// Luego configurar cron en Dashboard:
// Supabase Dashboard → Edge Functions → cleanup-presence → Cron Jobs
// Schedule: "* * * * *" (cada minuto)
*/

-- ============================================
-- PASO 3: SOLUCIÓN PERMANENTE - Opción B (Más simple)
-- ============================================
-- Usar pg_cron si tienes acceso (solo si tienes plan Pro o superior)

-- Verificar si pg_cron está disponible
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'pg_cron';

-- Si existe, crear job (ejecutar solo si pg_cron está disponible)
/*
SELECT cron.schedule(
  'cleanup-inactive-users',
  '* * * * *', -- Cada minuto
  'SELECT mark_inactive_users_offline();'
);
*/

-- ============================================
-- PASO 4: ALTERNATIVA TEMPORAL (Sin cron)
-- ============================================
-- Modificar la función mark_inactive_users_offline para que se llame
-- automáticamente cuando un usuario hace heartbeat

-- Primero, ver la función actual
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'update_user_presence';

-- Modificar update_user_presence para que también limpie usuarios inactivos
CREATE OR REPLACE FUNCTION public.update_user_presence(p_status text DEFAULT 'online'::text)
RETURNS void
LANGUAGE plpgsql
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

  -- Cada vez que alguien hace heartbeat, limpiar usuarios inactivos
  -- Solo hacerlo el 10% de las veces para no sobrecargar
  IF random() < 0.1 THEN
    PERFORM mark_inactive_users_offline();
  END IF;
END;
$function$;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Ver distribución de status
SELECT 
  status,
  COUNT(*) as usuarios,
  MAX(updated_at) as ultima_actualizacion
FROM user_presence
GROUP BY status;

-- Ver usuarios específicos
SELECT 
  up.user_id,
  u.full_name,
  up.status,
  up.last_seen,
  NOW() - up.updated_at as inactivo_por
FROM user_presence up
LEFT JOIN users u ON u.id = up.user_id
ORDER BY up.updated_at DESC
LIMIT 20;

-- ============================================
-- RESUMEN DE SOLUCIONES
-- ============================================
/*
SOLUCIÓN INMEDIATA (hacer ahora):
✅ Ejecutar: SELECT mark_inactive_users_offline();

SOLUCIÓN PERMANENTE (elegir una):

Opción A - Edge Function + Cron (Recomendado)
✅ Crear Edge Function en Dashboard
✅ Configurar cron cada minuto
✅ Más control, más escalable

Opción B - pg_cron (Si tienes plan Pro)
✅ Usar pg_cron nativo de PostgreSQL
✅ Más eficiente, menos overhead

Opción C - Modificar update_user_presence (Temporal)
✅ Ejecutar limpieza aleatoriamente en heartbeats
✅ No requiere cron
⚠️  Menos predecible, puede tener lag

RECOMENDACIÓN:
1. Ahora: Ejecutar mark_inactive_users_offline() manualmente
2. Permanente: Implementar Opción C (más simple y no requiere config extra)
*/
