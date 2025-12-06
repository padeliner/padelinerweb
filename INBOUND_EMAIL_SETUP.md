# 📧 Configuración de Emails Entrantes (Inbound Email)

## 🎯 Objetivo
Recibir emails en direcciones `@padeliner.com` y gestionarlos desde el panel de admin.

---

## 📋 Requisitos Previos

1. ✅ Dominio `padeliner.com` verificado en Resend
2. ✅ Variables de entorno configuradas
3. ✅ Migraciones SQL aplicadas en Supabase

---

## 🔧 Paso 1: Configurar Dominio en Resend

### 1.1 Verificar Dominio
1. Ve a https://resend.com/domains
2. Añade `padeliner.com`
3. Configura los registros DNS:
   ```
   Type: TXT
   Name: @
   Value: [valor que te da Resend]
   
   Type: MX
   Name: @
   Priority: 10
   Value: feedback-smtp.resend.com
   ```

### 1.2 Activar Inbound Email
1. En Resend → Settings → Inbound Email
2. Click "Enable Inbound Email"
3. Configura el webhook URL:
   ```
   https://tu-dominio.vercel.app/api/webhooks/inbound-email
   ```
4. Añade el webhook secret en headers:
   ```
   Header: x-webhook-secret
   Value: [tu WEBHOOK_SECRET]
   ```

---

## 🗄️ Paso 2: Aplicar Migraciones SQL

Ejecuta en Supabase SQL Editor:

```sql
-- Copia y pega el contenido de:
supabase/migrations/20250115_create_incoming_emails_table.sql
```

Esto crea:
- ✅ Tabla `incoming_emails` - Emails recibidos
- ✅ Tabla `email_replies` - Respuestas enviadas
- ✅ Políticas RLS para admins
- ✅ Índices para búsquedas rápidas

---

## 🔐 Paso 3: Variables de Entorno

Añade a `.env.local` y Vercel:

```bash
# Resend API Key
RESEND_API_KEY=re_XXXXXXXXXX

# Webhook Secret (genera uno aleatorio)
WEBHOOK_SECRET=tu_clave_secreta_super_segura_aqui

# Email interno
CAREERS_EMAIL=padeliner@gmail.com
```

**Generar webhook secret:**
```bash
openssl rand -base64 32
```

---

## 📮 Paso 4: Configurar Direcciones de Email

En Resend, puedes recibir emails en cualquier dirección de tu dominio:

- ✅ `hola@padeliner.com` - Contacto general
- ✅ `soporte@padeliner.com` - Soporte técnico
- ✅ `ventas@padeliner.com` - Ventas
- ✅ `info@padeliner.com` - Información
- ✅ Cualquier otra dirección

**Todos los emails se reciben automáticamente** en el panel de admin.

---

## 🎯 Paso 5: Probar el Sistema

### 5.1 Enviar Email de Prueba
1. Envía un email a `hola@padeliner.com`
2. El webhook lo recibirá automáticamente
3. Se guardará en Supabase

### 5.2 Ver en Panel de Admin
1. Ve a `/admin/mensajes`
2. Verás el email recibido
3. Puedes:
   - Marcarlo como leído
   - Asignarlo a un admin
   - Responder directamente

---

## 🔄 Flujo Completo

```
Email enviado → hola@padeliner.com
        ↓
  Resend recibe el email
        ↓
Webhook POST /api/webhooks/inbound-email
        ↓
Se guarda en tabla incoming_emails
        ↓
Aparece en /admin/mensajes
        ↓
Admin responde desde el panel
        ↓
Respuesta enviada vía Resend
        ↓
Se marca como "replied"
```

---

## 📊 Estructura de Datos

### Tabla: `incoming_emails`
```sql
- id (UUID)
- from_email (TEXT) - Email del remitente
- from_name (TEXT) - Nombre del remitente
- to_email (TEXT) - Email destino (@padeliner.com)
- subject (TEXT) - Asunto
- text_content (TEXT) - Contenido texto plano
- html_content (TEXT) - Contenido HTML
- raw_email (JSONB) - Email completo raw
- read (BOOLEAN) - Leído/No leído
- replied (BOOLEAN) - Respondido/No respondido
- assigned_to (UUID) - Admin asignado
- category (TEXT) - Categoría automática
- priority (TEXT) - normal, high, urgent
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Tabla: `email_replies`
```sql
- id (UUID)
- incoming_email_id (UUID) - Ref al email original
- admin_id (UUID) - Admin que respondió
- to_email (TEXT)
- subject (TEXT)
- content (TEXT)
- sent_at (TIMESTAMPTZ)
```

---

## 🔒 Seguridad

1. ✅ **Webhook protegido** con secret key
2. ✅ **RLS policies** - Solo admins pueden ver emails
3. ✅ **Verificación de dominio** en Resend
4. ✅ **Headers seguros** en webhooks

---

## 🚀 Ventajas del Sistema

✅ **Centralizado** - Todos los emails en un solo lugar
✅ **Organizado** - Categorías automáticas
✅ **Eficiente** - Responder sin salir del admin
✅ **Seguro** - Control total sobre quién ve qué
✅ **Escalable** - Soporta múltiples direcciones
✅ **Trazable** - Historial completo de respuestas

---

## 🛠️ Troubleshooting

### Emails no llegan
1. Verifica DNS configurado correctamente
2. Verifica webhook URL en Resend
3. Chequea logs del webhook en Vercel

### Error 401 en webhook
1. Verifica `WEBHOOK_SECRET` en .env
2. Verifica header `x-webhook-secret` en Resend

### No aparecen en admin
1. Verifica migraciones aplicadas
2. Verifica que el usuario es admin
3. Chequea tabla `incoming_emails` en Supabase

---

## 📞 Direcciones de Email Sugeridas

- `hola@padeliner.com` - Contacto general
- `soporte@padeliner.com` - Soporte técnico
- `info@padeliner.com` - Información
- `ventas@padeliner.com` - Equipo de ventas
- `admin@padeliner.com` - Administración
- `careers@padeliner.com` - Recursos humanos

---

¡Todo listo para gestionar tus emails profesionalmente! 🎾✨
