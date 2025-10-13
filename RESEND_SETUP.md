# 📧 Configuración de Resend para Emails del Chatbot

## 🚀 Pasos para configurar Resend

### 1. Crear cuenta en Resend

1. Ve a: **https://resend.com**
2. Clic en **"Sign Up"**
3. Regístrate con tu email o GitHub
4. Verifica tu email

### 2. Obtener API Key

1. Ve a: **https://resend.com/api-keys**
2. Clic en **"Create API Key"**
3. Dale un nombre: `Padeliner Chatbot`
4. Selecciona permisos: **"Full Access"** o **"Sending Access"**
5. Copia la API key (empieza con `re_...`)

### 3. Configurar dominio (IMPORTANTE)

Para enviar emails desde `chatbot@padeliner.com`:

#### Opción A: Usar dominio verificado

1. Ve a: **https://resend.com/domains**
2. Clic en **"Add Domain"**
3. Añade: `padeliner.com`
4. Añade los registros DNS que te indique Resend:
   - SPF
   - DKIM
   - DMARC
5. Espera verificación (puede tardar unos minutos)

#### Opción B: Usar email de prueba (temporal)

Si no tienes acceso al DNS de padeliner.com, usa temporalmente:

```typescript
from: 'Chatbot Padeliner <onboarding@resend.dev>'
```

⚠️ **Nota**: El email `onboarding@resend.dev` solo funciona para enviar a:
- Tu propio email verificado
- Emails de prueba

### 4. Añadir API key al proyecto

Edita `.env.local` y reemplaza:

```env
RESEND_API_KEY=re_tu_api_key_real_aqui
```

### 5. Instalar dependencia

```bash
npm install resend
```

### 6. Reiniciar servidor

```bash
npm run dev
```

## ✅ Probar envío de email

1. Abre el chatbot
2. Escribe: "Quiero hablar con alguien del equipo"
3. El bot preguntará: "¿podrías proporcionarme tu email o número de WhatsApp?"
4. Responde con tu email: "mi email es tuemaiL@example.com"
5. Verifica que llegue el email a `padeliner@gmail.com`

## 📊 Límites del Plan Gratuito

Resend ofrece:
- ✅ **100 emails/día** GRATIS
- ✅ **3,000 emails/mes** GRATIS
- ✅ Sin tarjeta de crédito requerida
- ✅ Dominio personalizado incluido

Para más emails:
- **Pay as you go**: $0.10 por 1,000 emails
- Muy económico para empezar

## 🔧 Configuración en Vercel (Producción)

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Añade:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_tu_api_key`
4. **Save** y redeploy

## 🎯 Emails que se envían

### Email a: `padeliner@gmail.com`

**Asunto**: 🚨 Solicitud de Soporte - conv_123456789

**Contenido**:
- ID de conversación
- Nombre del usuario
- Email del usuario (si está autenticado)
- **Contacto proporcionado** (email/WhatsApp que dio el usuario)
- ID de usuario (si está autenticado)
- Fecha y hora
- **Conversación completa**
- **Último mensaje** destacado

## 🔒 Seguridad

- ✅ La API key NUNCA se expone al cliente
- ✅ Solo se usa en el servidor (API Route)
- ✅ Los emails se envían de forma segura
- ✅ No se almacenan contraseñas

## 📝 Personalizar el email

Para cambiar el destinatario, edita `app/api/chat/route.ts`:

```typescript
const emailData = await resend.emails.send({
  from: 'Chatbot Padeliner <chatbot@padeliner.com>',
  to: 'otro-email@example.com', // 👈 Cambia esto
  subject: `🚨 Solicitud de Soporte - ${data.conversationId}`,
  // ...
})
```

## 🐛 Troubleshooting

### Error: "API key not valid"
- Verifica que la API key esté correcta en `.env.local`
- Asegúrate de haber copiado la key completa
- Reinicia el servidor: `npm run dev`

### Error: "Domain not verified"
- Usa `onboarding@resend.dev` temporalmente
- O verifica tu dominio en Resend

### No llegan los emails
1. Revisa la carpeta de spam
2. Verifica que el email sea correcto
3. Revisa los logs del servidor
4. Comprueba el dashboard de Resend: https://resend.com/emails

## 🔗 Links útiles

- **Dashboard**: https://resend.com/home
- **API Keys**: https://resend.com/api-keys
- **Dominios**: https://resend.com/domains
- **Emails enviados**: https://resend.com/emails
- **Documentación**: https://resend.com/docs

---

**¿Problemas?** Revisa los logs del servidor y el dashboard de Resend.
