-- ================================================================
-- AUDIT LOGS SYSTEM - Sistema de auditoría y logs
-- Description: Registro de eventos importantes del sistema
-- ================================================================

-- ================================================================
-- 1. AUDIT LOGS TABLE
-- ================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Usuario que realizó la acción
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_role TEXT,
  
  -- Información del evento
  action TEXT NOT NULL, -- login, logout, create, update, delete, send_email, payment, error, etc.
  entity_type TEXT, -- user, reservation, payment, conversation, newsletter, etc.
  entity_id TEXT, -- ID del registro afectado
  
  -- Descripción
  description TEXT NOT NULL,
  
  -- Metadata adicional (JSON)
  metadata JSONB DEFAULT '{}',
  
  -- Nivel de severidad
  level TEXT DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
  
  -- Información de contexto
  ip_address TEXT,
  user_agent TEXT,
  request_path TEXT,
  request_method TEXT,
  
  -- Status
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'pending')),
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 2. INDICES para búsqueda rápida
-- ================================================================
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_level ON audit_logs(level);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Índice compuesto para filtros combinados
CREATE INDEX idx_audit_logs_search ON audit_logs(action, entity_type, level, created_at DESC);

-- ================================================================
-- 3. ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admins pueden ver logs
CREATE POLICY "Admins can view all logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Sistema puede insertar logs (bypass RLS para inserts desde backend)
CREATE POLICY "System can insert logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- ================================================================
-- 4. FUNCIÓN helper para crear logs
-- ================================================================
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id UUID,
  p_action TEXT,
  p_description TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id TEXT DEFAULT NULL,
  p_level TEXT DEFAULT 'info',
  p_status TEXT DEFAULT 'success',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_user_email TEXT;
  v_user_role TEXT;
BEGIN
  -- Obtener info del usuario si existe
  IF p_user_id IS NOT NULL THEN
    SELECT email INTO v_user_email FROM auth.users WHERE id = p_user_id;
    SELECT role INTO v_user_role FROM users WHERE id = p_user_id;
  END IF;

  -- Insertar log
  INSERT INTO audit_logs (
    user_id,
    user_email,
    user_role,
    action,
    entity_type,
    entity_id,
    description,
    level,
    status,
    metadata
  ) VALUES (
    p_user_id,
    v_user_email,
    v_user_role,
    p_action,
    p_entity_type,
    p_entity_id,
    p_description,
    p_level,
    p_status,
    p_metadata
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 5. TRIGGERS automáticos para acciones críticas
-- ================================================================

-- Trigger para loggear cambios en usuarios (role changes)
CREATE OR REPLACE FUNCTION log_user_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    PERFORM create_audit_log(
      NEW.id,
      'role_change',
      format('Role changed from %s to %s', OLD.role, NEW.role),
      'user',
      NEW.id::TEXT,
      'warning',
      'success',
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_role_change_trigger
  AFTER UPDATE ON users
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION log_user_role_change();

-- ================================================================
-- 6. FUNCIÓN de limpieza de logs antiguos (ejecutar periódicamente)
-- ================================================================
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL
  AND level IN ('debug', 'info');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 7. VISTAS útiles para estadísticas
-- ================================================================

-- Vista: Logs por día
CREATE OR REPLACE VIEW logs_by_day AS
SELECT 
  DATE(created_at) as log_date,
  COUNT(*) as total_logs,
  COUNT(*) FILTER (WHERE level = 'error') as error_count,
  COUNT(*) FILTER (WHERE level = 'warning') as warning_count,
  COUNT(*) FILTER (WHERE level = 'info') as info_count
FROM audit_logs
GROUP BY DATE(created_at)
ORDER BY log_date DESC;

-- Vista: Logs por acción
CREATE OR REPLACE VIEW logs_by_action AS
SELECT 
  action,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE status = 'failure') as failures
FROM audit_logs
GROUP BY action
ORDER BY count DESC;

-- Vista: Logs por usuario (top activos)
CREATE OR REPLACE VIEW logs_by_user AS
SELECT 
  user_email,
  user_role,
  COUNT(*) as action_count,
  MAX(created_at) as last_activity
FROM audit_logs
WHERE user_email IS NOT NULL
GROUP BY user_email, user_role
ORDER BY action_count DESC;
