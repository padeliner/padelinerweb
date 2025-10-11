# 🔧 Solucionar Error 403 - Permission Denied

## Problema
```
Permission to padeliner/padelinerweb.git denied to padeliner.
fatal: unable to access: The requested URL returned error: 403
```

## Soluciones

### ✅ Solución 1: Verificar Token (Más Común)

Tu Personal Access Token necesita el permiso correcto:

1. Ve a: https://github.com/settings/tokens
2. Encuentra tu token (o crea uno nuevo)
3. **IMPORTANTE:** Debe tener estos permisos marcados:
   - ✅ `repo` (Full control of private repositories)
     - ✅ `repo:status`
     - ✅ `repo_deployment`
     - ✅ `public_repo`
     - ✅ `repo:invite`
4. Si creaste un token nuevo, cópialo
5. Ejecuta de nuevo el push

---

### ✅ Solución 2: Limpiar Credenciales de Windows

Windows guarda credenciales antiguas. Límpiala:

```powershell
# Opción A: Borrar credencial específica
git credential-manager delete https://github.com

# Opción B: Usar el administrador de credenciales
# 1. Win + R
# 2. Escribe: control /name Microsoft.CredentialManager
# 3. Busca "github.com" y elimínala
```

Luego intenta de nuevo:
```powershell
cd C:\Padeliner\web
git push -u origin main
```

---

### ✅ Solución 3: Configurar Token en URL

```powershell
cd C:\Padeliner\web

# Reemplaza TU_TOKEN con tu Personal Access Token
git remote set-url origin https://TU_TOKEN@github.com/padeliner/padelinerweb.git

git push -u origin main
```

**Ejemplo:**
```powershell
git remote set-url origin https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/padeliner/padelinerweb.git
```

---

### ✅ Solución 4: GitHub Desktop (Más Fácil)

1. Descarga: https://desktop.github.com/
2. Instala y abre
3. Sign in con tu cuenta de GitHub
4. File → Add Local Repository
5. Selecciona: `C:\Padeliner\web`
6. Clic en "Publish repository"
7. Repository name: `padelinerweb`
8. Organization: `padeliner`
9. ✅ ¡Listo!

---

### ✅ Solución 5: Verificar Permisos del Repositorio

1. Ve a: https://github.com/padeliner/padelinerweb
2. Settings (del repo)
3. Manage access
4. Verifica que tu usuario tenga permisos de "Write" o "Admin"

---

## 🚀 Comandos para Probar Después de Arreglar

```powershell
cd C:\Padeliner\web

# Verificar remote
git remote -v

# Verificar que tienes archivos para subir
git log --oneline

# Intentar push
git push -u origin main
```

---

## ✅ Si Todo Funciona Verás:

```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (41/41), done.
Writing objects: 100% (45/45), 123.45 KiB | 1.23 MiB/s, done.
Total 45 (delta 5), reused 0 (delta 0), pack-reused 0
To https://github.com/padeliner/padelinerweb.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 💡 Mi Recomendación

**Usa GitHub Desktop** - Es lo más rápido y evita problemas de tokens:
- https://desktop.github.com/
- No necesitas tokens
- Interface visual
- ¡5 minutos y listo!
