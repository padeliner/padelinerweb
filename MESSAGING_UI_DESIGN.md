# 🎨 Diseño UI - Sistema de Mensajería

## 📐 Layout Principal

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [🎾 Padeliner]  Mensajería  │  [🔍 Buscar conversaciones...]  [@user] [⚙️]      │
├────────────────────────────────────────────────────────────────────────────────┤
│                │                                  │                              │
│  SIDEBAR       │  LISTA CONVERSACIONES            │  DETALLE CONVERSACIÓN        │
│  (240px)       │  (400px)                         │  (resto)                     │
│                │                                  │                              │
│ ┌──────────┐  │ ┌──────────────────────────────┐ │ ┌──────────────────────────┐│
│ │ FILTROS  │  │ │ ● Juan Pérez          5 min  │ │ │ 👤 Juan Pérez            ││
│ │          │  │ │   "Problema con reserva"     │ │ │    juan@email.com        ││
│ │ 📥 Inbox │  │ │   [soporte] [urgente]        │ │ │    +34 600 123 456       ││
│ │   (45)   │  │ │                              │ │ │                          ││
│ │          │  │ ├──────────────────────────────┤ │ │ Estado: [Abierto ▼]      ││
│ │ 👤 Míos  │  │ │ ○ Ana García          2h     │ │ │ Prioridad: [Normal ▼]    ││
│ │   (12)   │  │ │   "Información entrenadores" │ │ │ Asignado: [@yo ▼]        ││
│ │          │  │ │   [ventas] [normal]          │ │ │                          ││
│ │ 👥 Equipo│  │ │                              │ │ ├──────────────────────────┤│
│ │   (33)   │  │ ├──────────────────────────────┤ │ │                          ││
│ │          │  │ │ ○ Carlos Ruiz         1d     │ │ │ MENSAJES                 ││
│ │ 📂 Sin   │  │ │   "Pregunta sobre clubes"    │ │ │                          ││
│ │ asignar  │  │ │   [general]                  │ │ │ [Cliente] hace 5 min     ││
│ │   (8)    │  │ │                              │ │ │ Hola, tengo un problema  ││
│ │          │  │ └──────────────────────────────┘ │ │ con mi reserva...        ││
│ ├──────────┤  │                                  │ │                          ││
│ │ EQUIPOS  │  │ [1] [2] [3] ... [10]            │ │ [Yo] hace 2 min          ││
│ │          │  │                                  │ │ Hola Juan, lamento el    ││
│ │ 💬 Sopor │  │                                  │ │ inconveniente...         ││
│ │ 💼 Ventas│  │                                  │ │                          ││
│ │ 👥 RH    │  │                                  │ │ [📎 Nota interna]        ││
│ │ 📧 Gener │  │                                  │ │ Cliente enfadado, priorizar││
│ │          │  │                                  │ │                          ││
│ ├──────────┤  │                                  │ ├──────────────────────────┤│
│ │ ESTADOS  │  │                                  │ │                          ││
│ │          │  │                                  │ │ [💬 Responder]           ││
│ │ 🆕 Nuevos│  │                                  │ │ ┌──────────────────────┐ ││
│ │ ✅ Abier │  │                                  │ │ │ Escribe tu mensaje...│ ││
│ │ ⏸️ Pendi │  │                                  │ │ │                      │ ││
│ │ ✓ Resuel │  │                                  │ │ │ [B] [I] [Link] [📎] │ ││
│ │ 📁 Cerra │  │                                  │ │ └──────────────────────┘ ││
│ │          │  │                                  │ │ [/snippets] [📋 Template]││
│ ├──────────┤  │                                  │ │                          ││
│ │ TAGS     │  │                                  │ │ [Enviar] [Enviar+Cerrar] ││
│ │          │  │                                  │ │                          ││
│ │ + Crear  │  │                                  │ └──────────────────────────┘│
│ │          │  │                                  │                              │
│ └──────────┘  │                                  │ SIDEBAR DERECHO              │
│                │                                  │ ┌──────────────────────────┐│
│                │                                  │ │ 📋 NOTAS (2)             ││
│                │                                  │ │ Cliente VIP              ││
│                │                                  │ │ - @ana revisar historial ││
│                │                                  │ ├──────────────────────────┤│
│                │                                  │ │ 📊 ACTIVIDAD             ││
│                │                                  │ │ • Asignado a @yo         ││
│                │                                  │ │ • Estado → Abierto       ││
│                │                                  │ │ • Tag agregado: VIP      ││
│                │                                  │ └──────────────────────────┘│
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes Detallados

### 1. **Conversation List Item**

```
┌─────────────────────────────────────────────────┐
│ ● Juan Pérez                           5 min    │ ← Sin leer (●)
│   "Re: Problema con la reserva"                 │ ← Subject
│   Gracias por tu respuesta, pero sigo...        │ ← Preview
│   [💬 Soporte] [🔥 Urgente] [@yo]               │ ← Badges
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← SLA timer (rojo si breach)
└─────────────────────────────────────────────────┘

Estados visuales:
● Punto verde = Sin leer
○ Punto blanco = Leído
🔴 Borde rojo = SLA breached
🟡 Fondo amarillo = Prioridad alta
```

### 2. **Message Thread**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Cliente Icon]  Juan Pérez                     │
│  hace 2 horas    juan@email.com                 │
│                                                 │
│  Hola, tengo un problema con mi reserva         │
│  de la pista 3 para mañana a las 10:00.         │
│  ¿Pueden ayudarme?                              │
│                                                 │
│  [Responder] [Reenviar] [...]                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│                  [Yo Icon]  Álvaro (Soporte)    │
│                  hace 1 hora                    │
│                                                 │
│  Hola Juan, lamento el inconveniente.           │
│  ¿Puedes darme el número de reserva?            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  📎 NOTA INTERNA (solo para equipo)             │
│  @ana Este cliente es VIP, dar prioridad        │
│  - Álvaro, hace 30 min                          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Cliente Icon]  Juan Pérez                     │
│  hace 5 min      juan@email.com                 │
│                                                 │
│  Sí, es la reserva #12345                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3. **Reply Editor**

```
┌─────────────────────────────────────────────────┐
│ De: Soporte Padeliner <no-reply@padeliner.com> │
│ Para: juan@email.com                            │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ [B] [I] [U] [🔗] [📷] [📎] [😊] [/snippet]  │ │
│ ├─────────────────────────────────────────────┤ │
│ │                                             │ │
│ │ Hola Juan,                                  │ │
│ │                                             │ │
│ │ Ya he revisado tu reserva...                │ │
│ │                                             │ │
│ │ ────────────────                            │ │
│ │ Álvaro                                      │ │
│ │ Equipo de Soporte                           │ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [📋 Template ▼] [/gracias] → Snippet           │
│                                                 │
│ [Adjuntar]  [Vista previa]                      │
│                                                 │
│ ┌───────────────────────────┐                   │
│ │ [Enviar]                  │                   │
│ │ [Enviar y Cerrar]         │                   │
│ │ [Enviar y Marcar Pendiente│                   │
│ │ [Guardar Borrador]        │                   │
│ └───────────────────────────┘                   │
└─────────────────────────────────────────────────┘
```

### 4. **Sidebar Filters**

```
┌─────────────────────┐
│ 🔍 Buscar...        │
├─────────────────────┤
│ VISTAS              │
│ ☐ Sin leer (12)     │
│ ☐ Míos (8)          │
│ ☐ Mi equipo (33)    │
│ ☐ Sin asignar (5)   │
│ ☐ Marcados (3)      │
├─────────────────────┤
│ EQUIPOS             │
│ 💬 Soporte (24)     │
│ 💼 Ventas (15)      │
│ 👥 RH (6)           │
│ 📧 General (12)     │
├─────────────────────┤
│ ESTADOS             │
│ 🆕 Nuevos (8)       │
│ ✅ Abiertos (25)    │
│ ⏸️ Pendientes (10)  │
│ ✓ Resueltos (120)   │
│ 📁 Cerrados (450)   │
├─────────────────────┤
│ PRIORIDAD           │
│ 🔥 Urgente (3)      │
│ 🟡 Alta (12)        │
│ ⚪ Normal (28)      │
│ 🔵 Baja (5)         │
├─────────────────────┤
│ TAGS                │
│ + Crear tag         │
│ 🏷️ VIP (5)          │
│ 🏷️ Bug (3)          │
│ 🏷️ Facturación (8) │
└─────────────────────┘
```

### 5. **Quick Actions Bar**

```
┌─────────────────────────────────────────────────┐
│ ✓ Seleccionados: 3                              │
│                                                 │
│ [👤 Asignar] [📊 Estado] [🏷️ Tags] [🗑️ Archivar]│
│ [⭐ Prioridad] [👥 Equipo] [📋 Macro]           │
└─────────────────────────────────────────────────┘
```

---

## ⌨️ Keyboard Shortcuts

```
NAVEGACIÓN:
j / k       → Conversación anterior/siguiente
o / Enter   → Abrir conversación
/           → Buscar
g i         → Ir a Inbox
g m         → Ir a Míos
g t         → Ir a Equipo

ACCIONES:
r           → Responder
a           → Asignar a mí
e           → Archivar
s           → Marcar como spam
!           → Marcar urgente
t           → Añadir tag
#           → Cambiar estado

COMPOSICIÓN:
Ctrl + Enter → Enviar
Ctrl + B     → Negrita
Ctrl + I     → Cursiva
Ctrl + K     → Link
/            → Snippets
Tab          → Autocompletar snippet
```

---

## 🎨 Design System

### Colores:
```css
/* Estados */
--new: #3b82f6 (azul)
--open: #059669 (verde)
--pending: #f59e0b (naranja)
--solved: #10b981 (verde claro)
--closed: #6b7280 (gris)

/* Prioridades */
--urgent: #ef4444 (rojo)
--high: #f59e0b (naranja)
--normal: #6b7280 (gris)
--low: #3b82f6 (azul)

/* Equipos */
--support: #8b5cf6 (morado)
--sales: #ec4899 (rosa)
--hr: #14b8a6 (teal)
--general: #6b7280 (gris)
```

### Tipografía:
```css
--font-heading: 'Inter', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'Fira Code', monospace;
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
- Solo mostrar lista de conversaciones
- Detalle en modal full-screen

Tablet (768-1024px):
- Sidebar colapsable
- Lista + Detalle

Desktop (> 1024px):
- Layout completo 3 columnas
```

---

## 🚀 Interacciones y Animaciones

### Loading States:
- Skeleton loaders para lista
- Shimmer effect
- Progress bar en envío

### Micro-interactions:
- Hover effects en items
- Smooth transitions
- Badge animations
- Toast notifications

### Real-time Updates:
- Nuevas conversaciones aparecen arriba
- Contador de sin leer actualizado
- Status changes en tiempo real
- "Usuario está escribiendo..."

---

**UI Design completo** ✅

¿Empezamos con la implementación? 🎾
