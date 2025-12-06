# 📚 Guía de Clientes Supabase

**Fecha:** Octubre 2025  
**Estado:** ✅ Estructura correcta implementada

---

## 📁 Estructura de Archivos

```
lib/
└── supabase.ts                 ✅ Para Client Components (navegador)

utils/supabase/
├── client.ts                   ✅ Implementación cliente navegador
├── server.ts                   ✅ Para Server Components
└── middleware.ts               ✅ Para middleware de Next.js
```

---

## 🎯 Cuándo Usar Cada Uno

### **1. Client Components (`lib/supabase.ts`)**

**Usa cuando:**
- Componente tiene `'use client'`
- Ejecuta en el navegador
- Hooks de React (useState, useEffect)
- Event handlers (onClick, onChange)

**Ejemplo:**
```typescript
'use client'

import { supabase } from '@/lib/supabase'

export function MiComponente() {
  const handleLogin = async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password'
    })
  }
  
  return <button onClick={handleLogin}>Login</button>
}
```

**Archivos que lo usan:**
- `components/admin/AdminHeader.tsx`
- `components/admin/RecentActivity.tsx`
- `contexts/AuthContext.tsx`
- `hooks/useIsAdmin.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- Todos los dashboards

---

### **2. Server Components (`utils/supabase/server.ts`)**

**Usa cuando:**
- Componente NO tiene `'use client'`
- Es async function
- Ejecuta en el servidor
- Necesitas datos antes de renderizar

**Ejemplo:**
```typescript
import { createClient } from '@/utils/supabase/server'

export default async function MiPagina() {
  const supabase = await createClient()
  
  const { data: users } = await supabase
    .from('users')
    .select('*')
  
  return <div>{users?.length} usuarios</div>
}
```

**Archivos que lo usan:**
- `app/admin/page.tsx` ✅
- `app/auth/callback/route.ts` ✅

---

### **3. Middleware (`utils/supabase/middleware.ts`)**

**Usa cuando:**
- Necesitas refrescar tokens
- Middleware de Next.js

**Ejemplo:**
```typescript
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

**Archivos que lo usan:**
- `middleware.ts` ✅

---

## ⚠️ Errores Comunes

### ❌ **Error 1: Usar cliente del navegador en Server Component**
```typescript
// ❌ MAL
import { supabase } from '@/lib/supabase'

export default async function ServerPage() {
  const { data } = await supabase.from('users').select()
  // Error: cookies() can only be used in Server Components
}
```

```typescript
// ✅ BIEN
import { createClient } from '@/utils/supabase/server'

export default async function ServerPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('users').select()
}
```

---

### ❌ **Error 2: Usar cliente del servidor en Client Component**
```typescript
// ❌ MAL
'use client'

import { createClient } from '@/utils/supabase/server'

export function ClientComponent() {
  const supabase = await createClient() // Error: Cannot use await in non-async
}
```

```typescript
// ✅ BIEN
'use client'

import { supabase } from '@/lib/supabase'

export function ClientComponent() {
  const handleClick = async () => {
    const { data } = await supabase.from('users').select()
  }
}
```

---

## 🔄 Migración de Código Antiguo

Si encuentras código que usa el cliente viejo, actualízalo así:

### **Antes (antiguo):**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    storage: localStorage // ❌ No compatible con servidor
  }
})
```

### **Ahora (correcto):**
```typescript
// Para Client Components
import { supabase } from '@/lib/supabase'
// Ya está listo para usar

// Para Server Components  
import { createClient } from '@/utils/supabase/server'
const supabase = await createClient()
```

---

## 📊 Diferencias Clave

| Aspecto | Client | Server |
|---------|--------|--------|
| **Import** | `@/lib/supabase` | `@/utils/supabase/server` |
| **Creación** | `supabase` (directo) | `await createClient()` |
| **Async** | No | Sí |
| **Storage** | Cookies | Cookies |
| **Ejecución** | Navegador | Servidor |
| **'use client'** | Sí | No |

---

## 🧪 Cómo Verificar Que Está Correcto

### **Test 1: Hacer login**
1. Login en `/login`
2. Abrir DevTools → Application → Cookies
3. Deberías ver cookies como:
   - `sb-[proyecto]-auth-token.0`
   - `sb-[proyecto]-auth-token.1`

✅ **Si ves las cookies = CORRECTO**  
❌ **Si no hay cookies = Usa cliente viejo**

---

### **Test 2: Server Component lee sesión**
1. Login como admin
2. Ve a `/admin`
3. Mira logs del servidor
4. Deberías ver:
   ```
   👤 Usuario: tu-email@example.com
   ✅ ES ADMIN
   ```

✅ **Si ve el usuario = CORRECTO**  
❌ **Si dice "null" = Cliente no compatible**

---

## 🎯 Resumen

### **Regla de Oro:**

```
'use client'    →  import { supabase } from '@/lib/supabase'
async function  →  import { createClient } from '@/utils/supabase/server'
middleware      →  import { updateSession } from '@/utils/supabase/middleware'
```

---

## 📝 Checklist de Implementación

- [x] `utils/supabase/client.ts` creado
- [x] `utils/supabase/server.ts` creado
- [x] `utils/supabase/middleware.ts` creado
- [x] `lib/supabase.ts` actualizado para usar cookies
- [x] `middleware.ts` usa updateSession
- [x] `app/auth/callback/route.ts` actualizado
- [x] Todos los Client Components usan `@/lib/supabase`
- [x] Todos los Server Components usan `@/utils/supabase/server`

---

## 🚀 Todo Está Correcto Si:

✅ Login crea cookies (no localStorage)  
✅ Server Components leen la sesión  
✅ Middleware refresca tokens automáticamente  
✅ `/admin` funciona con Server Component  
✅ No hay errores de "Auth session missing"

---

**Tu estructura actual está CORRECTA y lista para producción.** ✅
