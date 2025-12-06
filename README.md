# 🎾 Padeliner Web - Landing Page

Landing page moderna y responsive para Padeliner, construida con **Next.js 14**, **React**, **TailwindCSS** y **Framer Motion**.

---

## ✨ Características

### Diseño Moderno
- ✅ Hero section impactante estilo Airbnb
- ✅ Header sticky con animaciones
- ✅ Búsqueda avanzada de entrenadores
- ✅ 2 banners publicitarios atractivos
- ✅ Sección de tienda de productos
- ✅ Testimonios de usuarios
- ✅ Footer completo con enlaces y redes

### Animaciones
- ✅ Framer Motion para transiciones fluidas
- ✅ Hover effects en tarjetas y botones
- ✅ Scroll animations
- ✅ Loading states

### Responsive Design
- ✅ Mobile-first approach
- ✅ Adaptado para tablets y desktop
- ✅ Menú hamburguesa en móvil
- ✅ Grid layout flexible

### Performance
- ✅ Next.js 14 con App Router
- ✅ Lazy loading de imágenes
- ✅ Optimización de assets
- ✅ SEO optimizado

---

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd web
npm install
```

### 2. Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en: http://localhost:3000

### 3. Build de producción

```bash
npm run build
npm start
```

---

## 📁 Estructura del Proyecto

```
web/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Home page
│   └── globals.css         # Estilos globales
│
├── components/
│   ├── Header.tsx          # Header sticky con menú
│   ├── Hero.tsx            # Sección hero principal
│   ├── SearchSection.tsx   # Búsqueda de entrenadores
│   ├── AdBanner.tsx        # Banners publicitarios
│   ├── CoachesSection.tsx  # Grid de entrenadores
│   ├── ShopSection.tsx     # Tienda de productos
│   ├── HowItWorks.tsx      # Cómo funciona
│   ├── Testimonials.tsx    # Testimonios
│   └── Footer.tsx          # Footer completo
│
├── public/                 # Assets estáticos
├── package.json
├── tailwind.config.ts      # Configuración Tailwind
├── next.config.js          # Configuración Next.js
└── tsconfig.json           # Configuración TypeScript
```

---

## 🎨 Design System

### Colores

```typescript
primary: {
  500: '#00C853'  // Verde Padeliner
  600: '#00B248'
  700: '#009C3D'
}

neutral: {
  0: '#FFFFFF'
  50: '#FAFAFA'
  100: '#F5F5F5'
  900: '#212121'
}
```

### Tipografía

```typescript
Font: Inter (Google Fonts)
Sizes: text-sm, text-base, text-lg, text-xl, text-2xl...
Weights: font-medium, font-semibold, font-bold
```

### Spacing

```typescript
Tailwind: p-4, py-8, px-6, gap-4...
System: 4px base (4, 8, 16, 24, 32, 48, 64)
```

---

## 🔧 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.1.0 | Framework React |
| **React** | 18.2.0 | UI Library |
| **TypeScript** | 5.3.3 | Type safety |
| **TailwindCSS** | 3.4.1 | Estilos utility-first |
| **Framer Motion** | 11.0.3 | Animaciones |
| **Lucide React** | 0.454.0 | Iconos |

---

## 📱 Responsive Breakpoints

```typescript
sm: 640px   // Móviles
md: 768px   // Tablets
lg: 1024px  // Desktop
xl: 1280px  // Desktop grande
```

---

## 🎯 Componentes Principales

### Header
- Sticky al hacer scroll
- Background blur effect
- Menú hamburguesa en móvil
- Botón "Acceder" destacado

### Hero
- Background image con overlay
- CTA buttons primarios
- Stats destacadas
- Scroll indicator animado

### SearchSection
- Inputs tipo Airbnb
- Filtros rápidos
- Botón de búsqueda destacado
- Active states

### CoachesSection
- Grid responsive
- Cards con hover effect
- Rating y ubicación
- Botón "favorito"

### ShopSection
- Grid de productos
- Badges de ofertas
- Precios con descuento
- Categorías visuales

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd web
vercel
```

### Otras Opciones

- **Netlify**: Build command `npm run build`
- **AWS Amplify**: Compatible con Next.js
- **Docker**: Dockerfile incluido

---

## 📊 Performance Targets

```
Lighthouse Score:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

Core Web Vitals:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
```

---

## 🎨 Personalizacion

### Cambiar Colores

Edita `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#TU_COLOR_AQUI',
    // ...
  }
}
```

### Cambiar Contenido

Los componentes están en `components/`. Edita el contenido directamente.

### Añadir Páginas

Crea archivos en `app/`:

```
app/
├── about/
│   └── page.tsx
└── contact/
    └── page.tsx
```

---

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 is already in use"
```bash
# Usa otro puerto
PORT=3001 npm run dev
```

### Imágenes no cargan
- Verifica que las URLs estén en `next.config.js`
- Usa `next/image` en lugar de `img`

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

## ✅ Checklist Pre-Deploy

- [ ] Cambiar URLs de APIs a producción
- [ ] Optimizar imágenes
- [ ] Configurar variables de entorno
- [ ] Testear en móvil real
- [ ] Revisar SEO meta tags
- [ ] Configurar Google Analytics
- [ ] Probar todos los links
- [ ] Validar formularios

---

## 🎉 ¡Listo!

Tu landing page está lista para producción. Solo necesitas:

1. ✅ Instalar dependencias (`npm install`)
2. ✅ Ejecutar en desarrollo (`npm run dev`)
3. ✅ Personalizar contenido
4. ✅ Deploy a Vercel

**¡A conquistar el mundo del pádel!** 🎾🚀
