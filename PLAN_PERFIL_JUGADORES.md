# 📋 PLAN COMPLETO - SISTEMA DE PERFILES PARA JUGADORES

**Objetivo:** Crear dos espacios para jugadores:
1. **Perfil Público** - Mostrar su progreso con orgullo
2. **Dashboard Privado** - Gestionar su actividad

---

## 1. 🗄️ BASE DE DATOS - NUEVAS TABLAS

### **Tabla: player_profiles** (Perfil extendido del jugador)

```sql
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

-- Índices
CREATE INDEX idx_player_profiles_level ON player_profiles(skill_level);
CREATE INDEX idx_player_profiles_visibility ON player_profiles(profile_visibility);

-- RLS Policies
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
CREATE POLICY "Admins can view all profiles"
  ON player_profiles FOR SELECT
  USING (is_admin());
```

### **Tabla: player_reviews** (Reviews de entrenadores sobre jugadors)

```sql
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

-- Índices
CREATE INDEX idx_player_reviews_student ON player_reviews(player_id, created_at DESC);
CREATE INDEX idx_player_reviews_coach ON player_reviews(coach_id);
CREATE INDEX idx_player_reviews_rating ON player_reviews(rating);
CREATE INDEX idx_player_reviews_public ON player_reviews(player_id) WHERE is_public = true;

-- RLS Policies
ALTER TABLE player_reviews ENABLE ROW LEVEL SECURITY;

-- Entrenadores pueden crear reviews de sus jugadors
CREATE POLICY "Coaches can create reviews for their students"
  ON player_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = coach_id
    AND EXISTS (
      SELECT 1 FROM sessions 
      WHERE id = session_id 
      AND coach_id = auth.uid()
      AND player_id = player_reviews.player_id
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

-- Jugadors pueden ver todas sus reviews (públicas y privadas)
CREATE POLICY "Players can view all their reviews"
  ON player_reviews FOR SELECT
  USING (auth.uid() = player_id);

-- Admins pueden ver todo
CREATE POLICY "Admins can view all reviews"
  ON player_reviews FOR SELECT
  USING (is_admin());
```

### **Tabla: player_achievements** (Logros desbloqueables)

```sql
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

-- Logros iniciales
INSERT INTO player_achievements (code, name, description, icon, category, requirement_type, requirement_value) VALUES
('first_session', 'Primera Clase', 'Completaste tu primera sesión de entrenamiento', '🎾', 'sessions', 'sessions_count', 1),
('beginner', 'Principiante Dedicado', '5 sesiones completadas', '⭐', 'sessions', 'sessions_count', 5),
('regular', 'Jugador Regular', '10 sesiones completadas', '🏆', 'sessions', 'sessions_count', 10),
('committed', 'Comprometido', '25 sesiones completadas', '💪', 'sessions', 'sessions_count', 25),
('dedicated', 'Dedicado', '50 sesiones completadas', '🔥', 'sessions', 'sessions_count', 50),
('streak_7', 'Racha de 7 días', 'Entrenaste 7 días seguidos', '📅', 'streak', 'streak_days', 7),
('streak_30', 'Mes Completo', '30 días de racha', '🎯', 'streak', 'streak_days', 30),
('early_bird', 'Madrugador', 'Entrena antes de las 8am', '🌅', 'social', 'special', 0);
```

### **Tabla: player_achievement_unlocks** (Logros desbloqueados)

```sql
CREATE TABLE player_achievement_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES player_achievements(id) ON DELETE CASCADE,
  
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(player_id, achievement_id)
);

CREATE INDEX idx_student_unlocks_student ON player_achievement_unlocks(player_id, unlocked_at DESC);

-- RLS
ALTER TABLE player_achievement_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view own unlocks"
  ON player_achievement_unlocks FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Public unlocks visible if profile is public"
  ON player_achievement_unlocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_profiles 
      WHERE user_id = player_id 
      AND profile_visibility = 'public'
    )
  );
```

---

## 2. 🌐 PÁGINA PÚBLICA - `/jugadores/[id]`

### **Ruta:** `/app/jugadores/[id]/page.tsx`

### **Secciones del Perfil Público:**

```tsx
// Estructura visual del perfil público

📸 HEADER
├── Avatar grande
├── Nombre display
├── Nivel (principiante/intermedio/avanzado)
├── Ubicación (ciudad)
└── Botón "Contactar" (si es entrenador viendo)

📊 ESTADÍSTICAS DESTACADAS (Cards)
├── 🎾 Sesiones Completadas: 47
├── ⏱️  Horas Entrenadas: 85h
├── 🔥 Racha Actual: 12 días
└── ⭐ Rating Promedio: 4.8/5

🏅 LOGROS Y BADGES
├── Grid de badges desbloqueados
├── Badges recientes primero
└── Mostrar progreso hacia próximo logro

📝 BIO Y OBJETIVOS
├── Biografía personal
├── Años jugando
├── Posición favorita
├── Objetivos actuales
└── Tipo de entrenamiento preferido

💬 REVIEWS DE ENTRENADORES
├── Rating general con estrellas
├── Distribución de ratings (gráfico)
├── Reviews recientes
│   ├── Foto y nombre del entrenador
│   ├── Estrellas
│   ├── Comentario
│   ├── Tags positivos
│   └── Fecha
└── Paginación

👨‍🏫 ÚLTIMOS ENTRENADORES
├── Grid de entrenadores con los que ha trabajado
├── Foto, nombre, especialidad
├── Número de sesiones juntos
└── Link a perfil del entrenador

📈 PROGRESO (si hace público)
├── Gráfico de sesiones por mes
├── Evolución del nivel
└── Mejoras detectadas
```

---

## 3. 🔒 DASHBOARD PRIVADO - `/dashboard/jugador`

### **Mejoras al dashboard existente:**

```tsx
// Estructura del dashboard privado

🏠 OVERVIEW
├── Bienvenida personalizada
├── Próxima clase programada
├── Racha actual con motivación
└── Progreso hacia próximo logro

📅 MIS CLASES
├── Tabs: Próximas | Historial | Canceladas
├── Calendario view
├── Lista con filtros
│   ├── Fecha
│   ├── Entrenador
│   ├── Estado
│   └── Tipo de sesión
├── Botón "Reservar Nueva Clase"
└── Acciones: Ver detalles | Cancelar | Reagendar

📊 MI PROGRESO
├── Estadísticas completas
│   ├── Total sesiones
│   ├── Horas entrenadas
│   ├── Rachas
│   ├── Rating promedio
│   └── Dinero invertido
├── Gráficos
│   ├── Sesiones por mes
│   ├── Tipos de entrenamiento
│   └── Horarios preferidos
└── Exportar datos

🏅 MIS LOGROS
├── Grid de logros desbloqueados
├── Progreso hacia logros pendientes
├── Próximos logros a desbloquear
└── Compartir logros en redes

👨‍🏫 MIS ENTRENADORES
├── Lista de entrenadores con los que he trabajado
├── Estadísticas por entrenador
│   ├── Sesiones totales
│   ├── Última sesión
│   └── Rating que le di
├── Acciones
│   ├── Reservar otra clase
│   ├── Enviar mensaje
│   └── Dejar review (si no lo hizo)

💬 REVIEWS RECIBIDAS
├── Todas mis reviews (públicas y privadas)
├── Filtros por entrenador y rating
├── Responder a reviews (opcional)
└── Configurar visibilidad

👤 MI PERFIL
├── Editar perfil público
│   ├── Foto
│   ├── Nombre display
│   ├── Bio
│   ├── Nivel
│   ├── Objetivos
│   └── Preferencias
├── Configuración de privacidad
│   ├── Visibilidad del perfil
│   ├── Mostrar estadísticas
│   ├── Mostrar reviews
│   └── Mostrar entrenadores
├── Link para compartir perfil público
└── Vista previa del perfil público

🛒 MIS COMPRAS (Futuro)
├── Historial de pedidos
├── Productos comprados
├── Facturas
└── Devoluciones

⚙️ CONFIGURACIÓN
├── Datos personales
├── Cambiar contraseña
├── Notificaciones
│   ├── Email
│   ├── Push
│   └── Preferencias de comunicación
└── Eliminar cuenta
```

---

## 4. 🔧 FUNCIONES Y TRIGGERS

### **Función: update_student_stats**

```sql
CREATE OR REPLACE FUNCTION update_student_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Cuando se completa una sesión, actualizar estadísticas
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE player_profiles
    SET 
      total_sessions_completed = total_sessions_completed + 1,
      total_hours_trained = total_hours_trained + 
        EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600,
      updated_at = NOW()
    WHERE user_id = NEW.player_id;
    
    -- Check y desbloquear logros
    PERFORM check_and_unlock_achievements(NEW.player_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_stats
  AFTER INSERT OR UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_student_stats();
```

### **Función: check_and_unlock_achievements**

```sql
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_player_id UUID)
RETURNS void AS $$
DECLARE
  v_achievement RECORD;
  v_student_profile RECORD;
BEGIN
  -- Obtener perfil del estudiante
  SELECT * INTO v_student_profile
  FROM player_profiles
  WHERE user_id = p_player_id;
  
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
        IF v_student_profile.total_sessions_completed >= v_achievement.requirement_value THEN
          INSERT INTO player_achievement_unlocks (player_id, achievement_id)
          VALUES (p_player_id, v_achievement.id);
        END IF;
      ELSIF v_achievement.requirement_type = 'streak_days' THEN
        IF v_student_profile.current_streak_days >= v_achievement.requirement_value THEN
          INSERT INTO player_achievement_unlocks (player_id, achievement_id)
          VALUES (p_player_id, v_achievement.id);
        END IF;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### **Función: calculate_student_rating**

```sql
CREATE OR REPLACE FUNCTION calculate_student_rating(p_player_id UUID)
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
```

---

## 5. 📱 APIs NECESARIAS

### **APIs para Perfil Público:**

- `GET /api/players/[id]` - Obtener perfil público completo
- `GET /api/players/[id]/reviews` - Reviews del jugador
- `GET /api/players/[id]/coaches` - Entrenadores con los que trabajó
- `GET /api/players/[id]/achievements` - Logros desbloqueados

### **APIs para Dashboard:**

- `GET /api/players/me/sessions` - Mis sesiones
- `GET /api/players/me/stats` - Mis estadísticas
- `GET /api/players/me/achievements` - Mis logros
- `PATCH /api/players/me/profile` - Actualizar perfil
- `PATCH /api/players/me/privacy` - Configuración privacidad

---

## 6. 🎨 DISEÑO Y UX

### **Colores y Badges:**

```css
/* Niveles */
.nivel-principiante { color: #10b981; } /* Verde */
.nivel-intermedio { color: #f59e0b; } /* Naranja */
.nivel-avanzado { color: #ef4444; } /* Rojo */
.nivel-profesional { color: #8b5cf6; } /* Púrpura */

/* Badges */
.badge-bronze { background: linear-gradient(135deg, #CD7F32, #B8860B); }
.badge-silver { background: linear-gradient(135deg, #C0C0C0, #A8A8A8); }
.badge-gold { background: linear-gradient(135deg, #FFD700, #FFA500); }
.badge-platinum { background: linear-gradient(135deg, #E5E4E2, #C0C0C0); }
```

---

## 7. ✅ ORDEN DE IMPLEMENTACIÓN

### **FASE 1: Base de Datos** (30 min)
```
[ ] Crear tabla player_profiles
[ ] Crear tabla player_reviews
[ ] Crear tabla player_achievements
[ ] Crear tabla player_achievement_unlocks
[ ] Crear funciones y triggers
[ ] Poblar achievements iniciales
```

### **FASE 2: APIs** (1 hora)
```
[ ] API perfil público
[ ] API reviews
[ ] API estadísticas
[ ] API logros
[ ] API actualizar perfil
```

### **FASE 3: Página Pública** (2 horas)
```
[ ] Layout del perfil
[ ] Sección estadísticas
[ ] Sección logros
[ ] Sección reviews
[ ] Sección entrenadores
[ ] Responsive design
```

### **FASE 4: Dashboard Privado** (2 horas)
```
[ ] Mejorar overview
[ ] Sección mis clases
[ ] Sección mi progreso
[ ] Sección mis logros
[ ] Sección mi perfil
[ ] Configuración privacidad
```

### **FASE 5: Testing** (30 min)
```
[ ] Test crear perfil
[ ] Test dejar review
[ ] Test desbloquear logros
[ ] Test privacidad
[ ] Test responsive
```

---

## 🎯 RESULTADO FINAL

### **Jugador tendrá:**

✅ **Perfil público impresionante** para compartir con orgullo
✅ **Dashboard completo** para gestionar toda su actividad
✅ **Sistema de logros** que motiva a seguir entrenando
✅ **Reviews de entrenadores** que validan su progreso
✅ **Estadísticas detalladas** de su evolución
✅ **Control total** de su privacidad

### **Entrenadores verán:**

✅ Historial y compromiso del jugador antes de aceptar
✅ Feedback de otros entrenadores
✅ Nivel real y objetivos del jugador
✅ Forma de contactar y reservar

---

**🎾 ¿Empezamos con la FASE 1 (Base de Datos)?**
