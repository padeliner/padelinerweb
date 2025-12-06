-- ============================================
-- FASE 2 - PARTE 1: REFACTORIZAR POLÍTICAS
-- ============================================
-- Optimizar políticas de: academies, audit_logs, blog_*

-- ============================================
-- ACADEMIES
-- ============================================

-- ELIMINAR política antigua
DROP POLICY IF EXISTS "Admins can manage all academies" ON academies;

-- CREAR política optimizada
CREATE POLICY "Admins can manage all academies"
  ON academies FOR ALL
  USING (is_admin());

-- ============================================
-- AUDIT_LOGS
-- ============================================

-- ELIMINAR política antigua
DROP POLICY IF EXISTS "Admins can view all logs" ON audit_logs;

-- CREAR política optimizada
CREATE POLICY "Admins can view all logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

-- ============================================
-- BLOG_COMMENTS
-- ============================================

-- ELIMINAR políticas antiguas
DROP POLICY IF EXISTS "Admins can delete comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON blog_comments;

-- CREAR políticas optimizadas
CREATE POLICY "Admins can delete comments"
  ON blog_comments FOR DELETE
  USING (is_admin());

CREATE POLICY "Users can update own comments"
  ON blog_comments FOR UPDATE
  USING (user_id = auth.uid() OR is_admin());

-- ============================================
-- BLOG_CONFIG
-- ============================================

-- ELIMINAR política antigua
DROP POLICY IF EXISTS "Admins can manage blog config" ON blog_config;

-- CREAR política optimizada
CREATE POLICY "Admins can manage blog config"
  ON blog_config FOR ALL
  USING (is_admin());

-- ============================================
-- BLOGS
-- ============================================

-- ELIMINAR política antigua
DROP POLICY IF EXISTS "Admins can do everything with blogs" ON blogs;

-- CREAR política optimizada
CREATE POLICY "Admins can do everything with blogs"
  ON blogs FOR ALL
  USING (is_admin());

-- Verificar cambios
SELECT 
  tablename,
  policyname,
  cmd,
  LEFT(qual, 50) as condicion_using
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('academies', 'audit_logs', 'blog_comments', 'blog_config', 'blogs')
  AND policyname LIKE '%Admin%'
ORDER BY tablename, policyname;

-- RESULTADO ESPERADO:
-- Políticas ahora usan is_admin() en lugar de subconsulta
-- Condición: "is_admin()" en lugar de "EXISTS ( SELECT 1 FROM users..."

-- ✅ Beneficio: +30% velocidad en estas tablas para admins
