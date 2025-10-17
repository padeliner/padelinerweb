-- ============================================
-- PASO 1: CREAR FUNCIÓN HELPER is_admin()
-- ============================================
-- Esta función optimizará 60+ políticas RLS

-- Crear la función
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  );
$$;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- Verificar que se creó correctamente
SELECT 
  p.proname as nombre_funcion,
  pg_get_function_result(p.oid) as retorna,
  l.lanname as lenguaje,
  CASE p.provolatile
    WHEN 'i' THEN 'IMMUTABLE'
    WHEN 's' THEN 'STABLE'
    WHEN 'v' THEN 'VOLATILE'
  END AS volatilidad
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_language l ON p.prolang = l.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'is_admin';

-- RESULTADO ESPERADO:
-- nombre_funcion: is_admin
-- retorna: boolean
-- lenguaje: sql
-- volatilidad: STABLE

-- ✅ Si ves este resultado, la función está lista para usar
