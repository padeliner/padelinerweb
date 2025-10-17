-- ============================================
-- FASE 1: SISTEMA DE PERFILES PARA JUGADORES
-- Base de Datos - Tablas, Funciones, Triggers
-- ============================================
-- Tiempo estimado: 30 minutos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ============================================
-- TABLA 1: player_profiles
-- Perfil extendido del jugador
-- ============================================

CREATE TABLE player_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Información pública
  display_name TEXT, -- Nombre que quiere mostrar públicamente
  bio TEXT, -- Biografía corta
  avatar_url TEXT,
  
  -- Nivel y estadísticas
  skill_level TEXT CHECK (skill_level IN ('principiante', 'intermedio', 'avanzado', 'profesional')),
  years_playing INTEGER DEFAULT 0,
  favorite_position TEXT CHECK (favorite_position IN ('derecha', 'izquierda', 'ambas')),
  
  -- Preferencias
  preferred_training_type JSONB DEFAULT '[]'::jsonb, -- ['técnica', 'táctica', 'física']
  goals TEXT[], -- Objetivos del jugador
  
  -- Logros y badges
  achievements JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  
  -- Estadísticas
  total_sessions_completed INTEGER DEFAULT 0,
  total_hours_trained DECIMAL DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  
  -- Configuración de privacidad
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'coaches_only', 'private')),
  show_stats BOOLEAN DEFAULT true,
  show_reviews BOOLEAN DEFAULT true,
  show_coaches BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para player_profiles
CREATE INDEX idx_player_profiles_level ON player_profiles(skill_level);
CREATE INDEX idx_player_profiles_visibility ON player_profiles(profile_visibility);

-- RLS Policies para player_profiles
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

-- El jugador puede ver y editar su propio perfil
CREATE POLICY "Players can manage own profile"
  ON player_profiles FOR ALL
  USING (auth.uid() = user_id);

-- Perfiles públicos visibles para todos
CREATE POLICY "Public profiles visible to all"
  ON player_profiles FOR SELECT
  USING (profile_visibility = 'public');

-- Perfiles coaches_only visibles para entrenadores
CREATE POLICY "Coaches can view coaches_only profiles"
  ON player_profiles FOR SELECT
  USING (
    profile_visibility = 'coaches_only' 
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'entrenador'
    )
  );

-- Admins pueden ver todo
CREATE POLICY "Admins can view all player profiles"
  ON player_profiles FOR SELECT
  USING (is_admin());

-- ============================================
-- TABLA 2: player_reviews
-- Reviews de entrenadores sobre jugadores
-- ============================================

CREATE TABLE player_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  
  -- Review
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Aspectos específicos (opcional)
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  attitude_rating INTEGER CHECK (attitude_rating >= 1 AND attitude_rating <= 5),
  commitment_rating INTEGER CHECK (commitment_rating >= 1 AND commitment_rating <= 5),
  
  -- Tags positivos
  positive_tags TEXT[] DEFAULT '{}', -- ['motivated', 'focused', 'respectful']
  
  -- Visibilidad
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- Para destacar reviews especiales
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: Un entrenador solo puede dejar una review por sesión
  UNIQUE(coach_id, session_id)
);

-- Índices para player_reviews
CREATE INDEX idx_player_reviews_player ON player_reviews(player_id, created_at DESC);
CREATE INDEX idx_player_reviews_coach ON player_reviews(coach_id);
CREATE INDEX idx_player_reviews_rating ON player_reviews(rating);
CREATE INDEX idx_player_reviews_public ON player_reviews(player_id) WHERE is_public = true;

-- RLS Policies para player_reviews
ALTER TABLE player_reviews ENABLE ROW LEVEL SECURITY;

-- Entrenadores pueden crear reviews de sus jugadores
CREATE POLICY "Coaches can create reviews for their players"
  ON player_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = coach_id
    AND EXISTS (
      SELECT 1 FROM sessions 
      WHERE id = session_id 
      AND coach_id = auth.uid()
      AND student_id = player_reviews.player_id
      AND status = 'completed'
    )
  );

-- Entrenadores pueden editar sus propias reviews
CREATE POLICY "Coaches can update own reviews"
  ON player_reviews FOR UPDATE
  USING (auth.uid() = coach_id);

-- Reviews públicas visibles para todos
CREATE POLICY "Public reviews visible to all"
  ON player_reviews FOR SELECT
  USING (is_public = true);

-- Jugadores pueden ver todas sus reviews (públicas y privadas)
CREATE POLICY "Players can view all their reviews"
  ON player_reviews FOR SELECT
  USING (auth.uid() = player_id);

-- Admins pueden ver todo
CREATE POLICY "Admins can view all player reviews"
  ON player_reviews FOR SELECT
  USING (is_admin());

-- ============================================
-- TABLA 3: player_achievements
-- Catálogo de logros desbloqueables
-- ============================================

CREATE TABLE player_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información del logro
  code TEXT UNIQUE NOT NULL, -- 'first_session', 'streak_7_days', etc.
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji o nombre de ícono
  category TEXT NOT NULL, -- 'sessions', 'streak', 'skills', 'social'
  
  -- Requerimientos
  requirement_type TEXT NOT NULL, -- 'sessions_count', 'streak_days', 'hours_trained'
  requirement_value INTEGER NOT NULL,
  
  -- Configuración
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para player_achievements
CREATE INDEX idx_player_achievements_category ON player_achievements(category);
CREATE INDEX idx_player_achievements_active ON player_achievements(is_active) WHERE is_active = true;

-- RLS Policies para player_achievements
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver los logros disponibles
CREATE POLICY "Anyone can view achievements"
  ON player_achievements FOR SELECT
  USING (is_active = true);

-- Solo admins pueden gestionar logros
CREATE POLICY "Admins can manage achievements"
  ON player_achievements FOR ALL
  USING (is_admin());

-- ============================================
-- TABLA 4: player_achievement_unlocks
-- Logros desbloqueados por cada jugador
-- ============================================

CREATE TABLE player_achievement_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES player_achievements(id) ON DELETE CASCADE,
  
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, achievement_id)
);

-- Índices para player_achievement_unlocks
CREATE INDEX idx_player_unlocks_player ON player_achievement_unlocks(player_id, unlocked_at DESC);
CREATE INDEX idx_player_unlocks_achievement ON player_achievement_unlocks(achievement_id);

-- RLS Policies para player_achievement_unlocks
ALTER TABLE player_achievement_unlocks ENABLE ROW LEVEL SECURITY;

-- Jugadores pueden ver sus propios logros desbloqueados
CREATE POLICY "Players can view own unlocks"
  ON player_achievement_unlocks FOR SELECT
  USING (auth.uid() = player_id);

-- Logros públicos visibles si el perfil es público
CREATE POLICY "Public unlocks visible if profile is public"
  ON player_achievement_unlocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_profiles 
      WHERE user_id = player_id 
      AND profile_visibility = 'public'
    )
  );

-- Sistema puede desbloquear logros automáticamente
CREATE POLICY "System can unlock achievements"
  ON player_achievement_unlocks FOR INSERT
  WITH CHECK (true);

-- Admins pueden ver todos los logros
CREATE POLICY "Admins can view all unlocks"
  ON player_achievement_unlocks FOR SELECT
  USING (is_admin());

-- ============================================
-- FUNCIÓN: update_player_stats
-- Actualiza estadísticas cuando se completa sesión
-- ============================================

CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Cuando se completa una sesión, actualizar estadísticas
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Asegurarse de que el perfil existe
    INSERT INTO player_profiles (user_id, display_name)
    VALUES (
      NEW.student_id,
      (SELECT full_name FROM users WHERE id = NEW.student_id)
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Actualizar estadísticas
    UPDATE player_profiles
    SET 
      total_sessions_completed = total_sessions_completed + 1,
      total_hours_trained = total_hours_trained + 
        EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600,
      updated_at = NOW()
    WHERE user_id = NEW.student_id;
    
    -- Check y desbloquear logros
    PERFORM check_and_unlock_achievements(NEW.student_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar stats
CREATE TRIGGER trigger_update_player_stats
  AFTER INSERT OR UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_player_stats();

-- ============================================
-- FUNCIÓN: check_and_unlock_achievements
-- Verifica y desbloquea logros automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_player_id UUID)
RETURNS void AS $$
DECLARE
  v_achievement RECORD;
  v_player_profile RECORD;
BEGIN
  -- Obtener perfil del jugador
  SELECT * INTO v_player_profile
  FROM player_profiles
  WHERE user_id = p_player_id;
  
  -- Si no existe perfil, salir
  IF v_player_profile IS NULL THEN
    RETURN;
  END IF;
  
  -- Revisar cada logro activo
  FOR v_achievement IN 
    SELECT * FROM player_achievements WHERE is_active = true
  LOOP
    -- Verificar si ya lo tiene desbloqueado
    IF NOT EXISTS (
      SELECT 1 FROM player_achievement_unlocks 
      WHERE player_id = p_player_id 
      AND achievement_id = v_achievement.id
    ) THEN
      -- Verificar si cumple el requisito
      IF v_achievement.requirement_type = 'sessions_count' THEN
        IF v_player_profile.total_sessions_completed >= v_achievement.requirement_value THEN
          INSERT INTO player_achievement_unlocks (player_id, achievement_id)
          VALUES (p_player_id, v_achievement.id);
        END IF;
      ELSIF v_achievement.requirement_type = 'streak_days' THEN
        IF v_player_profile.current_streak_days >= v_achievement.requirement_value THEN
          INSERT INTO player_achievement_unlocks (player_id, achievement_id)
          VALUES (p_player_id, v_achievement.id);
        END IF;
      ELSIF v_achievement.requirement_type = 'hours_trained' THEN
        IF v_player_profile.total_hours_trained >= v_achievement.requirement_value THEN
          INSERT INTO player_achievement_unlocks (player_id, achievement_id)
          VALUES (p_player_id, v_achievement.id);
        END IF;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN: calculate_player_rating
-- Calcula rating promedio del jugador
-- ============================================

CREATE OR REPLACE FUNCTION calculate_player_rating(p_player_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating)::DECIMAL(3,2)
  INTO v_avg_rating
  FROM player_reviews
  WHERE player_id = p_player_id
    AND is_public = true;
    
  RETURN COALESCE(v_avg_rating, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_player_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_player_profiles_updated_at
  BEFORE UPDATE ON player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_player_profile_timestamp();

CREATE TRIGGER trigger_player_reviews_updated_at
  BEFORE UPDATE ON player_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_player_profile_timestamp();

-- ============================================
-- POBLAR LOGROS INICIALES
-- ============================================

INSERT INTO player_achievements (code, name, description, icon, category, requirement_type, requirement_value, sort_order) VALUES
-- Logros de sesiones
('first_session', 'Primera Clase', 'Completaste tu primera sesión de entrenamiento', '🎾', 'sessions', 'sessions_count', 1, 1),
('beginner', 'Principiante Dedicado', '5 sesiones completadas', '⭐', 'sessions', 'sessions_count', 5, 2),
('regular', 'Jugador Regular', '10 sesiones completadas', '🏆', 'sessions', 'sessions_count', 10, 3),
('committed', 'Comprometido', '25 sesiones completadas', '💪', 'sessions', 'sessions_count', 25, 4),
('dedicated', 'Dedicado', '50 sesiones completadas', '🔥', 'sessions', 'sessions_count', 50, 5),
('expert', 'Experto', '100 sesiones completadas', '👑', 'sessions', 'sessions_count', 100, 6),

-- Logros de rachas
('streak_3', 'Racha de 3 días', 'Entrenaste 3 días seguidos', '📅', 'streak', 'streak_days', 3, 7),
('streak_7', 'Racha de 7 días', 'Entrenaste 7 días seguidos', '🎯', 'streak', 'streak_days', 7, 8),
('streak_14', 'Dos Semanas', '14 días de racha', '💫', 'streak', 'streak_days', 14, 9),
('streak_30', 'Mes Completo', '30 días de racha', '🌟', 'streak', 'streak_days', 30, 10),

-- Logros de horas
('hours_10', '10 Horas', 'Completaste 10 horas de entrenamiento', '⏱️', 'sessions', 'hours_trained', 10, 11),
('hours_25', '25 Horas', 'Completaste 25 horas de entrenamiento', '⌚', 'sessions', 'hours_trained', 25, 12),
('hours_50', '50 Horas', 'Completaste 50 horas de entrenamiento', '🕐', 'sessions', 'hours_trained', 50, 13),
('hours_100', '100 Horas', 'Completaste 100 horas de entrenamiento', '⏰', 'sessions', 'hours_trained', 100, 14);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que se crearon las tablas
SELECT 
  'Tablas creadas' as check_item,
  COUNT(*) as cantidad
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('player_profiles', 'player_reviews', 'player_achievements', 'player_achievement_unlocks');

-- Verificar políticas RLS
SELECT 
  'Políticas RLS creadas' as check_item,
  COUNT(*) as cantidad
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('player_profiles', 'player_reviews', 'player_achievements', 'player_achievement_unlocks');

-- Verificar funciones
SELECT 
  'Funciones creadas' as check_item,
  COUNT(*) as cantidad
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('update_player_stats', 'check_and_unlock_achievements', 'calculate_player_rating');

-- Verificar logros iniciales
SELECT 
  'Logros iniciales' as check_item,
  COUNT(*) as cantidad
FROM player_achievements;

-- ============================================
-- ✅ RESULTADO ESPERADO:
-- ============================================
-- Tablas creadas: 4
-- Políticas RLS: ~15
-- Funciones: 3
-- Logros iniciales: 14
--
-- Si todos los valores coinciden:
-- ✅ FASE 1 COMPLETADA CON ÉXITO
-- ============================================
