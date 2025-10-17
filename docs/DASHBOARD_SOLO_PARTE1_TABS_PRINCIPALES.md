# 📊 DASHBOARD DEL ENTRENADOR - PARTE 1: TABS PRINCIPALES

## 🎯 ALCANCE DE ESTE PROYECTO

**IMPORTANTE:** Este proyecto es SOLO el Dashboard del Entrenador.

**INCLUYE:**
- ✅ Dashboard del entrenador (8 tabs)
- ✅ Gestión de reservas
- ✅ Calendario
- ✅ Estadísticas
- ✅ Gestión de alumnos
- ✅ Finanzas

**NO INCLUYE (por ahora):**
- ❌ Perfil público del entrenador (ya existe)
- ❌ Dashboard del alumno/jugador
- ❌ Proceso de reserva del alumno (ya existe)
- ❌ Sistema de mensajería (ya existe)

---

## 📊 **TAB 1: RESUMEN** (Vista Principal)

### **Objetivo:**
Dar al entrenador una vista rápida de lo más importante al abrir el dashboard.

### **Componentes:**

#### **1. HEADER DEL DASHBOARD**
```
┌────────────────────────────────────────────────────────────┐
│ Dashboard Entrenador                   [Ver perfil] [Logout]│
│ Bienvenido, Álvaro Vinilo                                   │
│                                                             │
│ [Resumen] [Calendario] [Reservas] [Alumnos]                │
│ [Disponibilidad] [Finanzas] [Mensajes] [Configuración]     │
└────────────────────────────────────────────────────────────┘
```

**Elementos:**
- Título "Dashboard Entrenador"
- Saludo personalizado con nombre del usuario
- 8 tabs de navegación
- Botón "Ver perfil" → Abre perfil público en nueva pestaña
- Botón "Logout" → Cerrar sesión

---

#### **2. KPIs PRINCIPALES (4 Cards)**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 👥 45        │ 📅 12        │ 💰 €1,240    │ ⭐ 4.8       │
│ ALUMNOS      │ ESTA SEMANA  │ ESTE MES     │ RATING       │
│ Total        │ Próximas     │ Ganado       │ (24 reviews) │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Card 1: Total Alumnos**
- Icono: 👥 (Users)
- Número grande: 45
- Texto: "Alumnos"
- Subtexto: "Total"
- Query: `COUNT(DISTINCT player_id) FROM bookings WHERE coach_id = current_user AND status = 'completed'`

**Card 2: Próximas Clases**
- Icono: 📅 (Calendar)
- Número grande: 12
- Texto: "Esta semana"
- Subtexto: "Próximas"
- Query: `COUNT(*) FROM bookings WHERE coach_id = current_user AND booking_date >= TODAY AND booking_date <= END_OF_WEEK AND status IN ('pending', 'confirmed')`

**Card 3: Ingresos del Mes**
- Icono: 💰 (DollarSign)
- Número grande: €1,240
- Texto: "Este mes"
- Subtexto: "Ganado"
- Query: `SUM(total_price * 0.85) FROM bookings WHERE coach_id = current_user AND status = 'completed' AND booking_date >= START_OF_MONTH`
- Nota: Multiplicar por 0.85 porque Padeliner cobra 15% comisión

**Card 4: Rating Promedio**
- Icono: ⭐ (Star)
- Número grande: 4.8
- Texto: "Rating"
- Subtexto: "(24 reviews)"
- Query: `AVG(rating) FROM bookings WHERE coach_id = current_user AND rating IS NOT NULL`

---

#### **3. WIDGET: PRÓXIMAS CLASES**

```
┌─────────────────────────────────────────────────────┐
│ 📅 Próximas clases                    [Ver todas →] │
├─────────────────────────────────────────────────────┤
│ HOY 17:00                                            │
│ 🎾 María González                                    │
│ Individual • Valencia Padel Center                   │
│ [Confirmar] [Ver detalles] [Contactar]              │
├─────────────────────────────────────────────────────┤
│ HOY 19:00                                            │
│ 👥 Clase Grupal (4 personas)                         │
│ A domicilio                                          │
│ [Confirmar] [Ver detalles]                          │
├─────────────────────────────────────────────────────┤
│ MAÑANA 10:00                                         │
│ 🎾 Carlos Pérez                                      │
│ Individual • Valencia Padel Center                   │
│ [Confirmar] [Ver detalles] [Contactar]              │
└─────────────────────────────────────────────────────┘
```

**Funcionalidad:**
- Muestra las próximas 3-5 clases (HOY y MAÑANA)
- Query: `SELECT * FROM bookings WHERE coach_id = current_user AND booking_date IN (TODAY, TOMORROW) AND status IN ('pending', 'confirmed') ORDER BY booking_date, start_time LIMIT 5`
- Icono según tipo: 🎾 Individual, 👥 Grupal
- Muestra: Hora, Nombre del alumno, Tipo, Ubicación
- Botones rápidos:
  - **Confirmar**: Si status = 'pending'
  - **Ver detalles**: Abre modal con info completa
  - **Contactar**: Abre chat con el alumno

---

#### **4. WIDGET: NUEVAS SOLICITUDES**

```
┌─────────────────────────────────────────────────────┐
│ 🔔 Nuevas solicitudes (3)             [Ver todas →] │
├─────────────────────────────────────────────────────┤
│ Laura Martínez                        Hace 2h       │
│ Lun 20 Ene, 18:00-19:00 • Individual • €45         │
│ 💬 "Quiero mejorar mi derecha"                      │
│ [✓ ACEPTAR] [✕ RECHAZAR] [Ver perfil]              │
├─────────────────────────────────────────────────────┤
│ Pedro Sánchez                         Hace 5h       │
│ Mar 21 Ene, 17:00-18:30 • Grupal (2) • €60         │
│ [✓ ACEPTAR] [✕ RECHAZAR] [Ver perfil]              │
└─────────────────────────────────────────────────────┘
```

**Funcionalidad:**
- Solo muestra reservas con status = 'pending'
- Query: `SELECT * FROM bookings WHERE coach_id = current_user AND status = 'pending' ORDER BY created_at DESC LIMIT 3`
- Muestra: Nombre alumno, tiempo desde creación, fecha/hora clase, tipo, precio
- Si hay player_notes, mostrarlas
- Botones:
  - **✓ ACEPTAR**: Cambia status a 'confirmed', envía notificación al alumno
  - **✕ RECHAZAR**: Cambia status a 'cancelled', procesa reembolso, notifica alumno
  - **Ver perfil**: Abre perfil del alumno (si existe perfil de jugador)

---

#### **5. GRÁFICO: CLASES DEL MES**

```
┌─────────────────────────────────────────────────────┐
│ 📈 Clases este mes                                   │
│                                                      │
│ 15│         ●                                       │
│ 10│    ●         ●                                  │
│  5│ ●                  ●                            │
│   └────────────────────────────────                │
│    L  M  M  J  V  S  D  L  M  M  J                 │
└─────────────────────────────────────────────────────┘
```

**Funcionalidad:**
- Gráfico de líneas/puntos con clases por día
- Últimos 11 días del mes actual
- Query: Contar clases completadas por fecha en el último mes
- Librería sugerida: Recharts

---

## 📅 **TAB 2: CALENDARIO**

### **Objetivo:**
Vista visual tipo Google Calendar para ver todas las clases programadas.

### **Componentes:**

#### **1. CONTROLES DEL CALENDARIO**

```
┌────────────────────────────────────────────────────┐
│ Enero 2025        [← Ant] [Hoy] [Sig →]           │
│                                                    │
│ [Día] [Semana] [Mes]              [+ Bloquear]    │
└────────────────────────────────────────────────────┘
```

**Elementos:**
- Mes/Año actual
- Botones navegación: Anterior, Hoy, Siguiente
- Toggle vista: Día / Semana / Mes
- Botón "Bloquear" → Abre modal para bloquear fechas

---

#### **2. VISTA SEMANAL (Por defecto)**

```
┌──────────────────────────────────────────────────────────┐
│      LUN 20   MAR 21   MIE 22   JUE 23   VIE 24   SAB 25│
├──────────────────────────────────────────────────────────┤
│ 08:00                                                     │
│ 09:00                                                     │
│ 10:00  ┌───────┐           ┌───────┐  ┌───────┐         │
│        │ María │           │Carlos │  │ Pedro │         │
│        │  🟢   │           │  🟢   │  │  🟢   │         │
│ 11:00  └───────┘           └───────┘  └───────┘         │
│ 12:00                                                     │
│ 13:00                                                     │
│ 14:00                                                     │
│ 15:00                                                     │
│ 16:00              ┌───────┐                             │
│                    │ Laura │                             │
│ 17:00  ┌───────┐  │  🟡   │  ┌───────┐  ┌──────┐       │
│        │ Juan  │  └───────┘  │  Ana  │  │Grupo │       │
│        │  🟢   │              │  🟢   │  │ 🟢   │       │
│ 18:00  └───────┘              └───────┘  └──────┘       │
│ 19:00  ┌───────┐                                         │
│        │ Sofía │                                         │
│        │  🟢   │                                         │
│ 20:00  └───────┘                                         │
│ 21:00                                                     │
└──────────────────────────────────────────────────────────┘
```

**Características:**
- Grid de horas (08:00 - 21:00 configurable)
- Columnas para cada día de la semana
- Bloques visuales para cada clase

**Cada bloque de clase muestra:**
- Nombre del alumno
- Indicador de estado (color)
  - 🟢 Verde = Confirmada
  - 🟡 Amarillo = Pendiente
  - 🔴 Rojo = Cancelada
  - ⚫ Gris = Fecha bloqueada

**Interacciones:**
- **Click en clase**: Abre modal con detalles completos
- **Click en espacio vacío**: "¿Quieres bloquear este horario?"
- **Hover sobre clase**: Muestra tooltip con info rápida
- **Drag & drop**: (Opcional fase 2) Mover clase a otro horario

---

#### **3. VISTA MENSUAL**

```
┌─────────────────────────────────────────────────────┐
│             ENERO 2025                              │
├─────┬─────┬─────┬─────┬─────┬─────┬─────┐         │
│ LUN │ MAR │ MIE │ JUE │ VIE │ SAB │ DOM │         │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤         │
│     │     │  1  │  2  │  3  │  4  │  5  │         │
│     │     │     │ 2   │ 3   │ 1   │     │         │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤         │
│  6  │  7  │  8  │  9  │ 10  │ 11  │ 12  │         │
│ 4   │ 5   │ 3   │ 2   │ 6   │ 2   │     │         │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤         │
│ 13  │ 14  │ 15  │ 16  │ 17  │ 18  │ 19  │         │
│ 3   │ 4   │ 🚫  │ 🚫  │ 🚫  │ 2   │ 1   │         │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘         │
```

**Características:**
- Muestra número de clases por día
- 🚫 = Día bloqueado completo
- Colores de fondo según cantidad de clases
- Click en día → Cambia a vista diaria de ese día

---

#### **4. MODAL: BLOQUEAR FECHA**

```
┌────────────────────────────────────────┐
│    Bloquear Fecha                      │
├────────────────────────────────────────┤
│ TIPO DE BLOQUEO:                       │
│ ○ Todo el día                          │
│ ● Rango de horas                       │
│                                        │
│ FECHA:                                 │
│ [📅 25 Enero 2025]                     │
│                                        │
│ HORARIO: (solo si rango de horas)     │
│ Desde: [16:00 ▼]                       │
│ Hasta: [20:00 ▼]                       │
│                                        │
│ MOTIVO (opcional):                     │
│ [Torneo provincial_______________]     │
│                                        │
│ ⚠️  Ya tienes 2 clases en esta fecha: │
│     • 10:00 - María González          │
│     • 11:00 - Carlos Pérez            │
│                                        │
│ [Cancelar] [Bloquear y avisar alumnos]│
└────────────────────────────────────────┘
```

---

## 📋 **TAB 3: RESERVAS**

### **Objetivo:**
Lista completa y gestión de todas las reservas (pendientes, confirmadas, completadas, canceladas).

### **Componentes:**

#### **1. FILTROS Y BÚSQUEDA**

```
┌────────────────────────────────────────────────────┐
│ 🔍 Buscar por nombre del alumno...                 │
└────────────────────────────────────────────────────┘

Filtrar por estado:
[Todas (164)] [🟡 Pendientes (3)] [✅ Confirmadas (12)] 
[✅ Completadas (142)] [❌ Canceladas (7)]

Filtrar por fecha:
[Últimos 30 días ▼]    [Todos los tipos ▼]
```

**Funcionalidades:**
- Búsqueda en tiempo real por nombre de alumno
- Tabs para filtrar por estado
- Dropdown fecha: Hoy, Esta semana, Este mes, Últimos 30 días, Todo
- Dropdown tipo: Todos, Individual, Grupal

---

#### **2. LISTA DE RESERVAS**

**RESERVA PENDIENTE (Esperando confirmación):**
```
┌────────────────────────────────────────────────────┐
│ 🟡 PENDIENTE                         Hace 2h       │
│                                                    │
│ Laura Martínez                                     │
│ Lun 20 Ene 2025, 18:00-19:00 (60 minutos)        │
│ 🎾 Individual • Valencia Padel Center • €45       │
│                                                    │
│ 💬 Nota de Laura:                                  │
│ "Quiero mejorar especialmente mi derecha y el     │
│  juego cerca de la red. Tengo problemas con       │
│  el smash."                                        │
│                                                    │
│ [✓ CONFIRMAR] [✕ RECHAZAR] [💬 MENSAJE] [📋 VER] │
└────────────────────────────────────────────────────┘
```

**RESERVA CONFIRMADA:**
```
┌────────────────────────────────────────────────────┐
│ ✅ CONFIRMADA                                      │
│                                                    │
│ María González                                     │
│ Hoy 17:00-18:00 (60 minutos)                      │
│ 🎾 Individual • Valencia Padel Center • €45       │
│ 💳 Pagado                                          │
│                                                    │
│ [✓ COMPLETAR] [❌ CANCELAR] [💬 MENSAJE] [📋 VER] │
└────────────────────────────────────────────────────┘
```

**RESERVA COMPLETADA:**
```
┌────────────────────────────────────────────────────┐
│ ✅ COMPLETADA                    15 Ene 2025      │
│                                                    │
│ Carlos Pérez                     ⭐⭐⭐⭐⭐ 5.0    │
│ 💬 "Excelente clase, mejoré mucho mi técnica.     │
│     ¡Muy paciente y profesional!"                  │
│                                                    │
│ 🎾 Individual • 60 min • €45 • ✅ Pagado          │
│                                                    │
│ [📋 Ver detalles completos]                        │
└────────────────────────────────────────────────────┘
```

**RESERVA CANCELADA:**
```
┌────────────────────────────────────────────────────┐
│ ❌ CANCELADA                     12 Ene 2025      │
│                                                    │
│ Laura Martínez                                     │
│ Cancelada por: Entrenador                          │
│ Motivo: "Enfermedad"                               │
│ Reembolso: €45.00 ✅ Procesado                    │
│                                                    │
│ [📋 Ver detalles]                                  │
└────────────────────────────────────────────────────┘
```

---

#### **3. MODAL: DETALLES COMPLETOS DE RESERVA**

```
┌─────────────────────────────────────────────────────┐
│              DETALLES DE LA RESERVA                 │
├─────────────────────────────────────────────────────┤
│ ESTADO: ✅ Confirmada                               │
│                                                     │
│ ══════════════════════════════════════════════════ │
│                                                     │
│ 📅 FECHA Y HORA                                     │
│ Lunes 20 Enero 2025                                 │
│ 18:00 - 19:00 (60 minutos)                         │
│                                                     │
│ 👤 ALUMNO                                           │
│ [Foto] María González                               │
│        📧 maria.gonzalez@email.com                  │
│        📱 +34 612 345 678                           │
│        🎾 Nivel: Intermedio                         │
│        📚 Clases previas conmigo: 5                 │
│                                                     │
│        [Ver perfil completo] [💬 Enviar mensaje]    │
│                                                     │
│ 🎾 TIPO DE CLASE                                    │
│ Individual (1 persona)                              │
│                                                     │
│ 📍 UBICACIÓN                                        │
│ Valencia Padel Center                               │
│ Calle Ejemplo 123, Valencia                         │
│ [🗺️ Ver en Google Maps]                            │
│                                                     │
│ 💰 PRECIO Y PAGO                                    │
│ Precio por hora: €45.00                             │
│ Duración: 60 min                                    │
│ Total: €45.00                                       │
│ Estado pago: ✅ Pagado con tarjeta                  │
│ Recibirás: €38.25 (después de 15% comisión)        │
│ Fecha de pago: 24h después de completar            │
│                                                     │
│ 📝 NOTAS DEL ALUMNO                                 │
│ "Quiero trabajar especialmente la derecha y el     │
│  juego cerca de la red. Tengo algunos problemas    │
│  con el smash y me gustaría mejorar la táctica."   │
│                                                     │
│ 📝 MIS NOTAS PRIVADAS                               │
│ [Solo tú puedes ver estas notas]                   │
│ ┌─────────────────────────────────────────┐        │
│ │ Trabajar especialmente:                  │        │
│ │ - Derecha                                │        │
│ │ - Volea                                  │        │
│ │                                          │        │
│ └─────────────────────────────────────────┘        │
│ [Guardar notas]                                     │
│                                                     │
│ ══════════════════════════════════════════════════ │
│                                                     │
│ [✓ Completar clase] [❌ Cancelar] [Cerrar]         │
└─────────────────────────────────────────────────────┘
```

---

**ACCIONES DISPONIBLES SEGÚN ESTADO:**

**Si PENDIENTE:**
- ✓ Confirmar → Cambia a 'confirmed', notifica alumno
- ✕ Rechazar → Modal pidiendo razón, procesa reembolso

**Si CONFIRMADA:**
- ✓ Completar → Modal de confirmación, libera pago
- ❌ Cancelar → Modal con razón, procesa reembolso
- 💬 Mensaje → Abre chat

**Si COMPLETADA:**
- 📋 Ver detalles solo lectura
- Ver valoración si existe

**Si CANCELADA:**
- 📋 Ver detalles solo lectura
