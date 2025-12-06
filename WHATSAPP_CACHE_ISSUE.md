# 📱 WhatsApp muestra imagen cuadrada - SOLUCIÓN

## 🔍 EL PROBLEMA

**Facebook Debugger:** ✅ Muestra imagen horizontal (1200x630)
**WhatsApp:** ❌ Muestra imagen cuadrada (caché antigua)

---

## ⚠️ POR QUÉ OCURRE

WhatsApp tiene su **propia caché** independiente de Facebook:

1. **Facebook Debugger** usa caché de Facebook (se limpia con "Scrape Again")
2. **WhatsApp** usa caché de WhatsApp (MUY agresivo, tarda días/semanas)
3. Son **sistemas separados** aunque ambos sean de Meta

---

## ✅ SOLUCIONES

### **Opción 1: Esperar (24-72 horas)**

WhatsApp actualiza automáticamente, pero puede tardar:
- **Mínimo:** 24 horas
- **Normal:** 48-72 horas  
- **Máximo:** 7-10 días

### **Opción 2: Cambiar nombre de archivo** ⭐ MÁS RÁPIDO

```bash
# Renombrar el archivo
mv public/og-image.png public/og-image-v3.png
```

Actualizar en `app/layout.tsx`:
```tsx
url: 'https://www.padeliner.com/og-image-v3.png',
```

**Resultado:** WhatsApp lo verá como archivo nuevo → Sin caché

### **Opción 3: Añadir timestamp único**

Ya lo tienes con `?v=2`, pero puedes cambiar el número:

```tsx
url: 'https://www.padeliner.com/og-image.png?v=3',
```

**Efectividad variable** - WhatsApp puede ignorar query params

### **Opción 4: Limpiar caché de WhatsApp (NO PÚBLICO)**

WhatsApp **NO tiene** herramienta pública de debug como Facebook.
Solo Facebook puede invalidar caché de WhatsApp internamente.

---

## 🎯 MEJOR SOLUCIÓN (RECOMENDADA)

1. **Ya funciona en Facebook** ✅
2. **Espera 48h para WhatsApp** ⏱️
3. Si urgente → **Renombra archivo** (og-image-v3.png)

---

## 📊 VERIFICACIÓN

### Facebook/Twitter/LinkedIn
```
✅ Usan Facebook Debugger cache
✅ Se limpian con "Scrape Again"
✅ Actualización: Inmediata
```

### WhatsApp
```
⚠️ Usa caché independiente
⚠️ NO tiene herramienta de debug pública
⚠️ Actualización: 24-72 horas
```

---

## 💡 CONSEJO FUTURO

Para **lanzamientos importantes**, usa nombres de archivo únicos:

```
og-image-2024.png
og-image-christmas.png
og-image-promo-jan.png
```

Así evitas problemas de caché en cualquier plataforma.

---

## 📌 RESUMEN

**Tu Open Graph está CORRECTO** ✅
- Imagen: 1200x630px ✅
- Facebook Debugger: OK ✅
- Configuración: Perfecta ✅

**El problema es SOLO caché de WhatsApp** ⏱️
- Solución: Esperar 48h o renombrar archivo
- Es normal y afecta a todos los sitios web
