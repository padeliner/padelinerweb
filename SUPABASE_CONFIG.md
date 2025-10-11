# ⚙️ Configuración de Supabase para www.padeliner.com

## 🔧 Problema Actual

El callback de Google OAuth está redirigiendo incorrectamente. Necesitas configurar las URLs de redirect en Supabase.

---

## 📋 Pasos para Configurar

### 1. Ve a Supabase Dashboard

```
https://supabase.com/dashboard/project/htawjnjewvyjkabxmbnu
```

### 2. Ve a Authentication → URL Configuration

```
Menú lateral → Authentication → URL Configuration
```

### 3. Agregar Redirect URLs

En el campo **"Redirect URLs"**, asegúrate de tener TODAS estas URLs:

```
http://localhost:3000/auth/callback
https://padelinerweb.vercel.app/auth/callback
https://www.padeliner.com/auth/callback
https://padeliner.com/auth/callback
```

**Importante:** Una por línea, sin comas.

### 4. Site URL

En el campo **"Site URL"**, configura:

```
https://www.padeliner.com
```

### 5. Guardar Cambios

Haz clic en **"Save"** al final de la página.

---

## ✅ Verificación

Después de configurar:

1. **Limpia caché del navegador** o abre en modo incógnito
2. Registrate de nuevo con Google
3. Verifica que redirige a `/auth/complete-profile`
4. Revisa la consola para los logs

---

## 🔍 Debugging

Si sigue sin funcionar, verifica en la consola de Vercel:

```bash
# En el dashboard de Vercel → Tu proyecto → Logs (Runtime Logs)
# Busca los logs del callback:
🔄 Callback ejecutándose...
➡️  Redirigiendo a: https://www.padeliner.com/auth/complete-profile
```

---

## 📸 Captura de Pantalla Esperada

**Authentication → URL Configuration debe verse así:**

```
Site URL:
https://www.padeliner.com

Redirect URLs:
http://localhost:3000/auth/callback
https://padelinerweb.vercel.app/auth/callback
https://www.padeliner.com/auth/callback
https://padeliner.com/auth/callback
```

---

## ⚠️ Común Error

Si ves el error `"Invalid redirect URL"`:
- Significa que la URL no está en la lista de Redirect URLs permitidas
- Revisa que hayas guardado los cambios en Supabase
- Espera 1-2 minutos para que se apliquen los cambios
