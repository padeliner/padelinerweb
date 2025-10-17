# 📊 PROPUESTA: Dashboard del Entrenador - Parte 2: DISEÑO UI/UX

## 🎨 ESTRUCTURA GENERAL DEL DASHBOARD

### 📑 TABS DE NAVEGACIÓN
```
┌────────────────────────────────────────────────────────────┐
│  [Resumen] [Calendario] [Reservas] [Alumnos]               │
│  [Disponibilidad] [Finanzas] [Mensajes] [Configuración]    │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 1. TAB: RESUMEN (Overview)

### KPIs Principales
```
┌──────────┬──────────┬──────────┬──────────┐
│ 👥 45    │ 📅 12    │ 💰 €1,240│ ⭐ 4.8   │
│ Alumnos  │ Próximas │ Este mes │ Rating   │
└──────────┴──────────┴──────────┴──────────┘
```

### Widget: Próximas Clases
```
┌─────────────────────────────────────────────┐
│ 📅 Próximas clases          [Ver todas]     │
├─────────────────────────────────────────────┤
│ HOY 17:00 - María González                  │
│ 🎾 Individual • Valencia Padel Center       │
│ [Confirmar] [Detalles] [Contactar]          │
├─────────────────────────────────────────────┤
│ HOY 19:00 - Clase Grupal (4)                │
│ 👥 Grupal • A domicilio                     │
│ [Confirmar] [Detalles]                      │
└─────────────────────────────────────────────┘
```

### Widget: Nuevas Solicitudes
```
┌─────────────────────────────────────────────┐
│ 🔔 Nuevas solicitudes (3)   [Ver todas]     │
├─────────────────────────────────────────────┤
│ Laura Martínez              Hace 2h         │
│ Lun 20 Ene, 18:00 • Individual • €45       │
│ [Aceptar] [Rechazar] [Ver perfil]          │
└─────────────────────────────────────────────┘
```

### Widget: Gráfico de Rendimiento
```
┌─────────────────────────────────────────────┐
│ 📈 Clases este mes                          │
│                                             │
│ 15│        ●                                │
│ 10│   ●        ●                            │
│  5│●              ●                         │
│   └───────────────────                     │
│    L  M  M  J  V  S  D                     │
└─────────────────────────────────────────────┘
```

---

## 📅 2. TAB: CALENDARIO

### Vista Semanal
```
┌──────────────────────────────────────────────────────┐
│ Enero 2025    [← Ant] [Hoy] [Sig →]  [+ Bloquear]   │
│ [Día] [Semana] [Mes]                                 │
├──────────────────────────────────────────────────────┤
│      LUN 20  MAR 21  MIE 22  JUE 23  VIE 24  SAB 25 │
├──────────────────────────────────────────────────────┤
│ 09:00  │       │       │       │       │       │     │
│ 10:00  │ María │       │ Clase │ Pedro │       │     │
│ 11:00  │       │ Carlos│       │       │       │     │
│ 12:00  │       │       │       │       │       │     │
│ 15:00  │       │       │       │       │       │     │
│ 16:00  │       │ Laura │       │       │       │     │
│ 17:00  │ Juan  │       │ Ana   │ Grupo │       │     │
│ 18:00  │       │       │       │       │       │     │
│ 19:00  │ Sofia │       │       │       │       │     │
└──────────────────────────────────────────────────────┘

LEYENDA:
🟢 Confirmada  🟡 Pendiente  🔴 Cancelada
⚪ Disponible  ⚫ Bloqueado
```

### Acciones del Calendario
- **Click en slot vacío** → Bloquear ese horario
- **Click en clase** → Ver detalles completos
- **Drag & drop** → Mover clase (si es posible)
- **Botón "Bloquear"** → Modal para bloquear fechas

---

## 📋 3. TAB: RESERVAS

### Filtros
```
┌────────────────────────────────────────────┐
│ 🔍 Buscar por alumno...                    │
│                                            │
│ [Todas] [Pendientes (3)] [Confirmadas (12)]│
│ [Completadas (156)] [Canceladas (8)]       │
│                                            │
│ Fecha: [Últimos 30 días ▼]                │
└────────────────────────────────────────────┘
```

### Lista de Reservas
```
┌────────────────────────────────────────────┐
│ 🟡 PENDIENTE                    Hace 2h    │
│ Laura Martínez                             │
│ Lun 20 Ene, 18:00-19:00                   │
│ Individual • Valencia Padel • €45          │
│ Nota: "Mejorar derecha"                    │
│ [✓ Confirmar] [✕ Rechazar] [💬 Mensaje]   │
├────────────────────────────────────────────┤
│ 🟢 CONFIRMADA                              │
│ María González                             │
│ Hoy 17:00-18:00                           │
│ Individual • Valencia Padel • €45          │
│ [Completar] [Cancelar] [💬 Mensaje]       │
├────────────────────────────────────────────┤
│ ✅ COMPLETADA              15 Ene 2025    │
│ Carlos Pérez               ⭐⭐⭐⭐⭐       │
│ "Excelente clase"                          │
│ Individual • €45 • Pagado                  │
│ [Ver detalles]                             │
└────────────────────────────────────────────┘
```

### Modal: Detalles de Reserva
```
┌────────────────────────────────────────────┐
│         Detalles de Reserva                │
├────────────────────────────────────────────┤
│ ESTADO: 🟢 Confirmada                      │
│                                            │
│ 📅 FECHA Y HORA                            │
│ Lunes 20 Enero 2025                        │
│ 18:00 - 19:00 (60 min)                    │
│                                            │
│ 👤 ALUMNO                                  │
│ [Foto] María González                      │
│        Nivel: Intermedio                   │
│        Clases previas: 5                   │
│        [Ver perfil] [Mensaje]              │
│                                            │
│ 🎾 TIPO                                    │
│ Individual                                 │
│                                            │
│ 📍 UBICACIÓN                               │
│ Valencia Padel Center                      │
│ Calle Ejemplo 123                          │
│ [Ver mapa]                                 │
│                                            │
│ 💰 PRECIO                                  │
│ €45.00 - ✅ Pagado                        │
│                                            │
│ 📝 NOTAS DEL ALUMNO                        │
│ "Mejorar especialmente la derecha"        │
│                                            │
│ 📝 MIS NOTAS                               │
│ [Añadir notas privadas...]                │
│                                            │
│ [Completar] [Cancelar] [Reprogramar]      │
└────────────────────────────────────────────┘
```

---

## 👥 4. TAB: ALUMNOS

### Lista
```
┌────────────────────────────────────────────┐
│ Mis Alumnos (45)           🔍 Buscar...    │
│                                            │
│ [Activos (38)] [Inactivos (7)] [Todos]    │
│ Ordenar: [Último contacto ▼]              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ [Foto] María González          ⭐ 5.0     │
│        Nivel: Intermedio                   │
│        Última clase: Ayer                  │
│        Total clases: 24                    │
│        Próxima: Hoy 17:00                  │
│        [Ver] [Mensaje] [Agendar]          │
├────────────────────────────────────────────┤
│ [Foto] Carlos Pérez            ⭐ 4.8     │
│        Nivel: Avanzado                     │
│        Última clase: Hace 3 días           │
│        Total clases: 15                    │
│        Próxima: Mañana 10:00              │
│        [Ver] [Mensaje] [Agendar]          │
└────────────────────────────────────────────┘
```

### Perfil del Alumno
```
┌────────────────────────────────────────────┐
│          María González                    │
│          [Foto]                            │
│          ⭐⭐⭐⭐⭐ 5.0                      │
├────────────────────────────────────────────┤
│ 📊 ESTADÍSTICAS                            │
│ • Total clases: 24                         │
│ • Primera clase: Mar 2024                  │
│ • Última clase: Ayer                       │
│ • Nivel: Intermedio                        │
│ • Asistencia: 96% (23/24)                 │
│                                            │
│ 🎾 OBJETIVOS                               │
│ • Mejorar derecha                          │
│ • Trabajar juego en red                    │
│                                            │
│ 📅 PRÓXIMA CLASE                           │
│ Hoy 17:00 • Valencia Padel                │
│ [Ver] [Cancelar]                          │
│                                            │
│ 📝 MIS NOTAS (Privadas)                    │
│ "Progresa rápido. Trabajar smash."        │
│ [Editar]                                   │
│                                            │
│ 📚 HISTORIAL (24)                          │
│ [Ver completo]                             │
│                                            │
│ [💬 Mensaje] [📅 Agendar clase]           │
└────────────────────────────────────────────┘
```

---

## ⏰ 5. TAB: DISPONIBILIDAD

### Horarios Semanales
```
┌────────────────────────────────────────────┐
│ Mi Disponibilidad         [Guardar cambios]│
├────────────────────────────────────────────┤
│ LUNES                     [✓ Disponible]   │
│ Mañana:  [09:00] - [13:00]  [+ Añadir]    │
│ Tarde:   [16:00] - [21:00]  [✕ Quitar]    │
│                                            │
│ MARTES                    [✓ Disponible]   │
│ Mañana:  [09:00] - [13:00]  [+ Añadir]    │
│ Tarde:   [16:00] - [21:00]  [✕ Quitar]    │
│                                            │
│ (... resto de días ...)                    │
│                                            │
│ DOMINGO                   [✗ No disponible]│
│                           [+ Añadir rango] │
└────────────────────────────────────────────┘
```

### Fechas Bloqueadas
```
┌────────────────────────────────────────────┐
│ Fechas Bloqueadas         [+ Bloquear]     │
├────────────────────────────────────────────┤
│ 25-27 Ene 2025 - Todo el día              │
│ "Vacaciones"              [✕ Eliminar]     │
├────────────────────────────────────────────┤
│ 15 Feb 2025 - 16:00-20:00                 │
│ "Torneo"                  [✕ Eliminar]     │
└────────────────────────────────────────────┘
```

---

## 💰 6. TAB: FINANZAS

### Resumen
```
┌──────────┬──────────┬──────────┬──────────┐
│ ESTE MES │ PENDIENTE│ COBRADO  │ PROMEDIO │
│ €1,240   │  €180    │ €1,060   │ €45/clase│
└──────────┴──────────┴──────────┴──────────┘
```

### Gráfico de Ingresos
```
┌────────────────────────────────────────────┐
│ 📈 Ingresos mensuales (2024-2025)          │
│                                            │
│ 2000│                            ●         │
│ 1500│              ●        ●              │
│ 1000│    ●    ●                            │
│  500│ ●                                    │
│     └────────────────────────              │
│      S O N D E F M A M J J A              │
└────────────────────────────────────────────┘
```

### Transacciones
```
┌────────────────────────────────────────────┐
│ Transacciones              [Exportar CSV]  │
├────────────────────────────────────────────┤
│ 18 Ene - María González                    │
│ Clase individual 60min       +€45.00       │
│ ✅ Pagado via Stripe                       │
├────────────────────────────────────────────┤
│ 17 Ene - Carlos Pérez                      │
│ Clase individual 90min       +€60.00       │
│ ✅ Pagado via Stripe                       │
└────────────────────────────────────────────┘
```

---

## 🔧 7. TAB: CONFIGURACIÓN

### Secciones
```
┌────────────────────────────────────────────┐
│ INFORMACIÓN BÁSICA                         │
│ • Foto de perfil                           │
│ • Nombre, Email, Teléfono                  │
│ • Ubicación                                │
│                                            │
│ INFORMACIÓN PROFESIONAL                    │
│ • Biografía                                │
│ • Experiencia                              │
│ • Certificaciones                          │
│ • Especialidades, Idiomas                  │
│ • Galería                                  │
│                                            │
│ PRECIOS                                    │
│ • Individual: €45/hora                     │
│ • Grupal: €25/persona                      │
│ • Duración mínima: 60 min                  │
│ • Servicio a domicilio: Sí                 │
│                                            │
│ PREFERENCIAS                               │
│ • Zona horaria                             │
│ • Idioma del dashboard                     │
│ • Notificaciones                           │
│                                            │
│ CUENTA                                     │
│ • Cambiar contraseña                       │
│ • Método de pago (Stripe)                  │
│ • Pausar perfil                            │
│ • Eliminar cuenta                          │
└────────────────────────────────────────────┘
```
