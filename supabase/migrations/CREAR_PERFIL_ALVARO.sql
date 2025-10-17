-- ============================================
-- CREAR PERFIL COMPLETO PARA ALVARO
-- ============================================

-- 1. Crear/Actualizar perfil
INSERT INTO player_profiles (
  user_id,
  display_name,
  bio,
  skill_level,
  years_playing,
  favorite_position,
  goals,
  profile_visibility,
  show_stats,
  show_reviews,
  show_coaches
) VALUES (
  '28cd2ce8-052d-469c-8009-910eca828757',
  'Alvaro Vinilo',
  'Jugador apasionado del pádel. Me encanta jugar y siempre estoy buscando mejorar mi técnica y nivel de juego.',
  'intermedio',
  2,
  'derecha',
  ARRAY[
    'Mejorar mi revés',
    'Jugar al menos 3 veces por semana',
    'Ganar mi primer torneo local',
    'Perfeccionar mi saque'
  ],
  'public',
  true,
  true,
  true
)
ON CONFLICT (user_id) 
DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  skill_level = EXCLUDED.skill_level,
  years_playing = EXCLUDED.years_playing,
  favorite_position = EXCLUDED.favorite_position,
  goals = EXCLUDED.goals,
  updated_at = NOW();

-- 2. Crear 3 sesiones completadas (para activar stats y logros)
INSERT INTO sessions (
  coach_id,
  student_id,
  service_id,
  location_id,
  start_time,
  end_time,
  status,
  price
) 
SELECT
  (SELECT id FROM users WHERE role = 'entrenador' LIMIT 1), -- Primer entrenador disponible
  '28cd2ce8-052d-469c-8009-910eca828757',
  'clase_individual',
  'location_1',
  NOW() - (n || ' days')::INTERVAL - INTERVAL '2 hours',
  NOW() - (n || ' days')::INTERVAL - INTERVAL '1 hour',
  'completed',
  35.00
FROM generate_series(1, 3) n;

-- 3. Verificar que se creó el perfil
SELECT 
  user_id,
  display_name,
  skill_level,
  total_sessions_completed,
  total_hours_trained,
  current_streak_days
FROM player_profiles
WHERE user_id = '28cd2ce8-052d-469c-8009-910eca828757';

-- 4. Verificar logros desbloqueados
SELECT 
  a.name,
  a.icon,
  a.description,
  u.unlocked_at
FROM player_achievement_unlocks u
JOIN player_achievements a ON a.id = u.achievement_id
WHERE u.player_id = '28cd2ce8-052d-469c-8009-910eca828757'
ORDER BY u.unlocked_at DESC;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Perfil: 3 sesiones, 3 horas, racha actual
-- Logros: "Primera Clase 🎾" y "Principiante Dedicado ⭐"
-- ============================================
