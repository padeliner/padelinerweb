-- ================================================================
-- CREATE EXAMPLE TRAINERS - Alvaro y Guillermo
-- ================================================================

-- Actualizar el rol de Alvaro a trainer
UPDATE users
SET 
  role = 'trainer',
  updated_at = NOW()
WHERE id = '900d2812-8c39-4b08-a967-344c494f6b81';

-- Actualizar el rol de Guillermo a trainer  
UPDATE users
SET 
  role = 'trainer',
  updated_at = NOW()
WHERE id = '5f9abcfe-bcdf-4566-b271-3beac38060c5';

-- Crear perfil de entrenador para Alvaro
INSERT INTO trainer_profiles (
  user_id,
  bio,
  specialties,
  experience_years,
  price_per_hour,
  location_city,
  location_lat,
  location_lng,
  offers_home_service,
  availability,
  certifications,
  rating,
  reviews_count
) VALUES (
  '900d2812-8c39-4b08-a967-344c494f6b81',
  'Entrenador profesional con más de 8 años de experiencia en pádel. Especializado en técnica y táctica para jugadores de nivel intermedio y avanzado. ¡Mejora tu juego conmigo!',
  ARRAY['Adultos', 'Competición', 'Técnica avanzada'],
  8,
  45.00,
  'Valencia',
  39.4699,
  -0.3763,
  true,
  jsonb_build_object(
    'monday', ARRAY['09:00-13:00', '17:00-21:00'],
    'tuesday', ARRAY['09:00-13:00', '17:00-21:00'],
    'wednesday', ARRAY['09:00-13:00', '17:00-21:00'],
    'thursday', ARRAY['09:00-13:00', '17:00-21:00'],
    'friday', ARRAY['09:00-13:00', '17:00-21:00'],
    'saturday', ARRAY['10:00-14:00'],
    'sunday', ARRAY[]
  ),
  ARRAY['Entrenador Nacional RPT', 'Monitor Nivel 2'],
  4.8,
  24
) ON CONFLICT (user_id) DO UPDATE SET
  bio = EXCLUDED.bio,
  specialties = EXCLUDED.specialties,
  experience_years = EXCLUDED.experience_years,
  price_per_hour = EXCLUDED.price_per_hour,
  location_city = EXCLUDED.location_city,
  location_lat = EXCLUDED.location_lat,
  location_lng = EXCLUDED.location_lng,
  offers_home_service = EXCLUDED.offers_home_service,
  availability = EXCLUDED.availability,
  certifications = EXCLUDED.certifications,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count;

-- Crear perfil de entrenador para Guillermo
INSERT INTO trainer_profiles (
  user_id,
  bio,
  specialties,
  experience_years,
  price_per_hour,
  location_city,
  location_lat,
  location_lng,
  offers_home_service,
  availability,
  certifications,
  rating,
  reviews_count
) VALUES (
  '5f9abcfe-bcdf-4566-b271-3beac38060c5',
  'Entrenador con amplia experiencia en formación de jugadores junior y adultos. Metodología moderna y enfoque personalizado. ¡Lleva tu pádel al siguiente nivel!',
  ARRAY['Junior', 'Adultos', 'Iniciación', 'Táctica'],
  10,
  50.00,
  'Valencia',
  39.4699,
  -0.3763,
  true,
  jsonb_build_object(
    'monday', ARRAY['08:00-12:00', '18:00-22:00'],
    'tuesday', ARRAY['08:00-12:00', '18:00-22:00'],
    'wednesday', ARRAY['08:00-12:00', '18:00-22:00'],
    'thursday', ARRAY['08:00-12:00', '18:00-22:00'],
    'friday', ARRAY['08:00-12:00', '18:00-22:00'],
    'saturday', ARRAY['09:00-13:00'],
    'sunday', ARRAY['09:00-13:00']
  ),
  ARRAY['Entrenador Nacional RPT', 'Monitor Nivel 3', 'Preparador Físico'],
  4.9,
  32
) ON CONFLICT (user_id) DO UPDATE SET
  bio = EXCLUDED.bio,
  specialties = EXCLUDED.specialties,
  experience_years = EXCLUDED.experience_years,
  price_per_hour = EXCLUDED.price_per_hour,
  location_city = EXCLUDED.location_city,
  location_lat = EXCLUDED.location_lat,
  location_lng = EXCLUDED.location_lng,
  offers_home_service = EXCLUDED.offers_home_service,
  availability = EXCLUDED.availability,
  certifications = EXCLUDED.certifications,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count;

-- Añadir avatares (URLs de ejemplo con iniciales)
UPDATE users
SET avatar_url = 'https://ui-avatars.com/api/?name=Alvaro+Vinilo&size=200&background=16a34a&color=fff&bold=true'
WHERE id = '900d2812-8c39-4b08-a967-344c494f6b81' AND avatar_url IS NULL;

UPDATE users
SET avatar_url = 'https://ui-avatars.com/api/?name=Guillermo+Llombart&size=200&background=16a34a&color=fff&bold=true'
WHERE id = '5f9abcfe-bcdf-4566-b271-3beac38060c5' AND avatar_url IS NULL;
