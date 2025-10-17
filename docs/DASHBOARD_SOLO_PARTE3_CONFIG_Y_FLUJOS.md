# 📊 DASHBOARD DEL ENTRENADOR - PARTE 3: CONFIGURACIÓN Y FLUJOS

## 💬 **TAB 7: MENSAJES**

### **Objetivo:**
Integración del sistema de mensajería existente dentro del dashboard.

### **Descripción:**
Este tab simplemente integra el sistema de chat que ya existe en `/mensajes` pero dentro del contexto del dashboard del entrenador.

```
┌─────────────────────────────────────────────────────┐
│ 💬 Mensajes                                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [Iframe o componente del chat existente]           │
│                                                     │
│ FUNCIONALIDADES:                                    │
│ • Ver conversaciones con alumnos                    │
│ • Enviar/recibir mensajes                          │
│ • Notificaciones de nuevos mensajes                │
│ • Búsqueda de conversaciones                        │
│ • Historial completo                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Nota:** Este tab usa el sistema de mensajería que ya está implementado. No requiere desarrollo adicional más allá de la integración visual.

---

## ⚙️ **TAB 8: CONFIGURACIÓN**

### **Objetivo:**
Permitir al entrenador configurar su perfil, precios, preferencias y ajustes de cuenta.

### **Componentes:**

#### **1. INFORMACIÓN BÁSICA**

```
┌─────────────────────────────────────────────────────┐
│ INFORMACIÓN BÁSICA                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ FOTO DE PERFIL                                      │
│ [Foto actual]                                       │
│ [Cambiar foto] [Eliminar]                          │
│                                                     │
│ NOMBRE COMPLETO *                                   │
│ [Álvaro Vinilo_________________________]           │
│                                                     │
│ EMAIL *                                             │
│ [alvaro.vinilo@email.com______________]            │
│ ⚠️  Verificado ✓                                    │
│                                                     │
│ TELÉFONO                                            │
│ [+34 612 345 678______________________]            │
│                                                     │
│ CIUDAD *                                            │
│ [Valencia_____________________________]            │
│                                                     │
│ [💾 Guardar cambios]                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### **2. INFORMACIÓN PROFESIONAL**

```
┌─────────────────────────────────────────────────────┐
│ INFORMACIÓN PROFESIONAL                             │
│ (Aparece en tu perfil público)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ BIOGRAFÍA *                                         │
│ ┌─────────────────────────────────────────────┐    │
│ │ Entrenador profesional con 10 años de      │    │
│ │ experiencia. Especializado en técnica y     │    │
│ │ táctica para todos los niveles. RPTE       │    │
│ │ Nivel 3 certificado.                        │    │
│ │                                             │    │
│ └─────────────────────────────────────────────┘    │
│ 245/500 caracteres                                  │
│                                                     │
│ AÑOS DE EXPERIENCIA *                               │
│ [10 ▼] años                                         │
│                                                     │
│ CERTIFICACIONES                                     │
│ • RPTE Nivel 3               [✕ Eliminar]          │
│ • Entrenador RFET            [✕ Eliminar]          │
│ [+ Añadir certificación]                           │
│                                                     │
│ ESPECIALIDADES *                                    │
│ [Técnica ✓] [Táctica ✓] [Principiantes ✓]         │
│ [Competición] [Físico] [Mental]                    │
│                                                     │
│ IDIOMAS *                                           │
│ [Español ✓] [Inglés ✓] [Francés] [Italiano]       │
│                                                     │
│ GALERÍA DE FOTOS                                    │
│ [Foto 1] [Foto 2] [Foto 3] [+ Añadir foto]        │
│ (Máximo 6 fotos)                                    │
│                                                     │
│ [💾 Guardar cambios]                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### **3. PRECIOS Y SERVICIOS**

```
┌─────────────────────────────────────────────────────┐
│ PRECIOS Y SERVICIOS                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│ PRECIO CLASE INDIVIDUAL *                           │
│ [45] € por hora                                     │
│ ℹ️  Los alumnos verán este precio + IVA             │
│                                                     │
│ PRECIO CLASE GRUPAL                                 │
│ [25] € por persona/hora                             │
│ ℹ️  Precio por cada participante                    │
│                                                     │
│ DURACIÓN MÍNIMA DE CLASE *                          │
│ [60 ▼] minutos                                      │
│ Opciones: 30, 60, 90, 120 minutos                  │
│                                                     │
│ SERVICIOS                                           │
│ [✓] Ofrezco servicio a domicilio                   │
│ [ ] Solo en mi ubicación habitual                   │
│                                                     │
│ UBICACIÓN HABITUAL                                  │
│ [Valencia Padel Center________________]            │
│ [Calle Ejemplo 123____________________]            │
│                                                     │
│ POLÍTICA DE CANCELACIÓN                             │
│ [Reembolso hasta 24h antes ▼]                      │
│ Opciones:                                           │
│ - Reembolso completo hasta 24h antes               │
│ - Reembolso completo hasta 48h antes               │
│ - Sin reembolso (no recomendado)                   │
│                                                     │
│ [💾 Guardar cambios]                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### **4. PREFERENCIAS Y NOTIFICACIONES**

```
┌─────────────────────────────────────────────────────┐
│ PREFERENCIAS                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ZONA HORARIA                                        │
│ [Europe/Madrid (GMT+1) ▼]                          │
│                                                     │
│ IDIOMA DEL DASHBOARD                                │
│ [Español ▼]                                         │
│ Opciones: Español, English                          │
│                                                     │
│ NOTIFICACIONES POR EMAIL                            │
│ [✓] Nueva reserva                                   │
│ [✓] Cancelación de alumno                          │
│ [✓] Nueva reseña                                    │
│ [✓] Recordatorio de clase (2h antes)               │
│ [✓] Resumen semanal                                 │
│ [ ] Newsletter de Padeliner                         │
│                                                     │
│ NOTIFICACIONES PUSH (navegador)                     │
│ [✓] Activar notificaciones push                    │
│                                                     │
│ RECORDATORIOS AUTOMÁTICOS                           │
│ [✓] Enviar recordatorio a alumnos 24h antes        │
│ [✓] Enviar recordatorio a alumnos 2h antes         │
│                                                     │
│ [💾 Guardar preferencias]                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### **5. CUENTA Y PAGOS**

```
┌─────────────────────────────────────────────────────┐
│ TU CUENTA                                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ SEGURIDAD                                           │
│ [🔐 Cambiar contraseña]                             │
│                                                     │
│ MÉTODO DE PAGO (STRIPE)                             │
│ Estado: ✅ Conectado                                │
│ Cuenta: **** **** **** 1234                         │
│ [Configurar cuenta de Stripe]                       │
│ ℹ️  Aquí recibirás tus pagos                        │
│                                                     │
│ GESTIÓN DE PERFIL                                   │
│ [⏸️  Pausar mi perfil temporalmente]                │
│ ℹ️  Tu perfil no aparecerá en búsquedas            │
│    pero mantendrás tus clases confirmadas           │
│                                                     │
│ [🗑️  Eliminar mi cuenta permanentemente]            │
│ ⚠️  Esta acción NO se puede deshacer                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 **FLUJOS COMPLETOS DEL SISTEMA**

### **FLUJO 1: ALUMNO HACE RESERVA → ENTRENADOR CONFIRMA**

```
1. ALUMNO (en perfil público del entrenador)
   └─> Click "Reservar Clase"
   └─> Selecciona fecha/hora (ve disponibilidad real del calendario)
   └─> Elige tipo: Individual o Grupal
   └─> Añade notas: "Quiero mejorar mi derecha"
   └─> Paga €45 con Stripe
   └─> Sistema crea booking con status = 'pending'

2. SISTEMA
   └─> Envía email a entrenador: "Nueva solicitud de reserva"
   └─> Crea notificación en dashboard
   └─> El dinero queda en "hold" en Stripe (no se libera aún)

3. ENTRENADOR (en dashboard)
   └─> Recibe notificación 🔔
   └─> Abre Tab "Resumen" o "Reservas"
   └─> Ve: "Nueva solicitud: Laura Martínez • Lun 20 Ene 18:00"
   └─> Click "Ver detalles"
   └─> Revisa: perfil de Laura, fecha, notas, historial
   └─> DECIDE:

   OPCIÓN A: [✓ ACEPTAR]
   ├─> Status cambia a 'confirmed'
   ├─> Aparece en calendario del entrenador
   ├─> Sistema envía email a Laura: "Tu clase está confirmada"
   ├─> Dinero sigue retenido en Stripe hasta completar clase
   └─> Laura puede ver la clase en su dashboard (si existe)

   OPCIÓN B: [✕ RECHAZAR]
   ├─> Modal: "¿Razón del rechazo?"
   ├─> Entrenador escribe: "No disponible ese día"
   ├─> Status cambia a 'cancelled'
   ├─> Sistema procesa reembolso automático a Laura
   ├─> Envía email a Laura: "Lo sentimos, clase cancelada. Reembolso procesado"
   └─> Slot se libera en calendario
```

---

### **FLUJO 2: DÍA DE LA CLASE → COMPLETAR**

```
1. DÍA ANTES (24h antes)
   └─> Sistema envía email automático:
       ├─> A entrenador: "Tienes clase mañana con Laura a las 18:00"
       └─> A alumno: "Tu clase es mañana a las 18:00 con Álvaro"

2. MISMO DÍA (2h antes)
   └─> Sistema envía segundo recordatorio:
       ├─> A entrenador: "Clase en 2 horas con Laura"
       └─> A alumno: "Tu clase es en 2 horas"

3. HORA DE LA CLASE
   └─> Entrenador da la clase normalmente (offline)

4. DESPUÉS DE LA CLASE
   └─> Entrenador abre dashboard
   └─> Ve en "Próximas clases": "Laura González - HOY 18:00"
   └─> Click [✓ COMPLETAR CLASE]
   └─> Modal de confirmación:
       ┌────────────────────────────────────┐
       │ ¿Completar esta clase?             │
       │                                    │
       │ Laura González                     │
       │ 20 Ene 2025, 18:00-19:00          │
       │ €45 • Individual                   │
       │                                    │
       │ Añade notas (opcional):            │
       │ ┌────────────────────────────┐    │
       │ │ Clase excelente. Trabajamos│    │
       │ │ derecha y volea.           │    │
       │ └────────────────────────────┘    │
       │                                    │
       │ [Cancelar] [✓ Completar]          │
       └────────────────────────────────────┘
   └─> Click "Completar"

5. SISTEMA
   ├─> Status cambia a 'completed'
   ├─> Guarda notas privadas del entrenador
   ├─> Programa liberación de pago en Stripe (24h después)
   ├─> Envía email a Laura pidiendo valoración:
   │   "¿Cómo fue tu clase con Álvaro? ⭐⭐⭐⭐⭐"
   └─> Actualiza estadísticas del entrenador

6. LAURA (alumno)
   └─> Recibe email con link
   └─> Click en link
   └─> Formulario de valoración:
       ┌────────────────────────────────────┐
       │ ¿Cómo fue tu clase?                │
       │                                    │
       │ Valoración: ⭐⭐⭐⭐⭐              │
       │                                    │
       │ Comentario:                        │
       │ ┌────────────────────────────┐    │
       │ │ Excelente clase! Álvaro es │    │
       │ │ muy profesional y paciente.│    │
       │ └────────────────────────────┘    │
       │                                    │
       │ [Enviar valoración]                │
       └────────────────────────────────────┘
   └─> Sistema guarda review
   └─> Actualiza rating del entrenador
   └─> Review aparece en perfil público

7. 24 HORAS DESPUÉS
   └─> Stripe libera el pago
   └─> Entrenador recibe €38.25 en su cuenta (€45 - 15% comisión)
   └─> Sistema envía email: "Has recibido €38.25 por clase con Laura"
```

---

### **FLUJO 3: CANCELACIÓN DE CLASE**

#### **3A. CANCELACIÓN POR ENTRENADOR**

```
1. ENTRENADOR
   └─> Abre "Reservas" o "Calendario"
   └─> Click en clase confirmada: "María González - 20 Ene 18:00"
   └─> Click [❌ CANCELAR]
   └─> Modal de cancelación:
       ┌────────────────────────────────────┐
       │ ⚠️  Cancelar clase                 │
       │                                    │
       │ María González                     │
       │ 20 Ene 2025, 18:00-19:00          │
       │ €45 • Individual                   │
       │                                    │
       │ Motivo de cancelación: *           │
       │ ┌────────────────────────────┐    │
       │ │ Enfermedad                 │    │
       │ └────────────────────────────┘    │
       │                                    │
       │ ⚠️  Se procesará reembolso         │
       │     completo a María (€45)         │
       │                                    │
       │ ¿Ofrecer reprogramar?              │
       │ [✓] Sí, sugerir nuevas fechas      │
       │                                    │
       │ [Volver] [Cancelar clase]          │
       └────────────────────────────────────┘
   └─> Click "Cancelar clase"

2. SISTEMA
   ├─> Status cambia a 'cancelled'
   ├─> Guarda: cancelled_by = entrenador, reason = "Enfermedad"
   ├─> Procesa reembolso automático en Stripe (€45 completo)
   ├─> Envía email a María:
   │   "Tu clase ha sido cancelada por el entrenador.
   │    Motivo: Enfermedad
   │    Reembolso de €45 procesado a tu tarjeta.
   │    El entrenador sugiere reprogramar cuando te venga bien."
   ├─> Libera el slot en el calendario
   └─> Entrenador NO recibe penalización

3. MARÍA (alumno)
   └─> Puede reservar otra fecha
   └─> O elegir otro entrenador
```

#### **3B. CANCELACIÓN POR ALUMNO**

```
1. MARÍA (alumno)
   └─> En su dashboard (si existe)
   └─> O desde email de confirmación
   └─> Click "Cancelar clase"
   └─> Modal según política:

   CASO 1: MÁS DE 24H ANTES
   ┌────────────────────────────────────┐
   │ Cancelar clase                     │
   │                                    │
   │ Álvaro Vinilo                      │
   │ 20 Ene 2025, 18:00-19:00          │
   │ €45 • Individual                   │
   │                                    │
   │ ✅ Reembolso completo: €45        │
   │                                    │
   │ ¿Estás segura?                     │
   │ [Volver] [Sí, cancelar]           │
   └────────────────────────────────────┘

   CASO 2: MENOS DE 24H ANTES
   ┌────────────────────────────────────┐
   │ ⚠️  Cancelación tardía             │
   │                                    │
   │ La clase es en menos de 24h.       │
   │                                    │
   │ ❌ NO se puede reembolsar          │
   │    según la política del entrenador│
   │                                    │
   │ ¿Estás segura?                     │
   │ [Volver] [Sí, cancelar sin reembolso]│
   └────────────────────────────────────┘

2. SISTEMA
   ├─> Status cambia a 'cancelled'
   ├─> Guarda: cancelled_by = alumno
   ├─> SI corresponde, procesa reembolso
   ├─> Envía email a entrenador:
   │   "María González canceló la clase del 20 Ene a las 18:00"
   ├─> Libera slot en calendario
   └─> SI no hay reembolso, entrenador recibe el pago completo
```

---

### **FLUJO 4: CONFIGURAR DISPONIBILIDAD**

```
1. ENTRENADOR
   └─> Abre Tab "Disponibilidad"
   └─> Ve su horario semanal actual:
       Lunes: 09:00-13:00, 16:00-21:00
       Martes: 09:00-13:00, 16:00-21:00
       (etc.)

2. MODIFICAR HORARIOS
   └─> Quiere cambiar Miércoles
   └─> Click en horario de la tarde "16:00-21:00"
   └─> Cambia a "17:00-20:00"
   └─> Click [+ Añadir rango]
   └─> Añade: "21:00-22:00"
   └─> Click [💾 Guardar cambios]

3. SISTEMA
   ├─> Valida que no haya solapamientos
   ├─> Verifica si hay bookings afectados:
   │   ⚠️  "Tienes 2 clases en horarios que estás quitando:
   │       • Miércoles 20:30 - Carlos Pérez
   │       • Miércoles 20:00 - Laura Martínez"
   │
   └─> Si hay conflictos:
       ┌────────────────────────────────────┐
       │ ⚠️  Conflicto de horarios          │
       │                                    │
       │ No puedes quitar estos horarios    │
       │ porque ya tienes clases reservadas.│
       │                                    │
       │ Opciones:                          │
       │ 1. Cancela primero esas clases     │
       │ 2. Espera a que pasen               │
       │ 3. Modifica para después de esas   │
       │    fechas                          │
       │                                    │
       │ [Entendido]                        │
       └────────────────────────────────────┘
   
   └─> Si NO hay conflictos:
       ├─> Guarda en tabla coach_availability
       ├─> Actualiza calendario público
       └─> Los alumnos verán nueva disponibilidad

4. BLOQUEAR VACACIONES
   └─> Click [+ Bloquear fecha]
   └─> Modal: Selecciona 25-27 Enero
   └─> Motivo: "Vacaciones"
   └─> Sistema verifica bookings existentes
   └─> Si hay: Muestra warning
   └─> Entrenador decide:
       [ ] Cancelar y reembolsar
       [ ] Mantener solo esas clases
   └─> Click "Confirmar"
   └─> Sistema:
       ├─> Guarda en coach_blocked_dates
       ├─> Si eligió cancelar: Procesa cancelaciones
       ├─> Actualiza calendario
       └─> Esas fechas ya no aparecen disponibles para alumnos
```

---

## 🔔 **SISTEMA DE NOTIFICACIONES**

### **Tipos de Notificaciones para Entrenadores:**

**1. 🆕 Nueva Reserva**
```
Título: "Nueva solicitud de reserva"
Mensaje: "Laura Martínez quiere reservar una clase el Lun 20 Ene a las 18:00"
Acciones: [Ver detalles] [Aceptar] [Rechazar]
```

**2. ❌ Cancelación**
```
Título: "Clase cancelada"
Mensaje: "María González canceló su clase del Lun 20 Ene"
Acciones: [Ver detalles]
```

**3. ⭐ Nueva Valoración**
```
Título: "Nueva valoración recibida"
Mensaje: "Carlos Pérez te valoró con 5 estrellas"
Acciones: [Ver reseña]
```

**4. ⏰ Recordatorio de Clase**
```
Título: "Clase en 2 horas"
Mensaje: "Tienes clase con María González a las 18:00"
Acciones: [Ver detalles]
```

**5. 💰 Pago Recibido**
```
Título: "Pago recibido"
Mensaje: "Has recibido €38.25 por la clase con Laura Martínez"
Acciones: [Ver transacción]
```

**6. 💬 Nuevo Mensaje**
```
Título: "Nuevo mensaje"
Mensaje: "María González te ha enviado un mensaje"
Acciones: [Abrir chat]
```

### **Dónde se Muestran:**
- 🔔 **Badge** en icono de campana (contador)
- 📧 **Email** (según preferencias)
- 📱 **Push notification** (si está activado)
- 📋 **Panel de notificaciones** en dashboard

---

## 📊 **RESUMEN: QUÉ PUEDE HACER EL ENTRENADOR**

### **GESTIÓN DE RESERVAS:**
- ✅ Ver nuevas solicitudes
- ✅ Aceptar o rechazar reservas
- ✅ Ver calendario de clases
- ✅ Completar clases pasadas
- ✅ Cancelar clases (con reembolso al alumno)
- ✅ Ver detalles completos de cada reserva
- ✅ Añadir notas privadas

### **GESTIÓN DE ALUMNOS:**
- ✅ Ver lista de todos sus alumnos
- ✅ Ver perfil detallado con estadísticas
- ✅ Ver historial de clases con cada alumno
- ✅ Mantener notas privadas por alumno
- ✅ Enviar mensajes directos
- ✅ Agendar nuevas clases

### **GESTIÓN DE HORARIOS:**
- ✅ Configurar disponibilidad semanal
- ✅ Múltiples rangos horarios por día
- ✅ Bloquear fechas específicas (vacaciones)
- ✅ Bloquear rangos de horas

### **FINANZAS:**
- ✅ Ver ingresos totales y por período
- ✅ Ver pagos pendientes
- ✅ Ver gráficos de ingresos
- ✅ Lista detallada de transacciones
- ✅ Exportar reportes (CSV, PDF)

### **CONFIGURACIÓN:**
- ✅ Editar perfil profesional
- ✅ Configurar precios
- ✅ Gestionar notificaciones
- ✅ Configurar cuenta de Stripe
- ✅ Pausar perfil
- ✅ Eliminar cuenta

### **COMUNICACIÓN:**
- ✅ Chat con alumnos
- ✅ Notificaciones en tiempo real
- ✅ Emails automáticos
