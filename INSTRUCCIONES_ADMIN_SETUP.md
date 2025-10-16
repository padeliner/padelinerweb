# 🚀 INSTRUCCIONES PARA CONFIGURAR ADMIN PADELINER

## ⚠️ IMPORTANTE: Sigue estos pasos EN ORDEN

---

## 📋 PASO 1: Ejecutar Migración en Supabase

### Opción A: Desde el Dashboard (RECOMENDADO)

1. **Abre tu proyecto en Supabase:**
   - Ve a: https://supabase.com/dashboard
   - Selecciona tu proyecto **Padeliner**

2. **Ve al SQL Editor:**
   - En el menú lateral, click en **SQL Editor**
   - Click en **New Query**

3. **Copia el contenido del archivo:**
   - Abre: `EJECUTAR_ESTA_MIGRACION.sql`
   - Copia TODO el contenido

4. **Pega y ejecuta:**
   - Pega el contenido en el SQL Editor
   - Click en **RUN** (botón verde)
   - Espera a que se complete ✅

### Opción B: Desde CLI (alternativa)

```bash
# Desde la raíz del proyecto
npx supabase db push
```

---

## 🔍 PASO 2: Verificar que la Migración Funcionó

1. En Supabase Dashboard, ve a **Table Editor**
2. Selecciona la tabla **users**
3. Busca el usuario con email `padeliner@gmail.com`
4. Verifica que tenga:
   - ✅ `full_name` = "Padeliner"
   - ✅ `is_verified` = true (checkbox marcado)
   - ✅ `avatar_url` = una URL (aunque sea de ui-avatars)

---

## 📤 PASO 3: Subir Logo Oficial (Opcional pero Recomendado)

1. **Ve a Storage en Supabase:**
   - Dashboard → **Storage**

2. **Crea el bucket (si no existe):**
   - Click **Create bucket**
   - Name: `avatars`
   - Public: ✅ **MARCADO**
   - Click **Create**

3. **Sube el logo:**
   - Entra al bucket `avatars`
   - Click **Upload file**
   - Sube la imagen del logo de Padeliner
   - Nómbrala: `padeliner-official.png`

4. **Copia la URL:**
   - Click derecho en el archivo → **Copy URL**
   - La URL será algo como:
     ```
     https://[proyecto].supabase.co/storage/v1/object/public/avatars/padeliner-official.png
     ```

5. **Actualiza el usuario:**
   - Ve a **Table Editor** → tabla `users`
   - Busca usuario `padeliner@gmail.com`
   - Edita el campo `avatar_url`
   - Pega la URL que copiaste
   - **Save**

---

## 🔄 PASO 4: Reiniciar el Servidor de Desarrollo

```bash
# Detén el servidor (Ctrl+C)
# Luego vuelve a iniciarlo
npm run dev
```

---

## 🧪 PASO 5: Probar en el Chat

1. **Abre la aplicación:**
   - Ve a: http://localhost:3000/mensajes

2. **Busca la conversación con Padeliner:**
   - Deberías ver:
     - ✅ Nombre: "Padeliner"
     - ✅ Avatar del logo (si subiste la imagen)
     - ✅ Check azul ✓ junto al nombre
     - ✅ Estado "En línea" o "Última vez"

3. **Abre el chat:**
   - Click en la conversación
   - En el header deberías ver:
     - ✅ Avatar + punto verde (si online)
     - ✅ "Padeliner" con check azul ✓
     - ✅ Estado de presencia

---

## 🐛 TROUBLESHOOTING

### El admin sigue sin aparecer correctamente:

1. **Verifica los logs del servidor:**
   - Mira la consola donde ejecutas `npm run dev`
   - Busca el log: `📧 Admin Padeliner conversation:`
   - Esto te dirá qué datos está recibiendo

2. **Verifica en Supabase:**
   ```sql
   SELECT id, full_name, email, is_verified, avatar_url, role
   FROM public.users 
   WHERE email = 'padeliner@gmail.com';
   ```

3. **Limpia la caché del navegador:**
   - Chrome: Ctrl+Shift+R (hard refresh)
   - Firefox: Ctrl+F5

4. **Verifica que la conversación existe:**
   ```sql
   SELECT * FROM public.direct_conversation_participants
   WHERE user_id = 'f6802450-c094-491e-8b44-a36ebc795676';
   ```

---

## ✅ RESULTADO ESPERADO

### En la Lista de Conversaciones:
```
┌─────────────────────────────────────┐
│ [Logo] Padeliner ✓        10:30 AM │
│        admin                        │
│        Hola, ¿en qué puedo ayud...  │
└─────────────────────────────────────┘
```

### En el Header del Chat:
```
┌─────────────────────────────────────┐
│ ← [Logo+Punto Verde] Padeliner ✓    │
│                      🟢 En línea    │
└─────────────────────────────────────┘
```

---

## 📝 NOTAS IMPORTANTES

- El check azul ✓ **SOLO** aparece si `is_verified = true`
- Ese campo **NO puede** ser editado por usuarios normales
- Solo migraciones SQL pueden modificarlo
- Es imposible falsificar el badge de verificación

---

## ❓ ¿Aún no funciona?

Comparte:
1. El resultado de la query de verificación
2. Los logs del servidor (el que dice "📧 Admin Padeliner")
3. Una captura de pantalla del chat

Y te ayudaré a solucionarlo.
