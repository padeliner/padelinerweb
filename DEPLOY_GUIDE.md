# 🚀 Guía de Deploy - GitHub + Vercel

## ✨ Sección de Apps Móviles Añadida

He añadido una sección moderna para promocionar las apps móviles con:
- ✅ Badges oficiales de App Store y Google Play
- ✅ Stats (descargas, rating, reseñas)
- ✅ Mockup de teléfono móvil
- ✅ Diseño responsive y animado
- ✅ Links a las stores (actualiza los URLs cuando tengas las apps publicadas)

---

## 📦 Paso 1: Subir a GitHub

### Opción A: Desde VS Code

1. **Inicializar Git** (si no está inicializado):
```bash
cd C:\Padeliner\web
git init
```

2. **Añadir archivos**:
```bash
git add .
git commit -m "Initial commit - Padeliner Web"
```

3. **Crear repositorio en GitHub**:
   - Ve a https://github.com/new
   - Nombre: `padeliner-web`
   - Descripción: `Landing page de Padeliner`
   - Público o Privado (tu elección)
   - NO inicialices con README, .gitignore ni licencia
   - Clic en "Create repository"

4. **Conectar y subir**:
```bash
git remote add origin https://github.com/TU_USUARIO/padeliner-web.git
git branch -M main
git push -u origin main
```

---

### Opción B: GitHub Desktop (Más Fácil)

1. Abre GitHub Desktop
2. File → Add Local Repository
3. Selecciona la carpeta `C:\Padeliner\web`
4. Clic en "Publish repository"
5. Nombre: `padeliner-web`
6. ✅ Listo!

---

## 🌐 Paso 2: Deploy en Vercel

### 1. Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Clic en "Sign Up"
3. **Importante**: Sign up con GitHub
4. Autoriza Vercel en GitHub

---

### 2. Importar Proyecto

1. En Vercel Dashboard, clic en **"Add New..."** → **"Project"**

2. Busca tu repositorio `padeliner-web` y clic en **"Import"**

3. **Configuración del Proyecto**:
   ```
   Framework Preset: Next.js
   Root Directory: ./  (dejar vacío)
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variables de Entorno** (si tienes):
   - No necesitas ninguna por ahora
   - Más adelante puedes añadir API keys aquí

5. Clic en **"Deploy"**

---

### 3. ¡Espera el Deploy!

- ⏱️ Tiempo: 2-3 minutos
- 📊 Verás el progreso en tiempo real
- ✅ Cuando termine, te dará una URL pública

---

## 🎉 ¡Listo! Tu Web Está Online

Tu web estará disponible en:
```
https://padeliner-web.vercel.app
```
O un dominio similar que te asigne Vercel.

---

## 🔧 Configurar Dominio Custom (Opcional)

### Si tienes un dominio propio:

1. En Vercel → Tu Proyecto → Settings → Domains
2. Añadir tu dominio: `padeliner.com`
3. Seguir instrucciones de DNS
4. Configurar DNS en tu proveedor:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. ⏱️ Espera 24-48 horas para propagación

---

## 🔄 Actualizar la Web (Deploy Automático)

Cada vez que hagas cambios:

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Descripción de los cambios"
git push
```

**¡Vercel detectará los cambios automáticamente y re-deploywará!** 🚀

---

## 📱 Actualizar Links de Apps Móviles

Cuando tengas las apps publicadas, actualiza los links en:

**Archivo**: `web/components/MobileAppsSection.tsx`

```typescript
// Línea ~59: Google Play
<motion.a
  href="https://play.google.com/store/apps/details?id=com.tupadeliner.app"
  // ...
>

// Línea ~76: App Store  
<motion.a
  href="https://apps.apple.com/app/idTU_APP_ID"
  // ...
>
```

Reemplaza:
- `com.tupadeliner.app` → Tu package name de Android
- `idTU_APP_ID` → Tu App ID de iOS

---

## 🎨 Personalización Adicional

### Cambiar Stats (Descargas, Rating)

**Archivo**: `web/components/MobileAppsSection.tsx` (líneas 83-95)

```typescript
<div className="flex flex-wrap gap-8">
  <div>
    <div className="text-3xl font-bold text-white">50K+</div>
    <div className="text-white/80">Descargas</div>
  </div>
  // ... actualiza los números
</div>
```

---

## 🐛 Troubleshooting

### Error: "Build Failed"
```bash
# En local, prueba el build
cd C:\Padeliner\web
npm run build
```
Si falla en local, arréglalo antes de hacer push.

### Error: "Module not found"
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
- Cierra Next.js local antes de probar
- O usa otro puerto: `PORT=3001 npm run dev`

---

## 📊 Monitoreo

Vercel te da automáticamente:
- ✅ Analytics de visitas
- ✅ Core Web Vitals
- ✅ Logs de errores
- ✅ Preview deploys para cada PR

---

## 🚀 Comandos Rápidos

```bash
# Desarrollo local
npm run dev

# Build de producción (testing)
npm run build
npm start

# Lint
npm run lint

# Deploy manual (desde Vercel CLI - opcional)
npm i -g vercel
vercel
```

---

## ✅ Checklist Final

Antes del deploy:
- [ ] Build funciona en local (`npm run build`)
- [ ] No hay errores de TypeScript
- [ ] Links de navegación funcionan
- [ ] Imágenes cargan correctamente
- [ ] Responsive en móvil, tablet y desktop
- [ ] SEO meta tags configurados
- [ ] Favicon visible
- [ ] Performance optimizada

---

## 🎉 ¡Tu Web Está Lista para Producción!

**Características incluidas:**
- ✅ Header sticky con hide/show al scroll
- ✅ 8 entrenadores destacados
- ✅ 4 clubes destacados
- ✅ 4 academias destacadas
- ✅ 4 productos de tienda
- ✅ 2 banners publicitarios
- ✅ Sección de apps móviles
- ✅ Testimonios
- ✅ Footer completo
- ✅ 100% responsive
- ✅ Animaciones smooth
- ✅ SEO optimizado

---

**¿Listo para conquistar el mundo del pádel?** 🎾🚀
