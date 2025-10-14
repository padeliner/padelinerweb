# 🤖 Sistema de Generación Automática de Blogs

## 📋 Descripción

Sistema profesional que genera y publica automáticamente **1 blog diario** sobre pádel con:
- ✅ Contenido optimizado para SEO
- ✅ Noticias y tendencias actuales
- ✅ Imágenes reales de Unsplash
- ✅ Publicación automática diaria

---

## 🔧 Configuración

### 1. Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local`:

```bash
# Gemini AI (OBLIGATORIO)
GEMINI_API_KEY=tu_api_key_de_gemini

# Unsplash (RECOMENDADO - para imágenes reales)
UNSPLASH_ACCESS_KEY=tu_access_key_de_unsplash

# Cron Job (OBLIGATORIO para producción)
CRON_API_KEY=tu_clave_secreta_para_cron
```

---

### 2. Obtener API Keys

#### **Gemini AI** (Ya la tienes)
✅ Ya configurada en tu proyecto

#### **Unsplash API** (Gratis)
1. Ve a: https://unsplash.com/developers
2. Crea una cuenta de desarrollador
3. Crea una nueva aplicación
4. Copia tu **Access Key**
5. Agrega a `.env.local`: `UNSPLASH_ACCESS_KEY=tu_key_aqui`

**Límites gratuitos:**
- 50 requests por hora
- Suficiente para 1 blog al día

#### **CRON_API_KEY** (Generar)
Genera una clave segura:
```bash
# En terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 3. Configurar Publicación Automática

#### **Opción A: Vercel Cron (Recomendado)**

El archivo `vercel.json` ya está configurado para:
- ⏰ Publicar diariamente a las **10:00 AM**
- 🌍 Zona horaria: UTC

**Para cambiar la hora:**
Edita `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/blog/auto-generate",
      "schedule": "0 14 * * *"  // 14:00 = 2 PM UTC
    }
  ]
}
```

Formato cron: `minuto hora día mes día_semana`
- `0 10 * * *` = Todos los días a las 10:00 AM
- `0 */6 * * *` = Cada 6 horas
- `0 9 * * 1` = Solo los lunes a las 9:00 AM

#### **Opción B: Servicio Externo (Alternativa)**

Si no usas Vercel, usa https://cron-job.org:

1. Crea cuenta gratis
2. Crea nuevo cron job:
   - **URL**: `https://tupadeliner.com/api/admin/blog/auto-generate`
   - **Método**: POST
   - **Header**: `Authorization: Bearer TU_CRON_API_KEY`
   - **Frecuencia**: Diaria a la hora deseada

---

### 4. Deploy en Vercel

```bash
# 1. Agregar variables de entorno en Vercel Dashboard
# Settings > Environment Variables

GEMINI_API_KEY=...
UNSPLASH_ACCESS_KEY=...
CRON_API_KEY=...

# 2. Deploy
vercel --prod

# 3. Verificar cron en Vercel Dashboard
# Settings > Cron Jobs
```

---

## 🎯 Temas Automáticos

El sistema rota entre 6 categorías con múltiples temas:

### 📰 Noticias
- Últimas tendencias en pádel profesional
- Análisis de torneos WPT
- Rankings y clasificaciones
- Fichajes y declaraciones

### 🎾 Técnica
- Mejora de bandeja, remate, volea
- Ejercicios específicos
- Técnicas profesionales

### 🧠 Estrategia
- Juego en pareja
- Posicionamiento táctico
- Lectura del juego

### 🏪 Equipamiento
- Mejores palas 2025
- Guías de compra
- Innovaciones tecnológicas

### 💪 Salud
- Prevención de lesiones
- Rutinas de calentamiento
- Nutrición deportiva

### 💡 Consejos
- Tips para principiantes
- Errores comunes
- Mentalidad ganadora

---

## 🧪 Probar Manualmente

Desde el panel de admin (próximamente) o vía API:

```bash
curl -X POST https://tupadeliner.com/api/admin/blog/auto-generate \
  -H "Authorization: Bearer TU_CRON_API_KEY"
```

O desde el navegador (si estás logueado como admin):
```
POST /api/admin/blog/auto-generate
```

---

## 📊 Características SEO

Cada blog generado incluye:

✅ **Título optimizado** (50-60 caracteres)
✅ **Meta descripción** (150-160 caracteres)
✅ **7-10 tags estratégicos**
✅ **Estructura H2/H3** clara
✅ **1200-1500 palabras**
✅ **Listas y negritas** para escaneabilidad
✅ **Datos y estadísticas** reales
✅ **Imagen de alta calidad**

---

## 🎨 Imágenes

### Con Unsplash API:
- ✅ Imágenes profesionales de pádel
- ✅ Alta resolución
- ✅ Licencia gratuita

### Sin Unsplash API:
- ⚠️ Blog se publica sin imagen
- Se puede agregar imagen manualmente después

---

## 📈 Monitoreo

### Ver blogs generados:
1. Panel Admin > Blog
2. Filtrar por: "Publicados"
3. Ordenar por: "Fecha"

### Verificar cron jobs:
- **Vercel**: Dashboard > Project > Logs
- **Externo**: Revisar logs del servicio

---

## 🔒 Seguridad

- ✅ Solo usuarios admin pueden ejecutar manualmente
- ✅ Cron jobs requieren API key
- ✅ No se expone información sensible
- ✅ Slugs únicos garantizados

---

## 🚀 Próximas Mejoras

- [ ] Integración con APIs de noticias reales (NewsAPI, etc.)
- [ ] Generación de imágenes con DALL-E/Stable Diffusion
- [ ] Traducción automática a otros idiomas
- [ ] Análisis de tendencias con Google Trends
- [ ] Auto-promoción en redes sociales
- [ ] A/B testing de títulos

---

## 📞 Soporte

¿Problemas con la configuración?
- Verifica las variables de entorno
- Revisa los logs de Vercel
- Confirma que el cron job está activo

---

## 📝 Ejemplo de Blog Generado

**Título**: "Secretos del Remate Perfecto en Pádel: Guía 2025"

**Contenido**: 1200 palabras con estructura profesional

**Tags**: padel, remate, técnica de pádel, world padel tour, consejos pádel

**Imagen**: Foto profesional de jugador rematando

**Resultado**: Blog completo publicado y visible en `/blog`
