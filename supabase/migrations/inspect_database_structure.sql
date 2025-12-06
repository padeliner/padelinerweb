-- ================================================================
-- SCRIPT PARA INSPECCIONAR ESTRUCTURA DE LA BASE DE DATOS
-- Ejecuta este script en Supabase SQL Editor para ver todas las tablas y columnas
-- ================================================================

-- ================================================================
-- 1. LISTAR TODAS LAS TABLAS DEL SCHEMA PUBLIC
-- ================================================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ================================================================
-- 2. LISTAR TODAS LAS COLUMNAS DE TODAS LAS TABLAS
-- ================================================================
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ================================================================
-- 3. DETALLE COMPLETO DE CADA TABLA (ejecuta una por una según necesites)
-- ================================================================

-- Ver estructura de la tabla 'users'
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Ver estructura de tabla 'conversations' (si existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'conversations'
ORDER BY ordinal_position;

-- Ver estructura de tabla 'conversation_participants' (si existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'conversation_participants'
ORDER BY ordinal_position;

-- Ver estructura de tabla 'conversation_messages' (si existe)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'conversation_messages'
ORDER BY ordinal_position;

-- ================================================================
-- 4. LISTAR TODAS LAS FOREIGN KEYS
-- ================================================================
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ================================================================
-- 5. LISTAR TODOS LOS INDICES
-- ================================================================
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ================================================================
-- 6. VERIFICAR SI EXISTE TABLA TRAINER_PROFILES
-- ================================================================
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'trainer_profiles'
) as trainer_profiles_exists;

-- ================================================================
-- 7. CONTAR REGISTROS EN TABLAS PRINCIPALES
-- ================================================================

-- Contar usuarios
SELECT 'users' as table_name, COUNT(*) as total_rows FROM users;

-- Contar conversaciones (si existe)
SELECT 'conversations' as table_name, COUNT(*) as total_rows FROM conversations;

-- ================================================================
-- 8. VER DATOS DE LOS USUARIOS ALVARO Y GUILLERMO
-- ================================================================
SELECT 
    id,
    email,
    role,
    full_name,
    avatar_url,
    phone,
    created_at,
    updated_at
FROM users
WHERE id IN (
    '900d2812-8c39-4b08-a967-344c494f6b81',
    '5f9abcfe-bcdf-4566-b271-3beac38060c5'
);

-- ================================================================
-- 9. BUSCAR TABLA DE ENTRENADORES (puede tener diferente nombre)
-- ================================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
    table_name LIKE '%trainer%' OR
    table_name LIKE '%coach%' OR
    table_name LIKE '%entrenador%' OR
    table_name LIKE '%profile%'
)
ORDER BY table_name;
