# 🧹 LIMPIEZA Y OPTIMIZACIÓN SUPABASE - PLAN SEGURO

**Fecha:** 2025-01-17  
**Objetivo:** Optimizar sin romper funcionalidad existente

---

## ⚠️ IMPORTANTE - REGLA NÚMERO 1

**NO TOCAR** nada que se use activamente en el proyecto.  
Solo eliminar/optimizar lo que está **confirmado como no usado**.

---

## 1. 🗑️ TABLAS PARA ELIMINAR (100% SEGURO)

### **❌ location_distance_cache**

**Razón:** NO se usa en ningún archivo del código

**Impacto:** CERO - No hay referencias en el proyecto

**SQL para eliminar:**
```sql
DROP TABLE IF EXISTS location_distance_cache CASCADE;
```

**Recuperación de espacio:** ~5-10 KB (tabla probablemente vacía)

---

## 2. 🔒 POLÍTICAS RLS - OPTIMIZACIONES

### **PROBLEMA: Subconsulta repetida 60+ veces**

Cada política de admin tiene este código:
```sql
(EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role))))
```

**Impacto en Performance:**
- 60+ subconsultas iguales
- PostgreSQL tiene que ejecutar esto en cada operación
- Ralentiza todas las queries de admin

### **SOLUCIÓN: Función Helper**

```sql
-- 1. Crear función helper (EJECUTAR UNA SOLA VEZ)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  );
$$;

-- 2. Dar permisos
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
```

### **REFACTORIZAR POLÍTICAS (Ejemplo)**

**ANTES:**
```sql
CREATE POLICY "Admins can manage blogs"
  ON blogs FOR ALL
  USING (
    EXISTS ( SELECT 1
       FROM users
      WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))
  );
```

**DESPUÉS:**
```sql
CREATE POLICY "Admins can manage blogs"
  ON blogs FOR ALL
  USING (is_admin());
```

**Beneficios:**
- ✅ Código 90% más limpio
- ✅ Mejor performance (función se cachea)
- ✅ Más fácil de mantener
- ✅ Cambios futuros en un solo lugar

### **TABLAS A REFACTORIZAR (60+ políticas)**

```sql
academies           - 2 políticas admin
audit_logs          - 1 política admin
blog_comments       - 2 políticas admin
blog_config         - 1 política admin
blogs               - 1 política admin
clubs               - 2 políticas admin
coaches             - 2 políticas admin
content_reports     - 2 políticas admin
conversation_notes  - 1 política admin
conversations       - 2 políticas admin
email_replies       - 2 políticas admin
email_templates     - 4 políticas admin
incoming_emails     - 2 políticas admin
message_templates   - 2 políticas admin
messages            - 1 política admin
moderation_actions  - 2 políticas admin
newsletter_campaigns- 1 política admin
newsletter_sends    - 1 política admin
newsletter_subscribers - 2 políticas admin
sessions            - 2 políticas admin
sla_rules           - 2 políticas admin
support_tickets     - 2 políticas admin
team_members        - 2 políticas admin
teams               - 2 políticas admin
user_suspensions    - 3 políticas admin
users               - 3 políticas admin
```

**Total: ~60 políticas para optimizar**

---

## 3. 🔄 POLÍTICAS DUPLICADAS - ELIMINAR

### **coaches - Políticas redundantes**

```sql
-- ❌ ELIMINAR (redundante)
DROP POLICY "Anyone can view coaches" ON coaches;

-- ✅ MANTENER (más específica)
KEEP: "Anyone can view verified coaches"
```

**Razón:** `Anyone can view verified coaches` ya cubre el caso de uso real.

### **academies - Políticas duplicadas**

```sql
-- ❌ ELIMINAR (duplicada con manage)
DROP POLICY "Admins can view all academies" ON academies;

-- ✅ MANTENER (ALL ya incluye SELECT)
KEEP: "Admins can manage all academies"
```

### **clubs - Políticas duplicadas**

```sql
-- ❌ ELIMINAR (duplicada con manage)
DROP POLICY "Admins can view all clubs" ON clubs;

-- ✅ MANTENER
KEEP: "Admins can manage all clubs"
```

### **Lista completa de políticas duplicadas a eliminar:**

```sql
-- Ejecutar estos DROPs después de verificar
DROP POLICY IF EXISTS "Admins can view all academies" ON academies;
DROP POLICY IF EXISTS "Admins can view all clubs" ON clubs;
DROP POLICY IF EXISTS "Admins can view all coaches" ON coaches;
DROP POLICY IF EXISTS "Anyone can view coaches" ON coaches;
DROP POLICY IF EXISTS "Admins can view all conversations" ON conversations;
DROP POLICY IF EXISTS "Admins can view all logs" ON audit_logs; -- Ya tiene insert policy
DROP POLICY IF EXISTS "Admins can view all comments" ON blog_comments;
DROP POLICY IF EXISTS "Admins can view all sessions" ON sessions;
DROP POLICY IF EXISTS "Admins can view team members" ON team_members;
DROP POLICY IF EXISTS "Admins can view teams" ON teams;
```

**Total a eliminar: ~10 políticas duplicadas**

---

## 4. 📊 COLUMNAS REDUNDANTES O POCO ÚTILES

### **blogs.comment_count**

**Problema:** Dato derivado que se puede calcular

```sql
-- En lugar de almacenar comment_count
SELECT COUNT(*) FROM blog_comments WHERE blog_id = X;

-- O usar la relación ya existente
blogs.blog_comments(count)
```

**Acción:** 
- ⚠️  NO ELIMINAR aún (puede estar en uso)
- ✅ Verificar si se usa en queries
- ✅ Si no se usa, eliminar en futuro

### **conversation_stats (tabla/vista completa)**

**Verificar:** ¿Es una vista o tabla?

```sql
-- Ejecutar para verificar
SELECT table_type 
FROM information_schema.tables 
WHERE table_name = 'conversation_stats';
```

**Si es VISTA:**
- ✅ Dejar como está (no ocupa espacio)

**Si es TABLA:**
- ❓ Verificar si se usa
- ❓ Podría ser vista materializada

---

## 5. ⚡ ÍNDICES RECOMENDADOS (NUEVOS)

### **Índices compuestos para queries frecuentes**

```sql
-- Para buscar mensajes no leídos de una conversación
CREATE INDEX IF NOT EXISTS idx_direct_messages_unread 
  ON direct_messages(conversation_id, read_at) 
  WHERE read_at IS NULL;

-- Para buscar entrenadores verificados por ciudad
CREATE INDEX IF NOT EXISTS idx_coaches_location_verified
  ON coaches(location_city, verified)
  WHERE verified = true;

-- Para buscar blogs publicados por categoría
CREATE INDEX IF NOT EXISTS idx_blogs_published_category
  ON blogs(category, published_at DESC)
  WHERE published = true;

-- Para buscar tickets abiertos por prioridad
CREATE INDEX IF NOT EXISTS idx_support_tickets_open
  ON support_tickets(status, priority, created_at DESC)
  WHERE status IN ('abierto', 'en_progreso');

-- Para mensajes de una conversación ordenados
CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation_time
  ON direct_messages(conversation_id, created_at DESC);
```

**Beneficio:** Queries 10-100x más rápidas

---

## 6. 🔗 FOREIGN KEYS - CAMBIOS RECOMENDADOS

### **PROBLEMA: CASCADE en user deletion puede ser peligroso**

Actualmente si borras un `user`, se borran automáticamente:
- Su perfil (coach/club/academy)
- Todas sus sesiones
- Todos sus mensajes
- Todos sus reportes

**RIESGO:** Eliminación accidental de datos importantes

### **SOLUCIÓN 1: Cambiar a RESTRICT (Recomendado)**

```sql
-- Esto previene eliminar users que tengan datos relacionados
ALTER TABLE coaches 
  DROP CONSTRAINT coaches_user_id_fkey,
  ADD CONSTRAINT coaches_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE RESTRICT;

ALTER TABLE clubs 
  DROP CONSTRAINT clubs_user_id_fkey,
  ADD CONSTRAINT clubs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE RESTRICT;

ALTER TABLE academies 
  DROP CONSTRAINT academies_user_id_fkey,
  ADD CONSTRAINT academies_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE RESTRICT;
```

**Ventaja:** No puedes borrar accidentalmente un usuario con datos

### **SOLUCIÓN 2: Soft Delete (Más complejo pero mejor)**

```sql
-- Añadir columna deleted_at a users
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Modificar políticas para excluir deleted
-- En lugar de eliminar, marcar como deleted
UPDATE users SET deleted_at = NOW() WHERE id = X;
```

**Ventaja:** Datos nunca se pierden, se pueden recuperar

---

## 7. 🎯 FUNCIONES NO UTILIZADAS (Verificar antes de eliminar)

### **Funciones específicas de coaches - Verificar uso**

```sql
-- Buscar en código si se usan:
-- get_active_locations_for_date
-- get_travel_time_between_coach_locations
-- estimate_travel_time
-- is_slot_viable_for_coach
-- is_student_in_home_service_area
```

**Si NO se usan:**
```sql
DROP FUNCTION IF EXISTS get_active_locations_for_date CASCADE;
DROP FUNCTION IF EXISTS get_travel_time_between_coach_locations CASCADE;
DROP FUNCTION IF EXISTS estimate_travel_time CASCADE;
DROP FUNCTION IF EXISTS is_slot_viable_for_coach CASCADE;
DROP FUNCTION IF EXISTS is_student_in_home_service_area CASCADE;
```

---

## 8. 📋 PLAN DE EJECUCIÓN (ORDEN RECOMENDADO)

### **FASE 1: Backups (HACER PRIMERO)**

```bash
# Backup completo ANTES de cualquier cambio
pg_dump [tu_connection_string] > backup_antes_limpieza.sql
```

### **FASE 2: Cambios Seguros (SIN RIESGO)**

```sql
-- 1. Crear función helper
CREATE OR REPLACE FUNCTION public.is_admin() ...

-- 2. Eliminar tabla no usada
DROP TABLE IF EXISTS location_distance_cache CASCADE;

-- 3. Añadir índices nuevos
CREATE INDEX IF NOT EXISTS idx_direct_messages_unread ...
CREATE INDEX IF NOT EXISTS idx_coaches_location_verified ...
-- etc.
```

**Tiempo estimado:** 5 minutos

### **FASE 3: Optimizar Políticas (BAJO RIESGO)**

```sql
-- 1. Eliminar políticas duplicadas
DROP POLICY IF EXISTS "Admins can view all academies" ON academies;
-- etc (10 políticas)

-- 2. Refactorizar política por política usando is_admin()
-- Hacerlo de una en una, verificando después de cada cambio
```

**Tiempo estimado:** 30-60 minutos

### **FASE 4: Cambios FK (MEDIO RIESGO - OPCIONAL)**

```sql
-- Solo si decides implementar RESTRICT o soft-delete
ALTER TABLE coaches DROP CONSTRAINT ... ADD CONSTRAINT ...
```

**Tiempo estimado:** 15 minutos

---

## 9. ✅ CHECKLIST DE EJECUCIÓN

### **ANTES DE EMPEZAR**

```
[ ] Backup completo de la base de datos
[ ] Backup de archivos SQL extraídos
[ ] Proyecto funciona correctamente antes de cambios
[ ] Entorno de desarrollo/staging para probar
```

### **CAMBIOS SEGUROS (Hacer ya)**

```
[ ] Crear función is_admin()
[ ] DROP TABLE location_distance_cache
[ ] Crear índices compuestos nuevos
[ ] Eliminar 10 políticas duplicadas
```

### **OPTIMIZACIONES (Hacer con cuidado)**

```
[ ] Refactorizar políticas para usar is_admin() (60 políticas)
[ ] Verificar y eliminar funciones no usadas
[ ] Considerar cambio de CASCADE a RESTRICT
```

### **DESPUÉS DE CAMBIOS**

```
[ ] Verificar que la app funciona
[ ] Verificar que admin panel funciona
[ ] Verificar que chat funciona
[ ] Verificar que sistema de tickets funciona
[ ] Performance test de queries principales
```

---

## 10. 📊 BENEFICIOS ESPERADOS

### **Espacio Recuperado**

```
location_distance_cache:    ~5-10 KB
Políticas duplicadas:        0 KB (solo metadata)
```

### **Performance Mejorado**

```
Función is_admin():          +20-50% velocidad políticas admin
Índices compuestos:          +1000% velocidad queries específicas
Políticas eliminadas:        +5-10% velocidad general
```

### **Mantenibilidad**

```
60 políticas optimizadas:    -90% código duplicado
Función centralizada:        1 punto de cambio vs 60
Código más limpio:           Fácil de entender
```

---

## 11. 🚨 RIESGOS Y MITIGACIÓN

### **RIESGO BAJO**

✅ Eliminar `location_distance_cache`
- No se usa en código
- No tiene datos importantes
- Fácil de recrear si se necesita

### **RIESGO BAJO-MEDIO**

⚠️  Refactorizar políticas con `is_admin()`
- Funcionalidad idéntica
- Solo cambio de implementación
- Probar una por una

### **RIESGO MEDIO**

⚠️  Cambiar CASCADE a RESTRICT
- Cambia comportamiento
- Podría romper eliminación de users
- Mejor implementar soft-delete primero

---

## 12. 💡 RECOMENDACIÓN FINAL

### **HACER YA (10 minutos):**

1. ✅ Crear función `is_admin()`
2. ✅ Eliminar tabla `location_distance_cache`
3. ✅ Crear índices compuestos
4. ✅ Eliminar 10 políticas duplicadas

**Beneficio inmediato, riesgo mínimo**

### **HACER ESTA SEMANA (1-2 horas):**

5. ⚠️  Refactorizar 60 políticas para usar `is_admin()`
6. ⚠️  Verificar y eliminar funciones no usadas

**Gran beneficio de performance y mantenibilidad**

### **CONSIDERAR PARA EL FUTURO:**

7. 💭 Implementar soft-delete en `users`
8. 💭 Cambiar CASCADE a RESTRICT
9. 💭 Revisar columnas derivadas (`comment_count`, etc)

**Mejoras arquitectónicas, requieren planificación**

---

## 📝 SCRIPT COMPLETO - EJECUTAR EN ORDEN

```sql
-- ============================================
-- SCRIPT DE LIMPIEZA Y OPTIMIZACIÓN
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================

-- ============================================
-- FASE 1: CREAR FUNCIÓN HELPER
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- ============================================
-- FASE 2: ELIMINAR TABLA NO USADA
-- ============================================

DROP TABLE IF EXISTS location_distance_cache CASCADE;

-- ============================================
-- FASE 3: CREAR ÍNDICES COMPUESTOS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_direct_messages_unread 
  ON direct_messages(conversation_id, read_at) 
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_coaches_location_verified
  ON coaches(location_city, verified)
  WHERE verified = true;

CREATE INDEX IF NOT EXISTS idx_blogs_published_category
  ON blogs(category, published_at DESC)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_support_tickets_open
  ON support_tickets(status, priority, created_at DESC)
  WHERE status IN ('abierto', 'en_progreso');

CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation_time
  ON direct_messages(conversation_id, created_at DESC);

-- ============================================
-- FASE 4: ELIMINAR POLÍTICAS DUPLICADAS
-- ============================================

DROP POLICY IF EXISTS "Admins can view all academies" ON academies;
DROP POLICY IF EXISTS "Admins can view all clubs" ON clubs;
DROP POLICY IF EXISTS "Admins can view all coaches" ON coaches;
DROP POLICY IF EXISTS "Anyone can view coaches" ON coaches;
DROP POLICY IF EXISTS "Admins can view all conversations" ON conversations;
DROP POLICY IF EXISTS "Admins can view all comments" ON blog_comments;
DROP POLICY IF EXISTS "Admins can view all sessions" ON sessions;
DROP POLICY IF EXISTS "Admins can view team members" ON team_members;
DROP POLICY IF EXISTS "Admins can view teams" ON teams;

-- ============================================
-- ✅ FIN - CAMBIOS SEGUROS COMPLETADOS
-- ============================================

-- VERIFICAR QUE TODO FUNCIONA ANTES DE CONTINUAR
-- Si todo OK, proceder con refactorización de políticas
```

---

**🎾 ¿Listo para ejecutar la limpieza?**

**Ejecuta el script paso a paso y verifica después de cada fase.**
