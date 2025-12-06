-- ============================================
-- COMPLETAR PERFIL DE ALVARO CON REVIEWS Y MÁS DATOS
-- ============================================

-- 1. Añadir más sesiones completadas (total 12 para desbloquear más logros)
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
  (SELECT id FROM users WHERE role = 'entrenador' ORDER BY RANDOM() LIMIT 1),
  '28cd2ce8-052d-469c-8009-910eca828757',
  CASE 
    WHEN n % 3 = 0 THEN 'clase_grupal'
    WHEN n % 3 = 1 THEN 'clase_individual'
    ELSE 'entrenamiento_tecnico'
  END,
  'location_' || (n % 3 + 1)::text,
  NOW() - (n || ' days')::INTERVAL - INTERVAL '2 hours',
  NOW() - (n || ' days')::INTERVAL - INTERVAL '1 hour',
  'completed',
  CASE 
    WHEN n % 3 = 0 THEN 25.00
    WHEN n % 3 = 1 THEN 35.00
    ELSE 40.00
  END
FROM generate_series(4, 12) n;

-- 2. Crear REVIEWS de entrenadores
-- Review 1: Excelente
INSERT INTO player_reviews (
  player_id,
  coach_id,
  session_id,
  rating,
  comment,
  punctuality_rating,
  attitude_rating,
  commitment_rating,
  positive_tags,
  is_public,
  is_featured,
  created_at
)
SELECT 
  '28cd2ce8-052d-469c-8009-910eca828757',
  coach_id,
  id,
  5,
  'Álvaro es un jugador excepcional. Siempre llega puntual, con mucha energía y ganas de aprender. Se nota su compromiso y pasión por el pádel. Es un placer entrenarle.',
  5,
  5,
  5,
  ARRAY['motivated', 'focused', 'respectful', 'quick-learner'],
  true,
  true,
  NOW() - INTERVAL '2 days'
FROM sessions 
WHERE student_id = '28cd2ce8-052d-469c-8009-910eca828757' 
  AND status = 'completed'
ORDER BY created_at DESC
LIMIT 1;

-- Review 2: Muy buena
INSERT INTO player_reviews (
  player_id,
  coach_id,
  session_id,
  rating,
  comment,
  punctuality_rating,
  attitude_rating,
  commitment_rating,
  positive_tags,
  is_public,
  created_at
)
SELECT 
  '28cd2ce8-052d-469c-8009-910eca828757',
  coach_id,
  id,
  5,
  'Excelente alumno. Muy atento a las correcciones técnicas y siempre con actitud positiva. Ha mejorado muchísimo su revés en las últimas sesiones.',
  5,
  5,
  4,
  ARRAY['dedicated', 'positive-attitude', 'hard-working'],
  true,
  NOW() - INTERVAL '5 days'
FROM sessions 
WHERE student_id = '28cd2ce8-052d-469c-8009-910eca828757' 
  AND status = 'completed'
  AND id NOT IN (SELECT session_id FROM player_reviews WHERE session_id IS NOT NULL)
ORDER BY created_at DESC
LIMIT 1;

-- Review 3: Buena
INSERT INTO player_reviews (
  player_id,
  coach_id,
  session_id,
  rating,
  comment,
  punctuality_rating,
  attitude_rating,
  commitment_rating,
  positive_tags,
  is_public,
  created_at
)
SELECT 
  '28cd2ce8-052d-469c-8009-910eca828757',
  coach_id,
  id,
  4,
  'Álvaro es un jugador comprometido que trabaja duro en cada sesión. Tiene buen nivel técnico y siempre está dispuesto a aprender cosas nuevas. Recomendado.',
  4,
  5,
  4,
  ARRAY['team-player', 'enthusiastic'],
  true,
  NOW() - INTERVAL '8 days'
FROM sessions 
WHERE student_id = '28cd2ce8-052d-469c-8009-910eca828757' 
  AND status = 'completed'
  AND id NOT IN (SELECT session_id FROM player_reviews WHERE session_id IS NOT NULL)
ORDER BY created_at DESC
LIMIT 1;

-- Review 4: Excelente - Sin sesión específica
INSERT INTO player_reviews (
  player_id,
  coach_id,
  rating,
  comment,
  punctuality_rating,
  attitude_rating,
  commitment_rating,
  positive_tags,
  is_public,
  created_at
) VALUES (
  '28cd2ce8-052d-469c-8009-910eca828757',
  (SELECT id FROM users WHERE role = 'entrenador' ORDER BY RANDOM() LIMIT 1),
  5,
  'Gran experiencia entrenar a Álvaro. Siempre viene preparado, pregunta lo necesario y practica entre sesiones. Su progreso ha sido notable.',
  5,
  5,
  5,
  ARRAY['motivated', 'punctual', 'respectful'],
  true,
  NOW() - INTERVAL '12 days'
);

-- 3. Añadir algunas sesiones próximas
INSERT INTO sessions (
  coach_id,
  student_id,
  service_id,
  location_id,
  start_time,
  end_time,
  status,
  price
) VALUES
-- Sesión mañana
(
  (SELECT id FROM users WHERE role = 'entrenador' LIMIT 1),
  '28cd2ce8-052d-469c-8009-910eca828757',
  'clase_individual',
  'location_1',
  NOW() + INTERVAL '1 day' + INTERVAL '10 hours',
  NOW() + INTERVAL '1 day' + INTERVAL '11 hours',
  'confirmed',
  35.00
),
-- Sesión en 3 días
(
  (SELECT id FROM users WHERE role = 'entrenador' OFFSET 1 LIMIT 1),
  '28cd2ce8-052d-469c-8009-910eca828757',
  'entrenamiento_tactico',
  'location_2',
  NOW() + INTERVAL '3 days' + INTERVAL '18 hours',
  NOW() + INTERVAL '3 days' + INTERVAL '19 hours',
  'confirmed',
  40.00
),
-- Sesión pendiente de confirmación
(
  (SELECT id FROM users WHERE role = 'entrenador' LIMIT 1),
  '28cd2ce8-052d-469c-8009-910eca828757',
  'clase_grupal',
  'location_1',
  NOW() + INTERVAL '5 days' + INTERVAL '17 hours',
  NOW() + INTERVAL '5 days' + INTERVAL '18 hours',
  'pending',
  25.00
);

-- 4. Actualizar racha actual (simulando actividad consistente)
UPDATE player_profiles
SET 
  current_streak_days = 7,
  longest_streak_days = 12
WHERE user_id = '28cd2ce8-052d-469c-8009-910eca828757';

-- 5. Forzar recálculo de logros
SELECT check_and_unlock_achievements('28cd2ce8-052d-469c-8009-910eca828757');

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Ver perfil completo
SELECT 
  display_name,
  skill_level,
  years_playing,
  total_sessions_completed,
  total_hours_trained,
  current_streak_days,
  longest_streak_days
FROM player_profiles
WHERE user_id = '28cd2ce8-052d-469c-8009-910eca828757';

-- Ver rating promedio y total de reviews
SELECT 
  COUNT(*) as total_reviews,
  ROUND(AVG(rating)::numeric, 2) as rating_promedio,
  COUNT(*) FILTER (WHERE rating = 5) as reviews_5_estrellas,
  COUNT(*) FILTER (WHERE rating = 4) as reviews_4_estrellas
FROM player_reviews
WHERE player_id = '28cd2ce8-052d-469c-8009-910eca828757'
  AND is_public = true;

-- Ver logros desbloqueados
SELECT 
  a.icon || ' ' || a.name as logro,
  a.category as categoria
FROM player_achievement_unlocks u
JOIN player_achievements a ON a.id = u.achievement_id
WHERE u.player_id = '28cd2ce8-052d-469c-8009-910eca828757'
ORDER BY u.unlocked_at DESC;

-- Ver próximas sesiones
SELECT 
  start_time,
  status,
  u.full_name as entrenador
FROM sessions s
JOIN users u ON u.id = s.coach_id
WHERE s.student_id = '28cd2ce8-052d-469c-8009-910eca828757'
  AND s.start_time > NOW()
  AND s.status IN ('pending', 'confirmed')
ORDER BY s.start_time;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Sesiones: 12 completadas + 3 próximas
-- Reviews: 4 reviews (rating promedio: 4.75/5)
-- Logros: 4-5 logros desbloqueados
-- Racha: 7 días actual, 12 días récord
-- ============================================
