# 📧 Configuración Email con Cloudflare

## ✅ **Sistema Completo:**

```
ENVIAR: Resend
RECIBIR: Cloudflare Email Routing + Worker → Supabase + Gmail
```

---

## 🔧 **Configuración Actual:**

### **1. Cloudflare Email Routing** ✅
- Dirección: `contact@padeliner.com`
- Acción: Send to Worker → `email-handler`
- Forward: `padeliner@gmail.com`

### **2. Email Worker** ✅
- Nombre: `email-handler`
- Ubicación: Cloudflare Workers & Pages
- Código: Ver `cloudflare-email-worker.js`

### **3. Variables de Entorno**

**En Cloudflare Worker (`email-handler`):**
```
WEBHOOK_SECRET=tu_secret_aqui
```

**En Vercel/Local (.env.local):**
```
WEBHOOK_SECRET=mismo_secret_aqui
CAREERS_EMAIL=padeliner@gmail.com
RESEND_API_KEY=tu_resend_key
```

---

## 🔄 **Flujo Completo:**

### **Usuario envía formulario:**
```
1. Usuario completa /contacto
2. API envía email vía Resend a contact@padeliner.com
3. Cloudflare Email Routing recibe el email
4. Email Worker procesa:
   ├─→ POST /api/webhooks/inbound-email
   │   └─→ Guarda en Supabase (tabla incoming_emails)
   └─→ Forward a padeliner@gmail.com
5. ✅ Aparece en /admin/mensajeria (tab Inbox)
6. ✅ Aparece en Gmail
```

---

## 🛠️ **Pasos de Configuración:**

### **Paso 1: Actualizar Código del Worker**

1. Cloudflare → **Workers & Pages** → `email-handler`
2. Click **"Edit Code"**
3. Copia el código de `cloudflare-email-worker.js`
4. Pega y reemplaza todo
5. Click **"Save and Deploy"**

### **Paso 2: Verificar Variables**

1. `email-handler` → **Settings** → **Variables**
2. Verifica que existe: `WEBHOOK_SECRET`
3. Si no existe, añádela con el mismo valor que tienes en `.env.local`

### **Paso 3: Aplicar Migración SQL**

En Supabase SQL Editor:
```sql
-- Ejecuta el archivo:
-- supabase/migrations/20250115_create_incoming_emails_simple.sql
```

### **Paso 4: Deploy a Vercel**

```bash
git add .
git commit -m "fix: Email routing con contact@padeliner.com"
git push origin main
```

### **Paso 5: Añadir WEBHOOK_SECRET en Vercel**

1. Vercel Dashboard → padeliner → Settings → Environment Variables
2. Añadir:
   ```
   WEBHOOK_SECRET=tu_secret_super_seguro_aqui
   ```
3. Redeploy

---

## 🧪 **Probar el Sistema:**

### **Test 1: Enviar desde formulario**
1. Ve a https://padeliner.com/contacto
2. Completa el formulario
3. Envía

**Debe llegar a:**
- ✅ `padeliner@gmail.com` (Gmail)
- ✅ `/admin/mensajeria` (panel admin)

### **Test 2: Verificar en Supabase**
```sql
SELECT * FROM incoming_emails 
ORDER BY created_at DESC 
LIMIT 5;
```

### **Test 3: Ver en Admin**
1. Ve a `/admin/mensajeria`
2. Click en tab **"Inbox"**
3. Deberías ver el email

---

## 🔍 **Troubleshooting:**

### **No aparece en /admin/mensajeria:**

**1. Verifica logs del Worker:**
```
Cloudflare → Workers & Pages → email-handler → Logs
```

**2. Verifica logs de Vercel:**
```
Vercel → Deployments → [último deploy] → Functions → /api/webhooks/inbound-email
```

**3. Verifica Supabase:**
```sql
SELECT * FROM incoming_emails;
```

### **Error 401 en webhook:**
- WEBHOOK_SECRET diferente en Worker vs Vercel
- Solución: Usar el mismo valor en ambos

### **No llega a Gmail:**
- Verifica que el Worker tiene `await message.forward('padeliner@gmail.com')`
- Verifica logs del Worker

---

## 📋 **Checklist Final:**

- [ ] Migración SQL aplicada en Supabase
- [ ] Worker `email-handler` desplegado con código actualizado
- [ ] Variable `WEBHOOK_SECRET` en Worker
- [ ] Variable `WEBHOOK_SECRET` en Vercel
- [ ] Email Routing apunta a Worker
- [ ] Código desplegado en Vercel
- [ ] Test: Email llega a Gmail
- [ ] Test: Email aparece en /admin/mensajeria

---

## 📧 **Direcciones Configuradas:**

| Dirección | Destino | Estado |
|-----------|---------|--------|
| `contact@padeliner.com` | Worker → Supabase + Gmail | ✅ Activo |
| `contacto@padeliner.com` | Solo para enviar (Resend) | ✅ Activo |
| `empleo@padeliner.com` | Solo para enviar (Resend) | ✅ Activo |
| `soporte@padeliner.com` | Solo para enviar (Resend) | ✅ Activo |

---

## 🚀 **Próximos Pasos:**

1. Añadir más direcciones en Email Routing:
   - `soporte@padeliner.com` → Worker
   - `empleo@padeliner.com` → Worker
   - `info@padeliner.com` → Worker

2. Implementar respuestas desde el panel admin

3. Añadir notificaciones en tiempo real

---

¡Todo listo! 🎾✨
