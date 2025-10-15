# 📊 CÓMO INSPECCIONAR LA BASE DE DATOS

## 🎯 Objetivo
Ver toda la estructura de tablas y columnas de tu base de datos Supabase para crear scripts SQL correctos.

---

## 📝 PASO A PASO:

### 1️⃣ **Abre Supabase Dashboard**
```
https://supabase.com/dashboard/project/[TU-PROJECT-ID]/editor
```

### 2️⃣ **Ve a SQL Editor**
- En el sidebar izquierdo, click en "SQL Editor"
- Click en "New Query"

### 3️⃣ **Copia y Pega el Script**
Abre el archivo: `supabase/migrations/inspect_database_structure.sql`
Copia TODO el contenido y pégalo en el SQL Editor

### 4️⃣ **Ejecuta el Script**
- Click en "Run" o presiona `Ctrl + Enter`
- Verás múltiples resultados

---

## 📋 QUÉ VAS A VER:

### **Resultado 1: Todas las tablas**
```
table_name              | table_type
------------------------|------------
users                   | BASE TABLE
conversations           | BASE TABLE
conversation_messages   | BASE TABLE
...
```

### **Resultado 2: Todas las columnas**
```
table_name    | column_name  | data_type | is_nullable
--------------|--------------|-----------|------------
users         | id           | uuid      | NO
users         | email        | text      | YES
users         | role         | text      | YES
users         | full_name    | text      | YES
...
```

### **Resultado 3-8: Detalles específicos**
- Estructura de tabla `users`
- Estructura de tabla `conversations`
- Foreign keys
- Índices
- Etc.

---

## ✅ ENVÍAME LA INFO:

Después de ejecutar, envíame:

1. **Lista de todas las tablas** (Resultado 1)
2. **Columnas de la tabla `users`** (Resultado 3)
3. **¿Existe trainer_profiles?** (Resultado 6)
4. **Datos de Alvaro y Guillermo** (Resultado 8)

Con esa info podré crear el script SQL correcto.

---

## 🚀 ALTERNATIVA RÁPIDA:

Si quieres algo más simple, ejecuta solo esto:

```sql
-- Ver todas las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Ver columnas de users
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users';

-- Ver si existen tablas de entrenadores
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%trainer%';
```

---

## 💡 TIPS:

- Si ves muchos resultados, puedes ejecutar las queries una por una
- Copia los resultados a un archivo de texto
- Busca específicamente tablas que contengan:
  - `trainer` o `coach` (entrenadores)
  - `conversation` (chat)
  - `profile` (perfiles)

---

**¡Con esta info podré crear el script SQL perfecto! 🎾**
