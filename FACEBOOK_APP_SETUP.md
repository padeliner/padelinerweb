# 🔧 Configurar Facebook App ID

## ¿Por qué necesitas un Facebook App ID?

El `fb:app_id` es necesario para:
- **Eliminar advertencias** en Facebook Debugger
- **Tracking mejorado** de shares en Facebook
- **Facebook Analytics** de compartidos
- **Facebook Insights** de tu dominio

---

## 📋 PASOS PARA OBTENER TU FACEBOOK APP ID

### 1. Crear una Facebook App

1. Ve a **Facebook Developers**: https://developers.facebook.com
2. Click en **"Mis Apps"** (My Apps)
3. Click en **"Crear app"** (Create App)
4. Selecciona **"Ninguno"** (None) o **"Empresa"** (Business)
5. Nombre de la app: **"Padeliner"**
6. Email de contacto: Tu email
7. Click **"Crear app"**

### 2. Configurar la App

1. En el Dashboard de tu app, encontrarás el **App ID**
2. Copia ese número (ejemplo: 123456789012345)
3. Ve a **Configuración > Básica** (Settings > Basic)
4. Añade tu dominio: **www.padeliner.com**
5. Guarda cambios

### 3. Añadir el App ID al proyecto

Edita `app/layout.tsx` línea 89:

```tsx
<meta property="fb:app_id" content="123456789012345" />
```

Reemplaza `YOUR_FACEBOOK_APP_ID` por tu ID real.

### 4. Desplegar y verificar

1. Haz deploy de los cambios
2. Ve a: https://developers.facebook.com/tools/debug/
3. Pega tu URL
4. Verifica que ya no aparezca la advertencia

---

## ✅ RESULTADO

- ✅ Sin advertencias en Facebook Debugger
- ✅ Mejor tracking de shares
- ✅ Facebook Analytics habilitado
- ✅ Open Graph completamente configurado

---

## 📌 NOTA

El App ID es **opcional** pero **recomendado** para producción.
La funcionalidad de compartir funciona sin él, solo tendrás advertencias.
