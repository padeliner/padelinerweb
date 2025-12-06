-- ============================================
-- FEATURES AVANZADAS PARA JUGADORES
-- Sistema completo de funcionalidades adicionales
-- ============================================

-- ============================================
-- 1. ENTRENADORES FAVORITOS ⭐
-- ============================================

CREATE TABLE player_favorite_coaches (
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT, -- Notas personales sobre el entrenador
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (player_id, coach_id)
);

-- Índices
CREATE INDEX idx_favorite_coaches_player ON player_favorite_coaches(player_id);
CREATE INDEX idx_favorite_coaches_coach ON player_favorite_coaches(coach_id);

-- RLS
ALTER TABLE player_favorite_coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can manage their favorites"
  ON player_favorite_coaches FOR ALL
  USING (auth.uid() = player_id);

CREATE POLICY "Coaches can view who favorited them"
  ON player_favorite_coaches FOR SELECT
  USING (auth.uid() = coach_id);

-- ============================================
-- 2. HISTORIAL DE MEJORAS/PROGRESO 📈
-- ============================================

CREATE TABLE player_progress_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  
  -- Área de mejora
  skill_area TEXT NOT NULL, -- 'revés', 'saque', 'volea', 'táctica', 'física'
  
  -- Rating antes y después (escala 1-10)
  rating_before DECIMAL(3,1) CHECK (rating_before >= 1 AND rating_before <= 10),
  rating_after DECIMAL(3,1) CHECK (rating_after >= 1 AND rating_after <= 10),
  
  -- Notas del entrenador
  observations TEXT,
  recommendations TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_progress_player ON player_progress_notes(player_id, created_at DESC);
CREATE INDEX idx_progress_skill ON player_progress_notes(player_id, skill_area);
CREATE INDEX idx_progress_coach ON player_progress_notes(coach_id);

-- RLS
ALTER TABLE player_progress_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their progress"
  ON player_progress_notes FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Coaches can create progress notes"
  ON player_progress_notes FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update own notes"
  ON player_progress_notes FOR UPDATE
  USING (auth.uid() = coach_id);

CREATE POLICY "Admins can view all progress"
  ON player_progress_notes FOR SELECT
  USING (is_admin());

-- ============================================
-- 3. OBJETIVOS CON PROGRESO ✅
-- ============================================

CREATE TABLE player_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Objetivo
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'técnico', 'físico', 'táctico', 'mental', 'competición'
  
  -- Progreso
  target_value INTEGER, -- Meta numérica (ej: 20 sesiones)
  current_value INTEGER DEFAULT 0, -- Progreso actual
  unit TEXT, -- 'sesiones', 'horas', 'días', 'partidos ganados'
  
  -- Fechas
  target_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  -- Visibilidad
  is_public BOOLEAN DEFAULT false, -- ¿Visible en perfil público?
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_goals_player ON player_goals(player_id, completed, created_at DESC);
CREATE INDEX idx_goals_active ON player_goals(player_id) WHERE completed = false;
CREATE INDEX idx_goals_public ON player_goals(player_id) WHERE is_public = true;

-- RLS
ALTER TABLE player_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can manage their goals"
  ON player_goals FOR ALL
  USING (auth.uid() = player_id);

CREATE POLICY "Public goals visible to all"
  ON player_goals FOR SELECT
  USING (is_public = true);

-- Función para actualizar progreso automáticamente
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Si alcanzó la meta, marcar como completado
  IF NEW.current_value >= NEW.target_value AND NOT NEW.completed THEN
    NEW.completed = true;
    NEW.completed_at = NOW();
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_goal_progress
  BEFORE UPDATE ON player_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress();

-- ============================================
-- 4. PREFERENCIAS DE ENTRENAMIENTO 🎯
-- ============================================

ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Función helper para actualizar preferencias
CREATE OR REPLACE FUNCTION update_player_preferences(
  p_player_id UUID,
  p_preferences JSONB
)
RETURNS void AS $$
BEGIN
  UPDATE player_profiles
  SET 
    preferences = p_preferences,
    updated_at = NOW()
  WHERE user_id = p_player_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejemplo de estructura de preferencias:
COMMENT ON COLUMN player_profiles.preferences IS 
'Estructura JSON:
{
  "max_distance_km": 10,
  "preferred_times": ["morning", "evening"],
  "preferred_days": [1, 3, 5],
  "preferred_court_type": "indoor",
  "budget_min": 25,
  "budget_max": 45,
  "training_focus": ["técnica", "táctica"],
  "preferred_session_duration": 60,
  "group_size_preference": "individual"
}';

-- ============================================
-- 5. HISTORIAL DE CLASES DETALLADO 🎾
-- ============================================

-- Añadir campos adicionales a sessions para más detalles
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 5);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS skills_practiced TEXT[];
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS player_feedback TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS player_rating INTEGER CHECK (player_rating >= 1 AND player_rating <= 5);

-- Crear tabla de estadísticas por sesión
CREATE TABLE session_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Estadísticas técnicas
  winners INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  aces INTEGER DEFAULT 0,
  double_faults INTEGER DEFAULT 0,
  
  -- Métricas de rendimiento
  stamina_rating INTEGER CHECK (stamina_rating >= 1 AND stamina_rating <= 5),
  technique_rating INTEGER CHECK (technique_rating >= 1 AND technique_rating <= 5),
  strategy_rating INTEGER CHECK (strategy_rating >= 1 AND strategy_rating <= 5),
  
  -- Notas
  highlights TEXT,
  areas_to_improve TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_session_stats_session ON session_stats(session_id);
CREATE INDEX idx_session_stats_player ON session_stats(player_id);

-- RLS
ALTER TABLE session_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their session stats"
  ON session_stats FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Coaches can create session stats"
  ON session_stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_stats.session_id
      AND s.coach_id = auth.uid()
    )
  );

-- ============================================
-- 6. NOTIFICACIONES 🔔
-- ============================================

CREATE TABLE player_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tipo de notificación
  type TEXT NOT NULL, -- 'achievement', 'review', 'session_reminder', 'goal_completed', 'progress_note'
  
  -- Contenido
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT, -- URL para ir al detalle
  
  -- Metadata
  related_id UUID, -- ID del objeto relacionado (achievement_id, review_id, etc.)
  icon TEXT, -- Emoji o nombre de ícono
  
  -- Estado
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Prioridad
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notifications_player ON player_notifications(player_id, read, created_at DESC);
CREATE INDEX idx_notifications_unread ON player_notifications(player_id) WHERE read = false;

-- RLS
ALTER TABLE player_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their notifications"
  ON player_notifications FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Players can update their notifications"
  ON player_notifications FOR UPDATE
  USING (auth.uid() = player_id);

CREATE POLICY "System can create notifications"
  ON player_notifications FOR INSERT
  WITH CHECK (true);

-- Función para crear notificación
CREATE OR REPLACE FUNCTION create_notification(
  p_player_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_icon TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO player_notifications (
    player_id,
    type,
    title,
    message,
    action_url,
    icon,
    priority
  ) VALUES (
    p_player_id,
    p_type,
    p_title,
    p_message,
    p_action_url,
    p_icon,
    p_priority
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para notificar cuando se desbloquea un logro
CREATE OR REPLACE FUNCTION notify_achievement_unlocked()
RETURNS TRIGGER AS $$
DECLARE
  v_achievement_name TEXT;
  v_achievement_icon TEXT;
BEGIN
  -- Obtener nombre e ícono del logro
  SELECT name, icon 
  INTO v_achievement_name, v_achievement_icon
  FROM player_achievements
  WHERE id = NEW.achievement_id;
  
  -- Crear notificación
  PERFORM create_notification(
    NEW.player_id,
    'achievement',
    '¡Nuevo logro desbloqueado!',
    'Has conseguido: ' || v_achievement_name,
    '/dashboard/jugador?tab=achievements',
    v_achievement_icon,
    'high'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_achievement
  AFTER INSERT ON player_achievement_unlocks
  FOR EACH ROW
  EXECUTE FUNCTION notify_achievement_unlocked();

-- Trigger para notificar cuando recibe una review
CREATE OR REPLACE FUNCTION notify_new_review()
RETURNS TRIGGER AS $$
DECLARE
  v_coach_name TEXT;
BEGIN
  -- Obtener nombre del entrenador
  SELECT full_name INTO v_coach_name
  FROM users
  WHERE id = NEW.coach_id;
  
  -- Crear notificación
  PERFORM create_notification(
    NEW.player_id,
    'review',
    'Nueva valoración recibida',
    v_coach_name || ' te ha dejado una valoración de ' || NEW.rating || ' estrellas',
    '/dashboard/jugador?tab=reviews',
    '⭐',
    'normal'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_review
  AFTER INSERT ON player_reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_review();

-- ============================================
-- POBLAR DATOS INICIALES PARA ALVARO
-- ============================================

-- 1. Añadir entrenadores favoritos
INSERT INTO player_favorite_coaches (player_id, coach_id, notes)
SELECT 
  '28cd2ce8-052d-469c-8009-910eca828757',
  coach_id,
  'Excelente entrenador, me ayudó mucho con mi revés'
FROM sessions
WHERE student_id = '28cd2ce8-052d-469c-8009-910eca828757'
  AND status = 'completed'
GROUP BY coach_id
HAVING COUNT(*) >= 2
LIMIT 2;

-- 2. Añadir notas de progreso
INSERT INTO player_progress_notes (
  player_id,
  coach_id,
  session_id,
  skill_area,
  rating_before,
  rating_after,
  observations,
  recommendations
)
SELECT 
  '28cd2ce8-052d-469c-8009-910eca828757',
  coach_id,
  id,
  'revés',
  5.5,
  7.0,
  'Gran mejora en la técnica del revés. Álvaro ha trabajado mucho en la posición del cuerpo y el timing del golpe.',
  'Seguir practicando el revés cruzado y trabajar en la potencia sin perder control.'
FROM sessions
WHERE student_id = '28cd2ce8-052d-469c-8009-910eca828757'
  AND status = 'completed'
ORDER BY created_at DESC
LIMIT 1;

-- 3. Crear objetivos
INSERT INTO player_goals (
  player_id,
  title,
  description,
  category,
  target_value,
  current_value,
  unit,
  target_date,
  is_public
) VALUES
(
  '28cd2ce8-052d-469c-8009-910eca828757',
  'Completar 25 sesiones de entrenamiento',
  'Meta para mejorar mi constancia y nivel general',
  'físico',
  25,
  12, -- Ya tiene 12 sesiones
  'sesiones',
  CURRENT_DATE + INTERVAL '2 months',
  true
),
(
  '28cd2ce8-052d-469c-8009-910eca828757',
  'Mantener racha de 30 días',
  'Entrenar consistentemente durante un mes',
  'mental',
  30,
  7, -- Racha actual
  'días',
  CURRENT_DATE + INTERVAL '1 month',
  true
),
(
  '28cd2ce8-052d-469c-8009-910eca828757',
  'Ganar mi primer torneo local',
  'Participar y ganar en un torneo de nivel iniciación',
  'competición',
  1,
  0,
  'torneos',
  CURRENT_DATE + INTERVAL '4 months',
  true
);

-- 4. Configurar preferencias
UPDATE player_profiles
SET preferences = '{
  "max_distance_km": 15,
  "preferred_times": ["evening", "weekend_morning"],
  "preferred_days": [1, 3, 5, 6],
  "preferred_court_type": "indoor",
  "budget_min": 30,
  "budget_max": 45,
  "training_focus": ["técnica", "táctica"],
  "preferred_session_duration": 60,
  "group_size_preference": "individual"
}'::jsonb
WHERE user_id = '28cd2ce8-052d-469c-8009-910eca828757';

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT '✅ FEATURES AVANZADAS INSTALADAS' as status;

-- Verificar tablas creadas
SELECT 
  COUNT(*) as total_tablas_nuevas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'player_favorite_coaches',
    'player_progress_notes',
    'player_goals',
    'session_stats',
    'player_notifications'
  );

-- Ver datos de Alvaro
SELECT 
  (SELECT COUNT(*) FROM player_favorite_coaches WHERE player_id = '28cd2ce8-052d-469c-8009-910eca828757') as entrenadores_favoritos,
  (SELECT COUNT(*) FROM player_progress_notes WHERE player_id = '28cd2ce8-052d-469c-8009-910eca828757') as notas_progreso,
  (SELECT COUNT(*) FROM player_goals WHERE player_id = '28cd2ce8-052d-469c-8009-910eca828757') as objetivos,
  (SELECT COUNT(*) FROM player_notifications WHERE player_id = '28cd2ce8-052d-469c-8009-910eca828757') as notificaciones;

-- Ver objetivos con progreso
SELECT 
  title,
  current_value || '/' || target_value || ' ' || unit as progreso,
  ROUND((current_value::DECIMAL / target_value * 100), 0)::INTEGER || '%' as porcentaje,
  target_date,
  completed
FROM player_goals
WHERE player_id = '28cd2ce8-052d-469c-8009-910eca828757'
ORDER BY completed, target_date;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Tablas nuevas: 5
-- Entrenadores favoritos: 2
-- Notas de progreso: 1
-- Objetivos: 3
-- Notificaciones: Varias (por logros y reviews)
-- ============================================
