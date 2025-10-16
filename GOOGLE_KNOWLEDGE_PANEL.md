# 🔍 Google Knowledge Panel - Panel de Conocimiento

## ¿Qué es el Knowledge Panel?

Es el **panel lateral** que aparece en Google cuando buscas una marca/empresa, mostrando:
- Logo/Imagen
- Descripción
- Ubicación
- Redes sociales
- Horarios
- Valoraciones

**Ejemplo:** Busca "Padeliner" en Google → Panel a la derecha

---

## ✅ LO QUE YA ESTÁ IMPLEMENTADO

### 1. **Schema.org Markup** ✅

Ya añadido en `components/SchemaOrg.tsx`:

```json
{
  "@type": "Organization",
  "name": "Padeliner",
  "logo": "/padeliner-logo.png",
  "image": "/hero-padel.jpg",  ← IMAGEN PRINCIPAL
  "email": "contact@padeliner.com",
  "telephone": "+34-699-984-661",
  "address": "Valencia, España"
}
```

### 2. **Tres tipos de Schema:**
- ✅ **Organization** - Datos de la empresa
- ✅ **WebSite** - Búsqueda en el sitio
- ✅ **LocalBusiness** - Negocio local

### 3. **Imágenes configuradas:**
- ✅ Logo: `padeliner-logo.png`
- ✅ Imagen principal: `hero-padel.jpg`

---

## 📋 LO QUE NECESITAS HACER (IMPORTANTE)

### **1. Google Business Profile** ⭐ ESENCIAL

**SIN ESTO NO APARECERÁ EL PANEL**

```
1. Ve a: https://business.google.com
2. "Administrar ahora" o "Añadir empresa"
3. Nombre: Padeliner
4. Categoría: Plataforma deportiva / Servicio de deporte
5. Ubicación: Valencia, España
6. Teléfono: +34 699 984 661
7. Sitio web: https://www.padeliner.com
8. Sube hero-padel.jpg como foto principal
9. Verifica la propiedad (código, teléfono, postal)
```

**Tiempo de verificación:** 1-3 días

### **2. Verificación de propiedad en Google Search Console**

```
1. Ve a: https://search.google.com/search-console
2. Añadir propiedad: www.padeliner.com
3. Verificar (archivo HTML, DNS, o Google Analytics)
4. Enviar sitemap.xml
```

### **3. Actualizar redes sociales reales**

En `components/SchemaOrg.tsx` líneas 18-23, cambia por tus URLs reales:

```tsx
sameAs: [
  'https://www.facebook.com/padeliner',      // TU FACEBOOK REAL
  'https://www.instagram.com/padeliner',     // TU INSTAGRAM REAL
  'https://twitter.com/padeliner',           // TU TWITTER REAL
  'https://www.linkedin.com/company/padeliner' // TU LINKEDIN REAL
]
```

### **4. Coordenadas GPS exactas**

En `SchemaOrg.tsx` líneas 67-70, actualiza con tu ubicación real:

```tsx
geo: {
  '@type': 'GeoCoordinates',
  latitude: 39.4699,    // LATITUD REAL
  longitude: -0.3763    // LONGITUD REAL
}
```

---

## ⏱️ ¿CUÁNTO TARDA EN APARECER?

```
Google Business Profile:
  - Verificación: 1-3 días
  - Aparece en búsquedas: 1-2 semanas

Knowledge Panel:
  - Primera aparición: 2-4 semanas
  - Completamente estable: 1-3 meses

Schema.org:
  - Google lo lee: Inmediato
  - Se refleja en búsquedas: 1-2 semanas
```

---

## 🔍 VERIFICAR QUE FUNCIONA

### **1. Test de datos estructurados de Google**

```
https://search.google.com/test/rich-results
```

- Pega: `https://www.padeliner.com`
- Verifica que detecte: Organization, LocalBusiness, WebSite

### **2. Ver preview del schema**

```
https://validator.schema.org/
```

- Pega tu URL
- Debe mostrar todos los datos correctamente

---

## 📸 IMÁGENES RECOMENDADAS

Para el Knowledge Panel, usa imágenes:

**Logo:**
- ✅ Ya tienes: `padeliner-logo.png`
- Tamaño: 500x500px mínimo
- Formato: PNG con fondo transparente

**Imagen principal:**
- ✅ Ya configurada: `hero-padel.jpg`
- Tamaño: 1200x900px o mayor
- Formato: JPG de alta calidad
- Contenido: Pádel, instalaciones, acción

**Otras imágenes (para Google Business):**
- Fotos de clubes
- Entrenadores en acción
- Instalaciones
- Eventos

---

## 🎯 CHECKLIST COMPLETO

```
[ ] 1. Crear Google Business Profile
[ ] 2. Verificar propiedad del negocio
[ ] 3. Subir hero-padel.jpg a Google Business
[ ] 4. Añadir más fotos (mínimo 5)
[ ] 5. Completar todos los datos en Google Business
[ ] 6. Verificar en Google Search Console
[ ] 7. Actualizar URLs de redes sociales reales
[ ] 8. Actualizar coordenadas GPS exactas
[ ] 9. Pedir reviews a clientes en Google
[ ] 10. Esperar 2-4 semanas
```

---

## 📊 FACTORES QUE AYUDAN

Google decide mostrar el Knowledge Panel según:

1. **Autoridad del dominio** - Enlaces, tráfico, antigüedad
2. **Menciones en otras webs** - Wikipedia, noticias, blogs
3. **Presencia en redes sociales** - Seguidores, actividad
4. **Google Business verificado** ⭐ MÁS IMPORTANTE
5. **Schema.org correcto** ✅ Ya lo tienes
6. **Reviews y ratings** - Valoraciones de usuarios
7. **Consistencia NAP** - Name, Address, Phone en todas partes

---

## 🚀 RESULTADO ESPERADO

Cuando busques "Padeliner" en Google:

```
┌─────────────────────────────────────┐
│ [LOGO]  Padeliner                   │
│                                     │
│ Plataforma de Pádel                │
│ www.padeliner.com                   │
│                                     │
│ [IMAGEN: hero-padel.jpg]           │
│                                     │
│ 📍 Valencia, España                 │
│ ☎️ +34 699 984 661                  │
│ ⏰ Abierto 24 horas                 │
│ ⭐ 4.8 (127 reseñas)                │
│                                     │
│ 🔗 Facebook                         │
│ 🔗 Instagram                        │
│ 🔗 LinkedIn                         │
└─────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE

- **Schema.org SOLO no es suficiente** → Necesitas Google Business
- **Google Business es GRATIS** → No cuesta nada
- **Es un proceso gradual** → Paciencia de 2-4 semanas
- **Sigue actualizando contenido** → Posts, fotos, updates

---

## 🔧 ARCHIVOS MODIFICADOS

```
✅ components/SchemaOrg.tsx - Creado
✅ app/layout.tsx - SchemaOrg añadido
✅ Imagen: hero-padel.jpg - Configurada
```

---

## 📞 DATOS A ACTUALIZAR

Revisa estos datos en `SchemaOrg.tsx`:

```tsx
email: 'contact@padeliner.com'        // ¿Es correcto?
telephone: '+34-699-984-661'          // ¿Es correcto?
address: 'Valencia, España'           // ¿Dirección exacta?
latitude: 39.4699                     // ¿Coordenadas exactas?
longitude: -0.3763                    // ¿Coordenadas exactas?
```

---

**🎾 ¡Con Google Business Profile verificado + Schema.org, el Knowledge Panel aparecerá en 2-4 semanas!**
