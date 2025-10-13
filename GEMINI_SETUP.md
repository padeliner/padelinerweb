# 🤖 Configuración de Gemini API - Mejores Prácticas 2025

## 📊 Modelos Disponibles (Tier Gratuito)

### Recomendado: **gemini-1.5-flash** ✅
- ⚡ **Más rápido** y económico
- 💰 **GRATIS**: 15 requests/minuto, 1 millón requests/día
- 📝 Contexto: 1M tokens
- 🎯 Ideal para chatbots y aplicaciones interactivas
- 💡 Mejor relación calidad-precio

### Alternativas:

**gemini-1.5-pro**
- 🧠 Más inteligente pero más lento
- 💰 GRATIS: 2 requests/minuto, 50 requests/día
- 📝 Contexto: 2M tokens
- ⚠️ Límites más restrictivos

**gemini-2.5-flash-lite** (Más nuevo)
- ⚡ Ultra rápido
- 📝 Contexto: 1M tokens
- 🆕 Preview - puede cambiar

## 🔑 Obtener API Key (100% GRATIS)

### Paso 1: Crear API Key
1. Ve a: **https://aistudio.google.com/app/apikey**
2. Inicia sesión con tu cuenta de Google
3. Clic en **"Get API key"**
4. Selecciona **"Create API key in new project"**
5. Copia la key (empieza con `AIza...`)

### Paso 2: Configurar en tu proyecto
```bash
# Añade a .env.local
GEMINI_API_KEY=AIzaSy...tu_key_aqui
```

### Paso 3: Reiniciar servidor
```bash
npm run dev
```

## 💰 Límites del Tier Gratuito (2025)

### gemini-1.5-flash (RECOMENDADO):
```
✅ 15 requests por minuto
✅ 1,500 requests por día
✅ 1 millón de tokens por minuto
✅ TOTALMENTE GRATIS
```

### Si excedes los límites:
- Error 429 (quota exceeded)
- Espera 1 minuto y reintenta
- O actualiza a plan de pago (muy económico)

## 🚀 Mejores Prácticas

### 1. Configuración Óptima del Modelo
```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,      // Balance creatividad/precisión
    topP: 0.95,           // Diversidad de respuestas
    topK: 40,             // Vocabulario controlado
    maxOutputTokens: 2048, // Respuestas concisas
  },
})
```

### 2. Manejo de Errores Robusto
```typescript
try {
  const result = await chat.sendMessage(message)
} catch (error) {
  if (error.message.includes('quota')) {
    // Cuota excedida - reintentar después
  } else if (error.message.includes('API key')) {
    // Problema con la key
  } else if (error.message.includes('SAFETY')) {
    // Contenido bloqueado por seguridad
  }
}
```

### 3. Optimizar Tokens
- ✅ Usa system prompts concisos
- ✅ Limita el historial de conversación (últimos 10 mensajes)
- ✅ No envíes información redundante
- ✅ Usa `maxOutputTokens` para controlar respuestas

### 4. Caché de Respuestas (Opcional)
```typescript
// Para preguntas frecuentes, guarda respuestas
const cache = new Map()
if (cache.has(question)) {
  return cache.get(question)
}
```

## 🔒 Seguridad

### ✅ Buenas Prácticas:
```typescript
// ✅ CORRECTO: API key en servidor
// app/api/chat/route.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ❌ INCORRECTO: NO expongas la key en cliente
// components/ChatBot.tsx
// const genAI = new GoogleGenerativeAI('AIza...') // ¡NUNCA HAGAS ESTO!
```

### Variables de Entorno:
```bash
# .env.local (local)
GEMINI_API_KEY=AIza...

# Vercel (producción)
Settings → Environment Variables → Add
GEMINI_API_KEY = AIza...
```

## 📊 Monitoreo de Uso

### En Google AI Studio:
1. Ve a: https://aistudio.google.com
2. Menú → **"Usage"**
3. Revisa:
   - Requests por día
   - Tokens consumidos
   - Errores

### Alertas Recomendadas:
- ⚠️ 80% del límite diario → Avisar al equipo
- 🚨 95% del límite → Reducir uso o upgrade

## 🆙 Upgrade a Plan de Pago (Opcional)

Si necesitas más requests:

### Pay-as-you-go:
```
gemini-1.5-flash:
- Input: $0.075 / 1M tokens
- Output: $0.30 / 1M tokens

Ejemplo: 1000 chats/día = ~$3-5/mes
```

### Cómo activar:
1. Google Cloud Console
2. Enable billing
3. Automáticamente sin límites

## 🐛 Troubleshooting

### Error 500 en /api/chat:
```bash
# 1. Verificar API key
echo $GEMINI_API_KEY  # Debe mostrar tu key

# 2. Revisar logs del servidor
# Busca: "❌ GEMINI_API_KEY no está configurada"

# 3. Reiniciar servidor
npm run dev
```

### Error: "API key not valid":
- ✅ Verifica que la key sea correcta
- ✅ Comprueba que no tenga espacios
- ✅ Regenera la key en AI Studio

### Error: "SAFETY" bloqueado:
- El modelo bloqueó contenido sensible
- Revisa el system prompt
- Ajusta el contenido del mensaje

### Error 429: "Resource exhausted":
- Has excedido los límites gratuitos
- Espera 1 minuto
- Reduce frecuencia de requests
- Considera upgrade

## 📈 Optimización de Costos

### Estrategias:
1. **Caché local**: Guarda respuestas frecuentes
2. **Debouncing**: Espera 500ms antes de enviar
3. **Límite de mensajes**: Máximo 20 por sesión
4. **Fallback**: Si falla, muestra opciones predefinidas

### Ejemplo de Debouncing:
```typescript
let timeout: NodeJS.Timeout
const debouncedSend = (message: string) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => sendMessage(message), 500)
}
```

## 🎯 Resumen Rápido

```bash
# 1. Obtener API key (gratis)
https://aistudio.google.com/app/apikey

# 2. Añadir a .env.local
GEMINI_API_KEY=AIza...

# 3. Modelo recomendado
gemini-1.5-flash

# 4. Límites gratuitos
15 req/min, 1500 req/día

# 5. Reiniciar servidor
npm run dev
```

## 🔗 Links Útiles

- **API Keys**: https://aistudio.google.com/app/apikey
- **Docs oficiales**: https://ai.google.dev/gemini-api/docs
- **Modelos**: https://ai.google.dev/gemini-api/docs/models
- **Pricing**: https://ai.google.dev/pricing
- **Status**: https://status.cloud.google.com

---

**¿Problemas?** Revisa los logs del servidor y verifica que `GEMINI_API_KEY` esté configurada correctamente.
