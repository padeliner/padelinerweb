# 📋 GUÍA COMPLETA - Extraer Schema de Supabase

## ✅ SCRIPTS CREADOS (ejecuta en orden)

He creado 14 scripts SQL individuales que **SÍ FUNCIONAN** en Supabase:

```
01_TABLAS.sql           → Lista todas las tablas
02_COLUMNAS.sql         → Todas las columnas de cada tabla
03_FOREIGN_KEYS.sql     → Relaciones entre tablas
04_INDICES.sql          → Índices creados
05_POLITICAS_RLS.sql    → Políticas de seguridad RLS
06_FUNCIONES_LISTA.sql  → Nombres de funciones
07_FUNCIONES_CODIGO.sql → Código completo de funciones ⭐ MUY IMPORTANTE
08_TRIGGERS.sql         → Triggers configurados
09_ENUMS.sql            → Tipos enumerados
10_EXTENSIONES.sql      → Extensiones instaladas
11_CONSTRAINTS.sql      → Constraints (PK, UNIQUE, CHECK)
12_SEQUENCES.sql        → Sequences (auto-incrementos)
13_VISTAS.sql           → Vistas (views)
14_ESTADISTICAS.sql     → Resumen general
```

---

## 🎯 CÓMO EJECUTAR (PASO A PASO)

### **Método 1: En Supabase SQL Editor** (Recomendado)

1. **Abre Supabase Dashboard**
   - Ve a tu proyecto
   - Click en **"SQL Editor"** (panel izquierdo)

2. **Por cada archivo** (del 01 al 14):
   
   a. Abre el archivo (ejemplo: `01_TABLAS.sql`)
   
   b. Copia TODO el contenido
   
   c. Pega en el SQL Editor de Supabase
   
   d. Click en **"Run"** (o presiona Ctrl+Enter)
   
   e. **Copia el resultado** y pégalo en un documento

3. **Organiza los resultados:**
   - Crea un archivo: `SUPABASE_SCHEMA_COMPLETO.md`
   - Pega cada resultado bajo su título correspondiente

---

## 📊 EJEMPLO DE RESULTADO ESPERADO

### 01_TABLAS.sql
```
tabla          | filas | tamaño
---------------|-------|--------
users          | 150   | 256 KB
coaches        | 25    | 128 KB
messages       | 1523  | 512 KB
...
```

### 02_COLUMNAS.sql
```
tabla    | columna    | tipo  | nullable | default
---------|------------|-------|----------|------------------
users    | id         | uuid  | NO       | gen_random_uuid()
users    | email      | text  | NO       | NULL
users    | created_at | timestamp | NO  | now()
...
```

### 07_FUNCIONES_CODIGO.sql ⭐ **MUY IMPORTANTE**
```
nombre_funcion           | codigo_completo
------------------------|----------------------------------
update_user_presence    | CREATE OR REPLACE FUNCTION public.update_user_presence(...)
                        | RETURNS void
                        | LANGUAGE plpgsql
                        | AS $function$
                        | BEGIN
                        |   UPDATE users SET ...
                        | END;
                        | $function$
...
```

---

## ⚠️ IMPORTANTE

### **Script 07_FUNCIONES_CODIGO.sql**

Este es el **MÁS CRÍTICO** porque contiene el código completo de todas tus funciones:
- `update_user_presence`
- `mark_messages_as_read`
- `handle_new_user`
- Etc.

**Guarda este resultado COMPLETO** - es esencial para reconstruir la base de datos.

---

## 🔧 SI ALGÚN SCRIPT DA ERROR

### Error: "no rows returned"
✅ **NORMAL** - Significa que no tienes ese tipo de objeto (ej: no hay sequences)

### Error: "permission denied"
❌ Necesitas permisos de admin
👉 Asegúrate de estar logueado como propietario del proyecto

### Error: "relation does not exist"
❌ La tabla/vista no existe
👉 Verifica que estás en el proyecto correcto

---

## 📁 FORMATO DE SALIDA RECOMENDADO

Crea un archivo `SUPABASE_SCHEMA_COMPLETO.md` con esta estructura:

```markdown
# 📊 SCHEMA COMPLETO - PADELINER SUPABASE

**Fecha:** 2025-01-16
**Base de datos:** Padeliner Production

---

## 1. TABLAS

[Pega resultado de 01_TABLAS.sql]

---

## 2. COLUMNAS

[Pega resultado de 02_COLUMNAS.sql]

---

## 3. FOREIGN KEYS

[Pega resultado de 03_FOREIGN_KEYS.sql]

---

## 4. ÍNDICES

[Pega resultado de 04_INDICES.sql]

---

## 5. POLÍTICAS RLS

[Pega resultado de 05_POLITICAS_RLS.sql]

---

## 6. FUNCIONES - LISTA

[Pega resultado de 06_FUNCIONES_LISTA.sql]

---

## 7. FUNCIONES - CÓDIGO COMPLETO ⭐

[Pega resultado de 07_FUNCIONES_CODIGO.sql]

---

## 8. TRIGGERS

[Pega resultado de 08_TRIGGERS.sql]

---

## 9. ENUMS

[Pega resultado de 09_ENUMS.sql]

---

## 10. EXTENSIONES

[Pega resultado de 10_EXTENSIONES.sql]

---

## 11. CONSTRAINTS

[Pega resultado de 11_CONSTRAINTS.sql]

---

## 12. SEQUENCES

[Pega resultado de 12_SEQUENCES.sql]

---

## 13. VISTAS

[Pega resultado de 13_VISTAS.sql]

---

## 14. ESTADÍSTICAS

[Pega resultado de 14_ESTADISTICAS.sql]

---

**🎾 Fin del schema**
```

---

## 💾 BACKUP ADICIONAL (Opcional pero recomendado)

### **Opción A: Usar Supabase CLI** (si lo tienes instalado)

```bash
# Instalar CLI (si no lo tienes)
npm install -g supabase

# Login
npx supabase login

# Extraer schema completo
npx supabase db dump --db-url "tu_connection_string" > backup_completo.sql
```

### **Opción B: Usar pg_dump directo**

```bash
# Necesitas la connection string de Supabase
# Settings → Database → Connection string (URI)

pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" > backup.sql
```

---

## 📊 CHECKLIST COMPLETO

```
[ ] Ejecutar 01_TABLAS.sql → Copiar resultado
[ ] Ejecutar 02_COLUMNAS.sql → Copiar resultado
[ ] Ejecutar 03_FOREIGN_KEYS.sql → Copiar resultado
[ ] Ejecutar 04_INDICES.sql → Copiar resultado
[ ] Ejecutar 05_POLITICAS_RLS.sql → Copiar resultado
[ ] Ejecutar 06_FUNCIONES_LISTA.sql → Copiar resultado
[ ] Ejecutar 07_FUNCIONES_CODIGO.sql → Copiar resultado ⭐ CRÍTICO
[ ] Ejecutar 08_TRIGGERS.sql → Copiar resultado
[ ] Ejecutar 09_ENUMS.sql → Copiar resultado
[ ] Ejecutar 10_EXTENSIONES.sql → Copiar resultado
[ ] Ejecutar 11_CONSTRAINTS.sql → Copiar resultado
[ ] Ejecutar 12_SEQUENCES.sql → Copiar resultado
[ ] Ejecutar 13_VISTAS.sql → Copiar resultado
[ ] Ejecutar 14_ESTADISTICAS.sql → Copiar resultado
[ ] Organizar todo en SUPABASE_SCHEMA_COMPLETO.md
[ ] Guardar archivo en repo
[ ] Hacer backup adicional (opcional)
```

---

## 🎯 TIEMPO ESTIMADO

- Ejecutar los 14 scripts: **10-15 minutos**
- Organizar resultados: **5-10 minutos**
- **Total: 15-25 minutos**

---

## ⚡ ATAJOS

### Si tienes muchas tablas (>20):

Algunos resultados pueden ser muy largos. En ese caso:

1. **Exporta a CSV:**
   - Supabase SQL Editor → Click en "Download" → CSV
   - Abre en Excel/Google Sheets

2. **Limita resultados:**
   ```sql
   -- Añade al final de cualquier query:
   LIMIT 100;
   ```

---

## 🚨 LO MÁS IMPORTANTE

**NO OLVIDES EL SCRIPT 07** - Contiene el código de TODAS tus funciones.

Sin ese código, perderías:
- `update_user_presence`
- `mark_messages_as_read`  
- `handle_new_user`
- Cualquier otra función custom

---

**🎾 ¡Listo! Ejecuta cada script en orden y tendrás TODA tu configuración de Supabase documentada!**
