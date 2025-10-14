# 📁 Supabase - Migraciones SQL

Esta carpeta contiene todas las migraciones SQL y scripts de base de datos para el proyecto Padeliner.

## 📋 Estructura

```
supabase/
├── migrations/           # Scripts SQL de migraciones
│   └── admin_rls_policies.sql
└── README.md            # Este archivo
```

---

## 🔒 Políticas RLS (Row Level Security)

### **admin_rls_policies.sql**
Políticas de seguridad que permiten a los usuarios con rol `admin` gestionar todos los recursos de la plataforma.

**¿Cuándo ejecutar?**
- Después de crear las tablas principales
- Después de las políticas básicas de usuarios
- Cuando necesites dar permisos de admin a un usuario

**Cómo ejecutar:**
1. Ve a Supabase → SQL Editor
2. Abre el archivo `admin_rls_policies.sql`
3. Copia y pega el contenido
4. Ejecuta

**Verifica que funciona:**
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE policyname ILIKE '%admin%'
ORDER BY tablename;
```

---

## 🎯 Políticas Actuales

| Tabla | Política | Comando |
|-------|----------|---------|
| **users** | Admins can view all users | SELECT |
| **users** | Admins can update all users | UPDATE |
| **users** | Admins can delete users | DELETE |
| **coaches** | Admins can view all coaches | SELECT |
| **coaches** | Admins can manage all coaches | ALL |
| **academies** | Admins can view all academies | SELECT |
| **academies** | Admins can manage all academies | ALL |
| **clubs** | Admins can view all clubs | SELECT |
| **clubs** | Admins can manage all clubs | ALL |
| **sessions** | Admins can view all sessions | SELECT |
| **sessions** | Admins can manage all sessions | ALL |

---

## 🛠️ Comandos Útiles

### Ver todas las políticas de una tabla:
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Ver si RLS está habilitado:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Eliminar una política:
```sql
DROP POLICY "nombre_politica" ON nombre_tabla;
```

### Habilitar/Deshabilitar RLS:
```sql
-- Habilitar
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;

-- Deshabilitar (SOLO EN DESARROLLO)
ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;
```

---

## 📚 Recursos

- [Documentación RLS de Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Políticas de PostgreSQL](https://www.postgresql.org/docs/current/sql-createpolicy.html)

---

**Última actualización:** Octubre 2025
