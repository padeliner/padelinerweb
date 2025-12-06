# Configurar Avatar del Admin Padeliner

## 📋 Pasos para configurar el avatar oficial de Padeliner

### 1. Subir imagen a Supabase Storage

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto **Padeliner**
3. En el menú lateral, ve a **Storage**
4. Crea un bucket llamado `avatars` (si no existe):
   - Click en "Create bucket"
   - Name: `avatars`
   - Public: ✅ (marcado)
   - Click "Create bucket"

5. Entra al bucket `avatars`
6. Click en "Upload file"
7. Sube la imagen del logo de Padeliner (la imagen verde con el pin)
8. Nombra el archivo: `padeliner-official.png`

### 2. Obtener la URL pública

1. Una vez subida, click derecho en el archivo → "Copy URL"
2. La URL será algo como:
   ```
   https://[tu-proyecto].supabase.co/storage/v1/object/public/avatars/padeliner-official.png
   ```

### 3. Actualizar la migración

1. Abre el archivo: `supabase/migrations/20250116_verified_badge.sql`
2. Reemplaza `https://your-supabase-project.supabase.co/storage/v1/object/public/avatars/padeliner-official.png`
   con la URL real que copiaste
3. Guarda el archivo

### 4. Ejecutar la migración

Desde la terminal en el directorio del proyecto:

```bash
# Si usas Supabase CLI local
npx supabase db push

# O desde el dashboard de Supabase
# Ve a SQL Editor y pega el contenido de la migración
```

### 5. Verificar

1. Ve a la tabla `users` en Supabase
2. Busca el usuario con id `f6802450-c094-491e-8b44-a36ebc795676`
3. Verifica que:
   - `full_name` = "Padeliner"
   - `avatar_url` = la URL de tu imagen
   - `is_verified` = true

---

## 🎨 Resultado Esperado

En el chat, el usuario **Padeliner** aparecerá con:
- ✅ Avatar del logo oficial
- ✅ Badge azul de verificación (check ✓)
- ✅ Nombre "Padeliner"
- ✅ Estado online/última vez

---

## 🔒 Seguridad

El badge de verificación (`is_verified`) solo puede ser modificado por:
- Migraciones SQL (desde el servidor)
- Superadmin con acceso directo a la base de datos

Los usuarios normales **NO pueden** modificar este campo, está protegido por RLS.

---

## 📝 Notas

- El logo debe tener dimensiones cuadradas (recomendado: 500x500px mínimo)
- Formato PNG con fondo transparente o blanco
- La imagen se mostrará en un círculo en el chat
