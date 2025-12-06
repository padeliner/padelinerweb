# 🚀 MIGRACIÓN FINAL - Admin Padeliner + Presencia Online

## ✅ TODO EN UNO - Ejecutar una sola vez

Este archivo contiene **TODAS** las migraciones necesarias para:
1. ✅ Sistema de presencia online (última vez visto)
2. ✅ Badge de verificación oficial (check azul)
3. ✅ RLS policy correcta para chat
4. ✅ Datos del admin Padeliner actualizados

---

## 📋 INSTRUCCIONES (5 minutos)

### PASO 1: Ir a Supabase Dashboard

1. Abre: https://supabase.com/dashboard
2. Selecciona tu proyecto **Padeliner**
3. Ve a **SQL Editor** (menú lateral izquierdo)
4. Click en **New Query**

### PASO 2: Ejecutar Migración

1. Abre el archivo: `supabase/migrations/20250116_admin_verificado_presencia_completo.sql`
2. **Copia TODO** el contenido
3. **Pega** en el SQL Editor de Supabase
4. Click en **RUN** (botón verde)
5. Espera a que termine (verás ✅ Success)

### PASO 3: Verificar Resultados

Al final del SQL se ejecutarán queries de verificación. Deberías ver:

```
| verificacion              | resultado |
|---------------------------|-----------|
| Admin Padeliner           | ✅ datos  |
| Tabla user_presence       | true      |
| Columna is_verified       | true      |
| Policies creadas          | 3         |
```

### PASO 4: Reiniciar Servidor

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

### PASO 5: Probar

1. Abre: http://localhost:3000/mensajes
2. Deberías ver la conversación con **Padeliner**:
   - ✅ Nombre: "Padeliner"
   - ✅ Check azul ✓ junto al nombre
   - ✅ Avatar del logo oficial
   - ✅ Estado: "En línea" o "Última vez"

---

## 🎯 QUÉ HACE ESTA MIGRACIÓN

### 1. Sistema de Presencia Online

**Tabla:** `user_presence`
- Rastrea estado online/offline de usuarios
- Última vez visto
- Actualización en tiempo real

**Funciones:**
- `update_user_presence()` - Heartbeat cada 30s
- `mark_inactive_users_offline()` - Auto-offline > 2 min

**Resultado:**
```
En línea
Hace un momento
Hace 15 min
Hace 3h
```

### 2. Badge de Verificación

**Columna:** `users.is_verified`
- Solo admin Padeliner tiene `true`
- Check azul ✓ visible en chat
- Imposible de falsificar (RLS)

**Resultado:**
```
Padeliner ✓
```

### 3. RLS Policy para Chat

**Policy:** "Users can view conversation participants"
- ✅ Ves usuarios con los que tienes conversación
- ✅ Ves a Padeliner solo si tienes chat con él
- ❌ No ves usuarios aleatorios

**Resultado:**
- Privacidad protegida
- Admin solo visible en chat

### 4. Datos Admin Actualizados

```sql
id: f6802450-c094-491e-8b44-a36ebc795676
email: padeliner@gmail.com
full_name: Padeliner
role: admin
is_verified: true
avatar_url: [URL del logo oficial]
```

---

## 🔒 SEGURIDAD

### Badge de Verificación
- Solo 1 usuario puede tener `is_verified = true`
- Campo protegido por RLS
- Solo modificable por SQL/Admin

### Privacidad
- Admin NO visible en búsquedas
- Solo visible si tienes conversación activa
- RLS protege datos de usuarios

### Presencia Online
- Todos pueden ver estado de conversaciones activas
- Solo puedes actualizar tu propia presencia
- Heartbeat seguro con auth

---

## 📂 ARCHIVOS CREADOS

### Migración Principal (LA IMPORTANTE)
```
supabase/migrations/20250116_admin_verificado_presencia_completo.sql
```

### Componentes Frontend
```
components/VerifiedBadge.tsx          - Badge check azul
components/UserPresenceIndicator.tsx  - Indicador online/última vez
hooks/useUserPresence.ts              - Heartbeat automático
app/api/presence/heartbeat/route.ts   - API heartbeat
```

### Archivos Temporales (puedes borrar)
```
EJECUTAR_ESTA_MIGRACION.sql
EJECUTAR_TODO.sql
SETUP_ADMIN_AVATAR.md
INSTRUCCIONES_ADMIN_SETUP.md
```

---

## 🐛 TROUBLESHOOTING

### ❌ "Usuario" en vez de "Padeliner"

**Causa:** RLS policy no ejecutada
**Solución:** Ejecutar la migración completa de nuevo

### ❌ Sin check azul ✓

**Causa:** `is_verified` no actualizado
**Solución:** 
```sql
UPDATE users SET is_verified = true 
WHERE id = 'f6802450-c094-491e-8b44-a36ebc795676';
```

### ❌ Error 400 en user_presence

**Causa:** Tabla user_presence no creada
**Solución:** Ejecutar la migración completa

### ❌ No aparece estado "En línea"

**Causa:** Heartbeat no activo
**Solución:** Esperar 30s o recargar página

---

## ✅ CHECKLIST FINAL

Después de ejecutar la migración, verifica:

- [ ] Tabla `user_presence` existe
- [ ] Columna `users.is_verified` existe
- [ ] Usuario `padeliner@gmail.com` tiene `is_verified = true`
- [ ] Policy "Users can view conversation participants" existe
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Chat muestra "Padeliner" con check azul ✓
- [ ] Estado online/última vez funciona
- [ ] Heartbeat cada 30s (ver logs)

---

## 🎉 RESULTADO ESPERADO

### Lista de Conversaciones:
```
┌─────────────────────────────────────┐
│ [Logo] Padeliner ✓        10:30 AM │
│        admin                        │
│        🟢 En línea                  │
│        Hola, ¿en qué puedo...       │
└─────────────────────────────────────┘
```

### Header del Chat:
```
┌─────────────────────────────────────┐
│ ← [Logo+🟢] Padeliner ✓             │
│             En línea                │
└─────────────────────────────────────┘
```

---

## 📝 NOTAS FINALES

- Esta es la **migración definitiva**
- Consolida TODAS las migraciones anteriores
- No necesitas ejecutar archivos previos
- Una sola ejecución configura todo

**¡Listo para producción! 🚀**
