# 📋 INSTRUCCIONES - Extraer Schema Completo de Supabase

## 🎯 OBJETIVO

Extraer **TODO** el schema de tu base de datos Supabase en formato Markdown:
- Tablas y columnas
- Foreign keys (relaciones)
- Índices
- Políticas RLS
- Funciones
- Triggers
- ENUMs
- Extensiones
- Estadísticas

---

## 📝 MÉTODO 1: Script Completo (Recomendado)

### **Paso 1: Abrir SQL Editor**
1. Ve a tu proyecto Supabase
2. Panel izquierdo → **SQL Editor**
3. Click en **"New query"**

### **Paso 2: Copiar el script**
1. Abre el archivo: `EXTRACT_SUPABASE_SCHEMA.sql`
2. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
3. **Pega** en el SQL Editor de Supabase (Ctrl+V)

### **Paso 3: Ejecutar**
1. Click en **"Run"** o presiona `Ctrl+Enter`
2. **Espera 10-30 segundos** (puede tardar un poco)
3. Verás el resultado en formato markdown en la sección de resultados

### **Paso 4: Copiar resultado**
1. El resultado aparecerá como una **columna de texto** llamada `markdown`
2. **Selecciona TODAS las filas** del resultado
3. Copia el contenido
4. Pega en un nuevo archivo: `SUPABASE_SCHEMA.md`

### **Paso 5: Formatear (opcional)**
El resultado ya está en formato Markdown. Ábrelo con cualquier editor de Markdown para visualizarlo mejor.

---

## 📝 MÉTODO 2: Script Simple (Si el otro falla)

Si el script completo da error, usa la versión simplificada:

### **Paso 1: Abrir archivo**
`EXTRACT_SUPABASE_SIMPLE.sql`

### **Paso 2: Ejecutar sección por sección**

Copia y ejecuta **cada query individualmente**:

#### **Query 1: Tablas**
```sql
SELECT 
  schemaname,
  tablename,
  n_live_tup as filas,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as tamaño
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

#### **Query 2: Columnas**
```sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

Y así sucesivamente con cada sección...

### **Paso 3: Copiar cada resultado**
Copia cada resultado a un documento Markdown y formátalo manualmente.

---

## 📝 MÉTODO 3: Exportar como CSV/Excel

Si prefieres formato tabular:

1. Ejecuta cada query del `EXTRACT_SUPABASE_SIMPLE.sql`
2. Para cada resultado:
   - Click en el icono **"Download"** (descarga)
   - Selecciona formato: **CSV** o **Excel**
3. Abre los archivos en Excel/Google Sheets

---

## 🔍 VERIFICAR QUE FUNCIONA

### **Test rápido:**

Ejecuta esto primero para probar:

```sql
SELECT 
  'Hola, tengo ' || COUNT(*) || ' tablas en public schema' as mensaje
FROM pg_tables 
WHERE schemaname = 'public';
```

Si ves el resultado, el SQL Editor funciona correctamente.

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### **Error: "syntax error near UNION ALL"**

**Causa:** El script es muy largo para una sola query

**Solución:** Usa el `EXTRACT_SUPABASE_SIMPLE.sql` y ejecuta cada query individualmente

---

### **Error: "permission denied"**

**Causa:** No tienes permisos suficientes

**Solución:**
1. Asegúrate de estar en el proyecto correcto
2. Usa el rol de administrador
3. O ejecuta solo las queries que no requieren permisos especiales

---

### **No aparece resultado**

**Causa:** La query tarda mucho

**Solución:**
1. Espera 30-60 segundos
2. Si sigue sin responder, cancela y usa el script simple
3. Ejecuta query por query

---

### **Resultado muy largo / se corta**

**Causa:** Supabase limita los resultados a 1000 filas

**Solución:**
1. El script completo debería funcionar (combina todo en una columna)
2. Si se corta, usa el script simple y exporta cada sección por separado

---

## 📊 QUÉ OBTENDRÁS

Un archivo Markdown con esta estructura:

```markdown
# 📊 SCHEMA COMPLETO DE PADELINER - SUPABASE

**Fecha de extracción:** 2025-01-16

---

## 📋 TABLAS

| Tabla | Filas | Tamaño | Descripción |
|-------|-------|--------|-------------|
| users | 150 | 256 KB | ... |
| coaches | 25 | 128 KB | ... |

---

## 🔧 COLUMNAS DETALLADAS

### 📦 Tabla: `users`

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | uuid | ❌ | gen_random_uuid() | ... |
| email | text | ❌ | - | ... |

---

## 🔗 FOREIGN KEYS (Relaciones)

| Tabla Origen | Columna | → | Tabla Destino | Columna | Acción |
|--------------|---------|---|---------------|---------|--------|
| coaches | user_id | → | users | id | CASCADE/CASCADE |

---

## 🔒 POLÍTICAS RLS

| Tabla | Política | Comando | Using |
|-------|----------|---------|-------|
| users | Users can view own profile | SELECT | auth.uid() = id |

---

## ⚙️ FUNCIONES

### update_user_presence

```sql
CREATE OR REPLACE FUNCTION update_user_presence(...)
RETURNS void
...
```

---

## 📊 ESTADÍSTICAS GENERALES

| Métrica | Valor |
|---------|-------|
| Total Tablas | 15 |
| Total Funciones | 8 |
| Tamaño Total DB | 5.2 MB |

---
```

---

## 💡 CONSEJOS

1. **Ejecuta fuera de horas pico** - El script puede ser pesado
2. **Guarda el resultado** - Útil como documentación
3. **Actualiza regularmente** - Cada vez que cambies el schema
4. **Comparte con el equipo** - Excelente documentación
5. **Versiona en Git** - Añade `SUPABASE_SCHEMA.md` al repo

---

## 🔄 AUTOMATIZACIÓN (Avanzado)

Para generar esto automáticamente en cada deploy:

```bash
# Usa la CLI de Supabase
npx supabase db dump --schema public > schema.sql
```

---

## 📁 ARCHIVOS INCLUIDOS

```
EXTRACT_SUPABASE_SCHEMA.sql       ← Script completo (usar primero)
EXTRACT_SUPABASE_SIMPLE.sql       ← Script simplificado (backup)
INSTRUCCIONES_EXTRAER_SCHEMA.md   ← Este archivo
```

---

## 🎯 SIGUIENTE PASO

Una vez tengas el resultado:

1. Guárdalo como `SUPABASE_SCHEMA.md`
2. Revísalo para entender la estructura
3. Úsalo como documentación de referencia
4. Compártelo con el equipo si es necesario

---

**🎾 ¡Listo! Ejecuta el script y tendrás toda tu base de datos documentada!**
