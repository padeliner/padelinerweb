-- ============================================
-- FASE 2 - PARTE 2: REFACTORIZAR POLÍTICAS
-- ============================================
-- Optimizar políticas de: clubs, coaches, content_reports

-- ============================================
-- CLUBS
-- ============================================

-- ELIMINAR política antigua
DROP POLICY IF EXISTS "Admins can manage all clubs" ON clubs;

-- CREAR política optimizada
CREATE POLICY "Admins can manage all clubs"
  ON clubs FOR ALL
  USING (is_admin());

-- ============================================
-- COACHES
-- ============================================

-- ELIMINAR política antigua
DROP POLICY IF EXISTS "Admins can manage all coaches" ON coaches;

-- CREAR política optimizada  
CREATE POLICY "Admins can manage all coaches"
  ON coaches FOR ALL
  USING (is_admin());

-- ============================================
-- CONTENT_REPORTS
-- ============================================

-- ELIMINAR políticas antiguas
DROP POLICY IF EXISTS "Los admins pueden actualizar reportes" ON content_reports;
DROP POLICY IF EXISTS "Los admins pueden ver todos los reportes" ON content_reports;

-- CREAR políticas optimizadas
CREATE POLICY "Los admins pueden actualizar reportes"
  ON content_reports FOR UPDATE
  USING (is_admin());

CREATE POLICY "Los admins pueden ver todos los reportes"
  ON content_reports FOR SELECT
  USING (is_admin());

-- Verificar cambios
SELECT 
  tablename,
  policyname,
  cmd,
  LEFT(qual, 50) as condicion_using
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('clubs', 'coaches', 'content_reports')
  AND policyname LIKE '%admin%'
ORDER BY tablename, policyname;

-- RESULTADO ESPERADO:
-- Todas las políticas ahora usan is_admin()

-- ✅ Progreso: ~15 políticas optimizadas de 60
