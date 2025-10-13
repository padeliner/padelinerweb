# 🤖 Configuración del ChatBot con Gemini AI

## 📦 Instalación de dependencias

✅ **YA INSTALADO** - El paquete ya está en el proyecto:

```bash
@google/generative-ai@0.21.0
```

## 🔑 Configuración de API Keys (IMPORTANTE)

### 1. Obtener API Key de Gemini (100% GRATIS)

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Clic en **"Get API key"** → **"Create API key in new project"**
4. Copia tu API key (empieza con `AIza...`)

### 2. Configurar Variables de Entorno

Edita tu archivo `.env.local` y reemplaza la key:

```env
GEMINI_API_KEY=AIzaSy...tu_key_real_aqui
```

### 3. Reiniciar el servidor

```bash
npm run dev
```

## 🚀 Modelo Usado

**gemini-1.5-flash** (Recomendado)
- ⚡ Más rápido y económico
- 💰 Tier gratuito: 15 req/min, 1500 req/día
- 🎯 Ideal para chatbots
- 📝 Soporte para 1M tokens de contexto

Ver detalles en: [GEMINI_SETUP.md](./GEMINI_SETUP.md)

## ✨ Características del ChatBot

### Para Usuarios:
- ✅ Búsqueda de entrenadores por ubicación
- ✅ Respuestas inteligentes sobre servicios
- ✅ Tarjetas clicables de entrenadores
- ✅ Escalación a soporte humano cuando sea necesario

### Para Entrenadores:
- ✅ Información sobre registro y condiciones
- ✅ Detalles de comisiones y pagos
- ✅ Respuestas sobre el funcionamiento de la plataforma

### Sistema de Inteligencia:
- 🧠 **Detección de intenciones**: El bot entiende qué quiere el usuario
- 📍 **Búsqueda geolocalizada**: Filtra entrenadores por ciudad/región
- 📧 **Escalación inteligente**: Detecta cuándo el usuario necesita soporte humano
- 📊 **Historial de conversación**: Mantiene el contexto de toda la conversación

## 🎯 Ejemplos de uso

### Buscar entrenadores:
```
Usuario: "Quiero reservar una clase cerca de Murcia"
Bot: Muestra tarjetas de entrenadores en Murcia
```

### Preguntas sobre registro:
```
Usuario: "Soy entrenador, ¿cuánto cobráis?"
Bot: "Los entrenadores NO pagan cuotas mensuales. Solo cobramos una comisión del 15% por cada reserva completada..."
```

### Contactar soporte:
```
Usuario: "Necesito hablar con alguien del equipo"
Bot: "Por supuesto, voy a conectarte con nuestro equipo de soporte."
     [Se envía email automático al equipo]
```

## 📧 Configuración de Emails (Opcional)

Para recibir notificaciones cuando un usuario solicite soporte humano:

### Opción 1: Resend (Recomendado)

```bash
npm install resend
```

```env
RESEND_API_KEY=tu_resend_api_key
```

Descomenta las líneas en `app/api/chat/route.ts`:

```typescript
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send(emailBody)
```

### Opción 2: SendGrid

```bash
npm install @sendgrid/mail
```

### Opción 3: Nodemailer

```bash
npm install nodemailer
```

## 🎨 Personalización

### Modificar el System Prompt:

Edita `SYSTEM_PROMPT` en `app/api/chat/route.ts` para:
- Cambiar el tono del bot
- Añadir más información sobre servicios
- Modificar las condiciones y precios
- Ajustar el comportamiento

### Personalizar la UI:

Edita `components/ChatBot.tsx` para:
- Cambiar colores y estilos
- Modificar el tamaño de la ventana
- Ajustar la posición del botón flotante
- Personalizar los mensajes iniciales

## 🔍 Estructura de Archivos

```
/components
  └── ChatBot.tsx              # Componente UI del chatbot

/app/api/chat
  └── route.ts                 # Lógica backend + Gemini AI

/lib/mock-data
  └── coaches.ts               # Datos de entrenadores (para filtrar)
```

## 🚀 Despliegue

### Variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade: `GEMINI_API_KEY`
4. Opcional: `RESEND_API_KEY`

### Límites de Gemini:

- **Free tier**: 60 requests/minuto
- **Paid**: Sin límites (pay-as-you-go)

## 📊 Monitoreo

El chatbot registra en consola:
- Conversaciones que solicitan soporte
- Emails enviados al equipo
- Errores en la API

Para producción, considera añadir:
- Logging a Sentry o similar
- Analytics de conversaciones
- Base de datos para guardar historial

## 🛠️ Troubleshooting

### Error: "Cannot find module '@google/generative-ai'"
```bash
npm install @google/generative-ai
```

### Error: "API key not valid"
- Verifica que tu GEMINI_API_KEY esté en .env.local
- Comprueba que la key sea válida en Google AI Studio

### El bot no responde:
- Revisa la consola del navegador
- Verifica los logs del servidor
- Comprueba que la API route esté funcionando: `/api/chat`

## 📝 Próximas Mejoras

- [ ] Guardar conversaciones en base de datos
- [ ] Panel de admin para ver chats
- [ ] Métricas y analytics
- [ ] Soporte multi-idioma
- [ ] Integración con WhatsApp
- [ ] Respuestas con imágenes y videos
