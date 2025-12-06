# 🔍 Configuración Google Search Console - GUÍA COMPLETA

## ✅ YA TIENES TODO CONFIGURADO

```
✅ Sitemap.ts - Generado automáticamente
✅ Robots.ts - Configurado correctamente
✅ Schema.org - Todos los markups
✅ Open Graph - Redes sociales
✅ Meta tags - SEO completo
```

---

## 📋 PASOS EN GOOGLE SEARCH CONSOLE

### **1. Dominio vinculado** ✅
Ya lo hiciste. Ahora sigue estos pasos:

---

### **2. ENVIAR SITEMAP** ⭐ IMPORTANTE

#### **URL del sitemap:**
```
https://www.padeliner.com/sitemap.xml
```

#### **Pasos:**
1. En Google Search Console, menú izquierdo
2. Click en **"Sitemaps"**
3. En "Añadir un sitemap nuevo"
4. Escribe: `sitemap.xml`
5. Click **"Enviar"**

**Estado esperado:** 
```
✅ Correcto
📊 URLs descubiertas: ~50-100
⏱️  Última lectura: [fecha]
```

---

### **3. VERIFICAR ROBOTS.TXT**

#### **URL del robots.txt:**
```
https://www.padeliner.com/robots.txt
```

Verifica que funcione:
1. Abre esa URL en tu navegador
2. Debe mostrar:
```
User-agent: *
Allow: /
Allow: /blog
Allow: /academias
Allow: /tienda
Disallow: /admin
Disallow: /api
Disallow: /auth

Sitemap: https://www.padeliner.com/sitemap.xml
```

---

### **4. SOLICITAR INDEXACIÓN DE PÁGINAS PRINCIPALES**

Acelera el proceso indexando manualmente:

1. **Página principal:**
   - Click en "Inspección de URL" (arriba)
   - Escribe: `https://www.padeliner.com`
   - Click **"Solicitar indexación"**

2. **Páginas importantes:**
   ```
   https://www.padeliner.com/entrenadores
   https://www.padeliner.com/clubes
   https://www.padeliner.com/academias
   https://www.padeliner.com/tienda
   https://www.padeliner.com/blog
   ```

**Límite:** ~10 solicitudes por día

---

### **5. VERIFICAR DATOS ESTRUCTURADOS**

1. Menú: **"Mejoras"** → **"Datos estructurados"**
2. Espera 1-3 días
3. Verifica que detecte:
   ```
   ✅ Organization
   ✅ WebSite
   ✅ WebPage
   ✅ LocalBusiness
   ```

---

### **6. CONFIGURAR PROPIEDAD ADICIONAL (Opcional)**

Google Search Console permite añadir dos tipos de propiedades:

**Ya tienes:** Propiedad de dominio (`padeliner.com`)

**Añade también:** Propiedad de prefijo URL
```
https://www.padeliner.com
```

**Ventaja:** Más datos específicos de la versión www

---

### **7. VERIFICAR COBERTURA**

1. Menú: **"Indexación"** → **"Páginas"**
2. Espera 3-7 días
3. Verifica:
   ```
   ✅ Páginas indexadas: ~50-100
   ⚠️  Páginas con advertencias: 0
   ❌ Páginas excluidas: Solo /admin, /api
   ```

---

### **8. ACTIVAR INFORMES**

Habilita todos los informes disponibles:

- ✅ **Rendimiento** - Clics, impresiones, posición
- ✅ **Experiencia en la página** - Core Web Vitals
- ✅ **Usabilidad móvil** - Responsive check
- ✅ **Enlaces** - Backlinks entrantes
- ✅ **Seguridad** - Malware, hacking

---

## 🎯 CHECKLIST COMPLETO

```
[✅] Dominio vinculado
[ ] Sitemap enviado (sitemap.xml)
[ ] Robots.txt verificado
[ ] Solicitar indexación páginas principales
[ ] Verificar datos estructurados (3-7 días)
[ ] Configurar propiedad prefijo URL (opcional)
[ ] Revisar cobertura (7 días)
[ ] Activar todos los informes
```

---

## 📊 URLS IMPORTANTES

### **Sitemaps y Robots:**
```
✅ Sitemap XML:  https://www.padeliner.com/sitemap.xml
✅ Robots.txt:   https://www.padeliner.com/robots.txt
```

### **Páginas principales para indexar:**
```
✅ Home:         https://www.padeliner.com
✅ Entrenadores: https://www.padeliner.com/entrenadores
✅ Clubes:       https://www.padeliner.com/clubes
✅ Academias:    https://www.padeliner.com/academias
✅ Tienda:       https://www.padeliner.com/tienda
✅ Blog:         https://www.padeliner.com/blog
```

---

## ⏱️ TIEMPOS ESPERADOS

```
Sitemap enviado:           Inmediato
Google rastrea sitemap:    1-3 días
Primeras páginas indexadas: 3-7 días
Indexación completa:       1-2 semanas
Datos estructurados:       1-2 semanas
Rendimiento completo:      2-4 semanas
```

---

## 🔍 VERIFICACIONES ADICIONALES

### **Test 1: Sitemap funciona**
```
https://www.padeliner.com/sitemap.xml
```
Debe mostrar XML con todas las URLs

### **Test 2: Robots funciona**
```
https://www.padeliner.com/robots.txt
```
Debe mostrar reglas de rastreo

### **Test 3: Datos estructurados**
```
https://search.google.com/test/rich-results
```
Pega tu URL y verifica schemas

### **Test 4: Móvil friendly**
```
https://search.google.com/test/mobile-friendly
```
Debe pasar todas las pruebas

### **Test 5: Page Speed**
```
https://pagespeed.web.dev/
```
Objetivo: >90 en mobile y desktop

---

## 🚀 OPTIMIZACIONES POST-SETUP

Una vez configurado, mejora continuamente:

### **1. Contenido regular**
- Publica blog posts semanalmente
- Actualiza páginas existentes
- Añade nuevos entrenadores/clubes

### **2. Performance**
- Optimiza imágenes (WebP)
- Minifica CSS/JS
- Usa CDN

### **3. Backlinks**
- Directorios de pádel
- Colaboraciones con clubes
- Guest posts en blogs deportivos

### **4. Actualizar sitemap**
El sitemap se regenera automáticamente en cada build, pero si añades contenido:
```bash
npm run build
```

---

## 📈 MONITOREAR PROGRESO

### **Diario:**
- No hagas nada, deja que Google rastree

### **Semanal:**
1. Revisa "Rendimiento" - Clics e impresiones
2. Verifica "Cobertura" - Páginas indexadas
3. Check "Experiencia" - Core Web Vitals

### **Mensual:**
1. Analiza tendencias de tráfico
2. Identifica páginas con más tráfico
3. Optimiza contenido de bajo rendimiento
4. Solicita indexación de páginas nuevas

---

## ⚠️ ERRORES COMUNES

### **1. Sitemap no accesible**
```
Error: No se puede acceder al sitemap
Solución: Verifica que el sitio esté desplegado en producción
```

### **2. Robots.txt bloquea todo**
```
Error: Todas las páginas bloqueadas
Solución: Ya está bien configurado, solo bloquea /admin y /api
```

### **3. Sin páginas indexadas después de 2 semanas**
```
Causa: Dominio muy nuevo o sin autoridad
Solución: 
  - Genera backlinks
  - Publica contenido regularmente
  - Comparte en redes sociales
```

---

## 🔗 ENLACES ÚTILES

```
Google Search Console:
https://search.google.com/search-console

Rich Results Test:
https://search.google.com/test/rich-results

Mobile-Friendly Test:
https://search.google.com/test/mobile-friendly

PageSpeed Insights:
https://pagespeed.web.dev/

Schema.org Validator:
https://validator.schema.org/
```

---

## 📞 RESUMEN RÁPIDO

**Para Google Search Console:**

1. ✅ Ya vinculaste dominio
2. ✅ Sitemap: Envía `sitemap.xml`
3. ✅ Verifica que funciona: `/sitemap.xml` y `/robots.txt`
4. ✅ Solicita indexación de 5-10 páginas principales
5. ✅ Espera 3-7 días
6. ✅ Revisa "Cobertura" para ver progreso

**URLs a enviar:**
```
sitemap.xml
```

**URLs a indexar manualmente (1 por día):**
```
/
/entrenadores
/clubes
/academias
/tienda
/blog
```

**Tiempo total:** 1-2 semanas para ver resultados

---

**🎾 ¡Ya está todo listo! Solo envía el sitemap y espera que Google haga su magia!**
