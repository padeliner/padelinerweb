# 🏗️ Arquitectura del Sistema de Mensajería Padeliner

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Base de Datos](#base-de-datos)
3. [API Endpoints](#api-endpoints)
4. [Componentes UI](#componentes-ui)
5. [Flujos de Trabajo](#flujos-de-trabajo)
6. [Features](#features)
7. [Plan de Implementación](#plan-de-implementación)

---

## 🎯 Visión General

Sistema de gestión de mensajería profesional tipo Gmail/Zendesk para gestionar todas las comunicaciones con clientes a través de emails, formularios de contacto y solicitudes de empleo.

### Objetivos:
- ✅ Centralizar toda la comunicación con clientes
- ✅ Asignación automática por equipos
- ✅ Colaboración entre agentes
- ✅ Métricas y SLAs
- ✅ Interfaz intuitiva tipo Gmail

---

## 🗄️ Base de Datos

### 1. **teams** - Equipos de trabajo
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- Soporte, Ventas, RH, General
  slug TEXT UNIQUE NOT NULL, -- support, sales, hr, general
  description TEXT,
  email TEXT, -- soporte@padeliner.com, ventas@padeliner.com
  color TEXT DEFAULT '#059669', -- Color para UI
  icon TEXT DEFAULT 'mail', -- Icono
  auto_assign BOOLEAN DEFAULT true, -- Auto-asignar conversaciones
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. **team_members** - Miembros de equipos
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- member, lead, manager
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
```

### 3. **conversations** - Conversaciones agrupadas
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contacto
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  
  -- Clasificación
  subject TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  category TEXT, -- contact, support, sales, careers, general
  source TEXT DEFAULT 'email', -- email, form, chat, whatsapp
  
  -- Asignación
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  
  -- Estado
  status TEXT DEFAULT 'new', -- new, open, pending, solved, closed
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Tags
  tags TEXT[] DEFAULT '{}',
  
  -- Métricas
  first_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  first_response_at TIMESTAMPTZ, -- Primera respuesta de agente
  closed_at TIMESTAMPTZ,
  
  -- Contadores
  message_count INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0, -- Mensajes sin leer del cliente
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_conversations_team ON conversations(team_id);
CREATE INDEX idx_conversations_assigned ON conversations(assigned_to);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_contact ON conversations(contact_email);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_tags ON conversations USING GIN(tags);
```

### 4. **messages** - Mensajes de conversaciones
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Remitente/Destinatario
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  cc_emails TEXT[] DEFAULT '{}',
  bcc_emails TEXT[] DEFAULT '{}',
  
  -- Contenido
  subject TEXT,
  content TEXT NOT NULL,
  html_content TEXT,
  
  -- Tipo
  type TEXT DEFAULT 'message', -- message, note, system
  is_internal BOOLEAN DEFAULT false, -- Notas internas
  is_from_customer BOOLEAN DEFAULT true,
  
  -- Metadata
  attachments JSONB DEFAULT '[]',
  headers JSONB DEFAULT '{}',
  raw_email JSONB,
  
  -- Estado
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### 5. **message_templates** - Plantillas de respuesta
```sql
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. **conversation_notes** - Notas internas
```sql
CREATE TABLE conversation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. **conversation_activities** - Log de actividad
```sql
CREATE TABLE conversation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- assigned, status_changed, priority_changed, tag_added, etc.
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_conversation ON conversation_activities(conversation_id);
```

### 8. **saved_replies** - Respuestas rápidas (snippets)
```sql
CREATE TABLE saved_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shortcut TEXT NOT NULL, -- /gracias, /horario, etc.
  content TEXT NOT NULL,
  is_global BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shortcut)
);
```

### 9. **sla_rules** - Service Level Agreements
```sql
CREATE TABLE sla_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  priority TEXT, -- Aplica solo a ciertas prioridades
  first_response_minutes INTEGER, -- Tiempo máximo primera respuesta
  resolution_minutes INTEGER, -- Tiempo máximo resolución
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. **conversation_sla_status** - Estado SLA por conversación
```sql
CREATE TABLE conversation_sla_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sla_rule_id UUID REFERENCES sla_rules(id) ON DELETE SET NULL,
  first_response_due_at TIMESTAMPTZ,
  first_response_breached BOOLEAN DEFAULT false,
  resolution_due_at TIMESTAMPTZ,
  resolution_breached BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### **Conversations**
```
GET    /api/admin/conversations              # Lista conversaciones
GET    /api/admin/conversations/:id          # Detalle conversación
POST   /api/admin/conversations              # Crear conversación
PATCH  /api/admin/conversations/:id          # Actualizar (estado, asignación, etc.)
DELETE /api/admin/conversations/:id          # Archivar conversación

GET    /api/admin/conversations/:id/messages # Mensajes de conversación
POST   /api/admin/conversations/:id/messages # Enviar mensaje
POST   /api/admin/conversations/:id/notes    # Añadir nota interna

GET    /api/admin/conversations/stats        # Estadísticas generales
```

### **Teams**
```
GET    /api/admin/teams                      # Lista equipos
POST   /api/admin/teams                      # Crear equipo
PATCH  /api/admin/teams/:id                  # Actualizar equipo
DELETE /api/admin/teams/:id                  # Eliminar equipo

GET    /api/admin/teams/:id/members          # Miembros del equipo
POST   /api/admin/teams/:id/members          # Añadir miembro
DELETE /api/admin/teams/:id/members/:userId  # Remover miembro
```

### **Templates & Snippets**
```
GET    /api/admin/templates                  # Plantillas
POST   /api/admin/templates                  # Crear plantilla
DELETE /api/admin/templates/:id              # Eliminar plantilla

GET    /api/admin/saved-replies              # Respuestas rápidas
POST   /api/admin/saved-replies              # Crear snippet
```

### **Analytics**
```
GET    /api/admin/analytics/overview         # Overview general
GET    /api/admin/analytics/team/:id         # Stats por equipo
GET    /api/admin/analytics/agent/:id        # Stats por agente
GET    /api/admin/analytics/sla              # SLA compliance
```

---

## 🎨 Componentes UI

### **Layout Principal**
```
/admin/inbox
├── Sidebar (equipos, filtros, tags)
├── ConversationList (lista de conversaciones)
└── ConversationDetail (conversación seleccionada)
    ├── Header (contacto, asignar, estado)
    ├── MessageThread (mensajes)
    ├── ReplyBox (editor de respuesta)
    └── Sidebar (notas, actividad, info)
```

### **Componentes Clave**

1. **InboxSidebar**
   - Filtros (Inbox, Míos, Equipo, Sin asignar)
   - Equipos
   - Estados
   - Tags
   - Búsqueda guardada

2. **ConversationList**
   - Item de conversación
   - Indicadores (sin leer, prioridad, SLA)
   - Selección múltiple
   - Infinite scroll

3. **ConversationDetail**
   - Timeline de mensajes
   - Notas internas colapsadas
   - Respuestas citadas
   - Attachments inline

4. **ReplyEditor**
   - Rich text editor (TipTap)
   - Snippets con autocompletado
   - Plantillas
   - Attachments
   - Send options (enviar + cerrar, enviar + pendiente)

5. **QuickActions**
   - Asignar a agente
   - Cambiar estado
   - Cambiar prioridad
   - Añadir tags
   - Marcar como spam

---

## 🔄 Flujos de Trabajo

### 1. **Email Entrante → Conversación**
```
Email llega a contact@padeliner.com
    ↓
Cloudflare Worker → Webhook
    ↓
API busca conversación existente por contact_email
    ↓
Si existe: Añade mensaje a conversación
Si no: Crea nueva conversación
    ↓
Auto-asigna a equipo según email destino
    ↓
Notifica a agentes del equipo
    ↓
Inicia SLA timer
```

### 2. **Agente Responde**
```
Agente escribe respuesta
    ↓
Preview en tiempo real
    ↓
Enviar vía Resend API
    ↓
Guardar mensaje en BD
    ↓
Actualizar conversation.last_message_at
    ↓
Marcar first_response_at si es primera respuesta
    ↓
Cambiar estado a 'open'
```

### 3. **Auto-Asignación**
```
Nueva conversación creada
    ↓
Detectar equipo por email destino
    ↓
Buscar agente disponible del equipo
    ↓
Round-robin o menos carga
    ↓
Asignar conversación
    ↓
Notificar agente
```

---

## ⚡ Features

### **Core Features (MVP)**
- [x] Inbox unificado
- [x] Conversaciones agrupadas
- [x] Asignación manual
- [x] Responder con editor rico
- [x] Estados básicos
- [x] Filtros básicos

### **Advanced Features**
- [ ] Auto-asignación inteligente
- [ ] Notas internas
- [ ] Tags personalizables
- [ ] Plantillas de respuesta
- [ ] Snippets con shortcuts
- [ ] Búsqueda full-text
- [ ] SLA tracking
- [ ] Colisión de respuestas
- [ ] @Menciones
- [ ] Attachments

### **Analytics & Reports**
- [ ] Dashboard de métricas
- [ ] Tiempo de respuesta promedio
- [ ] Tasa de resolución
- [ ] Volumen por equipo
- [ ] Performance de agentes
- [ ] Exportar reportes

### **Automation**
- [ ] Respuestas automáticas
- [ ] Reglas de asignación
- [ ] Escalación automática
- [ ] Cierre automático inactivos
- [ ] Macros (acciones batch)

---

## 📅 Plan de Implementación

### **Sprint 1: Base de Datos y API Core (Semana 1)**
1. Crear todas las tablas con RLS policies
2. API de conversaciones CRUD
3. API de mensajes
4. API de equipos
5. Webhook actualizado para crear conversaciones

### **Sprint 2: UI Básico (Semana 1-2)**
1. Layout principal inbox
2. Sidebar con filtros
3. Lista de conversaciones
4. Vista detalle conversación
5. Editor de respuesta básico

### **Sprint 3: Features Avanzados (Semana 2-3)**
1. Auto-asignación
2. Notas internas
3. Tags y prioridades
4. Plantillas de respuesta
5. Búsqueda

### **Sprint 4: Polish y Analytics (Semana 3-4)**
1. SLA tracking
2. Dashboard de métricas
3. Keyboard shortcuts
4. Optimizaciones de performance
5. Testing completo

---

## 🎯 Métricas de Éxito

- ⚡ Tiempo de primera respuesta < 2 horas
- 📊 Tasa de resolución > 90%
- 👥 Máx 20 conversaciones por agente
- 🎨 UI loading time < 1s
- ✅ SLA compliance > 95%

---

## 🔒 Seguridad y Permisos

### RLS Policies:
- Admins: Ver todas las conversaciones
- Team Leads: Ver conversaciones de su equipo
- Agents: Ver solo conversaciones asignadas + equipo

### Audit Log:
- Registrar todas las acciones importantes
- Quién hizo qué y cuándo
- Trazabilidad completa

---

## 🚀 Siguientes Pasos

1. ✅ Revisar y aprobar arquitectura
2. 🔨 Crear migraciones SQL
3. 🔧 Implementar APIs
4. 🎨 Construir UI
5. 🧪 Testing
6. 📊 Analytics
7. 🤖 Automatizaciones

---

**¿Listo para empezar la construcción?** 🎾✨
