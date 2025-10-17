-- ============================================
-- FASE 2 - PARTE 3: REFACTORIZAR POLÍTICAS
-- ============================================
-- Optimizar políticas de: conversations, email_*, moderation

-- ============================================
-- CONVERSATION_NOTES
-- ============================================

DROP POLICY IF EXISTS "Admins can manage notes" ON conversation_notes;

CREATE POLICY "Admins can manage notes"
  ON conversation_notes FOR ALL
  USING (is_admin());

-- ============================================
-- CONVERSATIONS
-- ============================================

DROP POLICY IF EXISTS "Admins can manage conversations" ON conversations;

CREATE POLICY "Admins can manage conversations"
  ON conversations FOR ALL
  USING (is_admin());

-- ============================================
-- EMAIL_REPLIES
-- ============================================

DROP POLICY IF EXISTS "Admins can insert email replies" ON email_replies;
DROP POLICY IF EXISTS "Admins can view email replies" ON email_replies;

CREATE POLICY "Admins can insert email replies"
  ON email_replies FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can view email replies"
  ON email_replies FOR SELECT
  USING (is_admin());

-- ============================================
-- EMAIL_TEMPLATES
-- ============================================

DROP POLICY IF EXISTS "Los admins pueden actualizar plantillas" ON email_templates;
DROP POLICY IF EXISTS "Los admins pueden crear plantillas" ON email_templates;
DROP POLICY IF EXISTS "Los admins pueden eliminar plantillas" ON email_templates;
DROP POLICY IF EXISTS "Los admins pueden ver todas las plantillas" ON email_templates;

CREATE POLICY "Los admins pueden actualizar plantillas"
  ON email_templates FOR UPDATE
  USING (is_admin());

CREATE POLICY "Los admins pueden crear plantillas"
  ON email_templates FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Los admins pueden eliminar plantillas"
  ON email_templates FOR DELETE
  USING (is_admin());

CREATE POLICY "Los admins pueden ver todas las plantillas"
  ON email_templates FOR SELECT
  USING (is_admin());

-- ============================================
-- INCOMING_EMAILS
-- ============================================

DROP POLICY IF EXISTS "Admins can update incoming emails" ON incoming_emails;
DROP POLICY IF EXISTS "Admins can view incoming emails" ON incoming_emails;

CREATE POLICY "Admins can update incoming emails"
  ON incoming_emails FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can view incoming emails"
  ON incoming_emails FOR SELECT
  USING (is_admin());

-- ============================================
-- MODERATION_ACTIONS
-- ============================================

DROP POLICY IF EXISTS "Los admins pueden crear acciones de moderación" ON moderation_actions;
DROP POLICY IF EXISTS "Los admins pueden ver acciones de moderación" ON moderation_actions;

CREATE POLICY "Los admins pueden crear acciones de moderación"
  ON moderation_actions FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Los admins pueden ver acciones de moderación"
  ON moderation_actions FOR SELECT
  USING (is_admin());

-- Verificar cambios
SELECT 
  tablename,
  COUNT(*) as politicas_optimizadas
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'conversation_notes',
    'conversations',
    'email_replies',
    'email_templates',
    'incoming_emails',
    'moderation_actions'
  )
  AND qual LIKE '%is_admin()%'
GROUP BY tablename
ORDER BY tablename;

-- ✅ Progreso: ~35 políticas optimizadas de 60
