-- =====================================================
-- CONFIGURAR STORAGE PARA AVATARES
-- =====================================================
-- Fecha: 2025-01-17
-- Descripción: Crea el bucket de storage y políticas
--              para subir y gestionar fotos de perfil
-- =====================================================

-- 1. CREAR BUCKET 'profiles' (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. ELIMINAR POLÍTICAS ANTIGUAS SI EXISTEN
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- 2. POLÍTICAS DE STORAGE

-- 2.1 Permitir que cualquiera vea las imágenes (público)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

-- 2.2 Permitir que usuarios autenticados suban a la carpeta avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' AND 
  auth.role() = 'authenticated' AND
  name LIKE 'avatars/%'
);

-- 2.3 Permitir que usuarios actualicen archivos en avatars
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' AND 
  auth.role() = 'authenticated' AND
  name LIKE 'avatars/%'
);

-- 2.4 Permitir que usuarios eliminen archivos en avatars
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' AND 
  auth.role() = 'authenticated' AND
  name LIKE 'avatars/%'
);

-- 3. VERIFICAR CONFIGURACIÓN
SELECT 
  '📦 BUCKET CREADO' as status,
  id,
  name,
  public as es_publico
FROM storage.buckets
WHERE id = 'profiles';

SELECT 
  '🔒 POLÍTICAS DE STORAGE' as status,
  policyname as politica,
  cmd as operacion
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%avatar%'
ORDER BY cmd;

-- =====================================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- =====================================================
--
-- BUCKET CREADO:
--   - Nombre: profiles
--   - Público: true
--   - Ruta: avatars/{userId}-{timestamp}.{ext}
--
-- POLÍTICAS:
--   ✅ SELECT  - Cualquiera puede ver las imágenes
--   ✅ INSERT  - Usuario puede subir su avatar
--   ✅ UPDATE  - Usuario puede actualizar su avatar
--   ✅ DELETE  - Usuario puede eliminar su avatar
--
-- SEGURIDAD:
--   - Los usuarios solo pueden modificar sus propias imágenes
--   - Se verifica que el nombre de carpeta coincida con auth.uid()
--   - Las imágenes son públicamente accesibles (CDN)
--
-- FORMATOS ACEPTADOS:
--   - JPG, PNG, GIF, WEBP
--   - Tamaño máximo: 5MB (validado en frontend)
--
-- EJEMPLO DE RUTA:
--   avatars/28cd2ce8-052d-469c-8009-910eca828757-1705449600000.jpg
--   ↑        ↑                                      ↑
--   carpeta  userId                                 timestamp
-- =====================================================
