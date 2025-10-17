# 📊 DASHBOARD DEL ENTRENADOR - PARTE 2: GESTIÓN AVANZADA

## 👥 **TAB 4: ALUMNOS**

### **Objetivo:**
Gestionar la relación con tus alumnos, ver su progreso, historial y mantener notas privadas.

### **Componentes:**

#### **1. LISTA DE ALUMNOS**

```
┌────────────────────────────────────────────────────┐
│ Mis Alumnos (45)              🔍 Buscar alumno...  │
│                                                    │
│ [Activos (38)] [Inactivos (7)] [Todos (45)]       │
│                                                    │
│ Ordenar por: [Última clase ▼]                     │
│              - Última clase                        │
│              - Nombre A-Z                          │
│              - Total clases                        │
│              - Mejor valorado                      │
└────────────────────────────────────────────────────┘
```

**Definición de activo/inactivo:**
- **Activo**: Ha tenido clase en los últimos 30 días
- **Inactivo**: No ha tenido clase en más de 30 días

---

#### **2. TARJETAS DE ALUMNOS**

```
┌────────────────────────────────────────────────────┐
│ [Foto] María González                ⭐ 5.0       │
│                                                    │
│        Nivel: Intermedio                           │
│        Última clase: Ayer                          │
│        Total clases: 24                            │
│        Asistencia: 96% (23/24)                     │
│        Próxima clase: Hoy 17:00                    │
│                                                    │
│        [👤 Ver perfil] [💬 Mensaje] [📅 Agendar]  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ [Foto] Carlos Pérez                  ⭐ 4.8       │
│                                                    │
│        Nivel: Avanzado                             │
│        Última clase: Hace 3 días                   │
│        Total clases: 15                            │
│        Asistencia: 100% (15/15)                    │
│        Próxima clase: Mañana 10:00                 │
│                                                    │
│        [👤 Ver perfil] [💬 Mensaje] [📅 Agendar]  │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ [Foto] Laura Martínez                ⭐ 4.5       │
│                                                    │
│        Nivel: Principiante                         │
│        Última clase: Hace 45 días                  │
│        Total clases: 8                             │
│        Asistencia: 88% (7/8)                       │
│        Sin próxima clase agendada                  │
│                                                    │
│        [👤 Ver perfil] [💬 Mensaje] [📅 Agendar]  │
└────────────────────────────────────────────────────┘
```

**Query para obtener alumnos:**
```sql
SELECT 
  player_id,
  player_name,
  player_avatar,
  COUNT(*) as total_classes,
  MAX(booking_date) as last_class_date,
  AVG(rating) as average_rating,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as attended,
  SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_shows,
  -- Próxima clase
  (SELECT booking_date, start_time FROM bookings 
   WHERE player_id = b.player_id 
   AND status = 'confirmed' 
   AND booking_date >= CURRENT_DATE 
   ORDER BY booking_date, start_time LIMIT 1) as next_class
FROM bookings b
WHERE coach_id = current_user_id
GROUP BY player_id
ORDER BY last_class_date DESC
```

---

#### **3. MODAL/PÁGINA: PERFIL DETALLADO DEL ALUMNO**

```
┌─────────────────────────────────────────────────────┐
│                  MARÍA GONZÁLEZ                     │
│                  [Foto grande]                      │
│                  ⭐⭐⭐⭐⭐ 5.0                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📊 ESTADÍSTICAS GENERALES                           │
│ ════════════════════════════════════════════════   │
│ • Total clases conmigo: 24                          │
│ • Primera clase: 15 Marzo 2024                      │
│ • Última clase: Ayer (19 Enero 2025)               │
│ • Nivel: Intermedio                                 │
│ • Asistencia: 96% (23 de 24 clases)                │
│ • No-shows: 1                                       │
│ • Dinero total generado: €1,080                     │
│                                                     │
│ 🎯 OBJETIVOS DEL ALUMNO                             │
│ ════════════════════════════════════════════════   │
│ • Mejorar derecha                                   │
│ • Trabajar juego en red                             │
│ • Prepararse para torneo amateur                    │
│                                                     │
│ 📅 PRÓXIMA CLASE                                    │
│ ════════════════════════════════════════════════   │
│ Hoy, 20 Enero 2025 • 17:00-18:00                   │
│ Valencia Padel Center                               │
│ Individual • €45                                    │
│                                                     │
│ [Ver detalles] [Cancelar clase]                    │
│                                                     │
│ 📝 MIS NOTAS PRIVADAS SOBRE MARÍA                   │
│ ════════════════════════════════════════════════   │
│ [Solo tú puedes ver estas notas]                   │
│                                                     │
│ ┌─────────────────────────────────────────────┐    │
│ │ PROGRESO:                                    │    │
│ │ - Progresa muy rápido                        │    │
│ │ - Muy disciplinada y puntual                 │    │
│ │ - Gran capacidad de aprendizaje              │    │
│ │                                              │    │
│ │ ÁREAS DE MEJORA:                             │    │
│ │ - Necesita trabajar más el smash             │    │
│ │ - La volea aún es débil                      │    │
│ │ - Mejorar posicionamiento en pista           │    │
│ │                                              │    │
│ │ NOTAS ADICIONALES:                           │    │
│ │ - Prefiere clases temprano en la mañana      │    │
│ │ - Muy comunicativa, pregunta mucho (bueno)   │    │
│ │                                              │    │
│ └─────────────────────────────────────────────┘    │
│                                                     │
│ [💾 Guardar notas] [📝 Editar]                      │
│                                                     │
│ 📚 HISTORIAL DE CLASES CON MARÍA (24)               │
│ ════════════════════════════════════════════════   │
│ Mostrando las 5 más recientes:                      │
│                                                     │
│ 19 Ene 2025 - Individual - 60min - €45 ⭐⭐⭐⭐⭐   │
│ "Excelente clase, trabajamos derecha"              │
│                                                     │
│ 15 Ene 2025 - Individual - 60min - €45 ⭐⭐⭐⭐⭐   │
│ "Mejoró mucho la volea"                             │
│                                                     │
│ 12 Ene 2025 - Individual - 90min - €67.50 ⭐⭐⭐⭐⭐ │
│ "Clase táctica enfocada en posicionamiento"        │
│                                                     │
│ [Ver historial completo de 24 clases]              │
│                                                     │
│ ══════════════════════════════════════════════════ │
│                                                     │
│ [💬 Enviar mensaje] [📅 Agendar nueva clase]       │
│                            [← Volver a lista]       │
└─────────────────────────────────────────────────────┘
```

---

## ⏰ **TAB 5: DISPONIBILIDAD**

### **Objetivo:**
Configurar los horarios semanales de trabajo y bloquear fechas específicas (vacaciones, torneos, etc.).

### **Componentes:**

#### **1. HORARIOS SEMANALES**

```
┌─────────────────────────────────────────────────────┐
│ Mi Disponibilidad Semanal       [💾 Guardar cambios]│
├─────────────────────────────────────────────────────┤
│                                                     │
│ LUNES                           [✓ Disponible]      │
│ ───────────────────────────────────────────────    │
│ Mañana:  [09:00 ▼] a [13:00 ▼]  [+ Añadir rango]  │
│ Tarde:   [16:00 ▼] a [21:00 ▼]  [🗑️ Eliminar]     │
│                                                     │
│ MARTES                          [✓ Disponible]      │
│ ───────────────────────────────────────────────    │
│ Mañana:  [09:00 ▼] a [13:00 ▼]  [+ Añadir rango]  │
│ Tarde:   [16:00 ▼] a [21:00 ▼]  [🗑️ Eliminar]     │
│                                                     │
│ MIÉRCOLES                       [✓ Disponible]      │
│ ───────────────────────────────────────────────    │
│ Mañana:  [09:00 ▼] a [13:00 ▼]  [+ Añadir rango]  │
│ Tarde:   [16:00 ▼] a [21:00 ▼]  [🗑️ Eliminar]     │
│                                                     │
│ JUEVES                          [✓ Disponible]      │
│ ───────────────────────────────────────────────    │
│ Mañana:  [09:00 ▼] a [13:00 ▼]  [+ Añadir rango]  │
│ Tarde:   [16:00 ▼] a [21:00 ▼]  [🗑️ Eliminar]     │
│                                                     │
│ VIERNES                         [✓ Disponible]      │
│ ───────────────────────────────────────────────    │
│ Mañana:  [09:00 ▼] a [13:00 ▼]  [+ Añadir rango]  │
│ Tarde:   [16:00 ▼] a [21:00 ▼]  [🗑️ Eliminar]     │
│                                                     │
│ SÁBADO                          [✓ Disponible]      │
│ ───────────────────────────────────────────────    │
│ Mañana:  [09:00 ▼] a [14:00 ▼]  [+ Añadir rango]  │
│                                  [🗑️ Eliminar]     │
│                                                     │
│ DOMINGO                         [✗ No disponible]   │
│ ───────────────────────────────────────────────    │
│                                  [+ Añadir horario] │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Toggle "Disponible" por día
- Múltiples rangos horarios por día (mañana, tarde, noche)
- Dropdowns con intervalos de 30 minutos
- Validación: hora fin > hora inicio
- Botón "Añadir rango" para más horarios en el mismo día
- Botón "Eliminar" para quitar un rango
- Los alumnos solo pueden reservar en estos horarios

**Almacenamiento en BD:**
```sql
-- Tabla: coach_availability
-- Ejemplo: Lunes mañana 09:00-13:00
{
  coach_id: "uuid",
  day_of_week: 1,  -- 0=domingo, 1=lunes, 6=sábado
  start_time: "09:00",
  end_time: "13:00",
  is_available: true
}
```

---

#### **2. FECHAS BLOQUEADAS**

```
┌─────────────────────────────────────────────────────┐
│ Fechas Bloqueadas               [+ Bloquear fecha]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📅 25-27 Enero 2025 • Todo el día                   │
│ Motivo: "Vacaciones de invierno"                    │
│ [🗑️ Eliminar bloqueo]                               │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ 📅 15 Febrero 2025 • 16:00-20:00                    │
│ Motivo: "Torneo provincial - no disponible tarde"   │
│ [🗑️ Eliminar bloqueo]                               │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ 📅 28 Febrero - 3 Marzo 2025 • Todo el día          │
│ Motivo: "Viaje familiar"                            │
│ [🗑️ Eliminar bloqueo]                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

#### **3. MODAL: BLOQUEAR NUEVA FECHA**

```
┌────────────────────────────────────────────────┐
│         BLOQUEAR FECHA                         │
├────────────────────────────────────────────────┤
│                                                │
│ TIPO DE BLOQUEO:                               │
│ ● Todo el día                                  │
│ ○ Rango de horas específico                    │
│                                                │
│ FECHA (si solo un día):                        │
│ [📅 Seleccionar fecha]                         │
│                                                │
│ RANGO DE FECHAS (vacaciones):                  │
│ Desde: [📅 25 Enero 2025]                      │
│ Hasta: [📅 27 Enero 2025]                      │
│                                                │
│ ─────────────────────────────────────────      │
│ Solo si elegiste "Rango de horas":            │
│                                                │
│ HORARIO:                                       │
│ Desde: [16:00 ▼]                               │
│ Hasta: [20:00 ▼]                               │
│                                                │
│ ─────────────────────────────────────────      │
│                                                │
│ MOTIVO (opcional pero recomendado):            │
│ ┌──────────────────────────────────────┐      │
│ │ Vacaciones de invierno               │      │
│ └──────────────────────────────────────┘      │
│                                                │
│ ⚠️  IMPORTANTE:                                │
│ Ya tienes 2 clases confirmadas en estas       │
│ fechas. Si continúas, deberás cancelarlas     │
│ y los alumnos serán reembolsados:             │
│                                                │
│ • 25 Ene 10:00 - María González               │
│ • 26 Ene 17:00 - Carlos Pérez                 │
│                                                │
│ [Cancelar] [Bloquear y cancelar clases]       │
└────────────────────────────────────────────────┘
```

**Validaciones:**
- No puedes bloquear fechas en el pasado
- Si hay clases confirmadas, mostrar advertencia
- Al bloquear, se deben cancelar clases existentes
- Procesar reembolsos automáticos
- Enviar notificaciones a los alumnos afectados

---

## 💰 **TAB 6: FINANZAS**

### **Objetivo:**
Ver ingresos, transacciones, estadísticas financieras y exportar reportes.

### **Componentes:**

#### **1. RESUMEN FINANCIERO (KPIs)**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ ESTE MES     │ PENDIENTE    │ YA COBRADO   │ PROMEDIO     │
│              │              │              │              │
│   €1,240     │    €180      │   €1,060     │  €45/clase   │
│              │              │              │              │
│ Total ganado │ Por cobrar   │ En tu cuenta │ Por clase    │
│ (después 15% │ (clases      │ bancaria ya  │ completada   │
│  comisión)   │  pendientes) │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Explicación de cada métrica:**

- **ESTE MES**: Suma de total_price * 0.85 de clases completadas este mes
- **PENDIENTE**: Clases confirmadas que aún no se han dado
- **YA COBRADO**: Clases completadas hace más de 24h (ya recibiste el pago)
- **PROMEDIO**: Total ganado / número de clases completadas

---

#### **2. SELECTOR DE PERÍODO**

```
┌────────────────────────────────────────────────────┐
│ Ver estadísticas de:                               │
│ [Este mes ▼]  [2025 ▼]                            │
│                                                    │
│ Opciones:                                          │
│ - Esta semana                                      │
│ - Este mes                                         │
│ - Últimos 3 meses                                  │
│ - Este año                                         │
│ - Todo el tiempo                                   │
│ - Personalizado (elegir fechas)                    │
└────────────────────────────────────────────────────┘
```

---

#### **3. GRÁFICO DE INGRESOS**

```
┌─────────────────────────────────────────────────────┐
│ 📈 Ingresos mensuales (últimos 12 meses)            │
│                                                     │
│ €2000│                                         ●    │
│ €1800│                                              │
│ €1600│                                              │
│ €1400│                            ●        ●        │
│ €1200│                       ●                      │
│ €1000│         ●     ●                              │
│  €800│                                              │
│  €600│    ●                                         │
│  €400│                                              │
│  €200│                                              │
│      └────────────────────────────────────         │
│       E  F  M  A  M  J  J  A  S  O  N  D           │
│                     2024-2025                       │
│                                                     │
│ Total año: €14,880 | Promedio mes: €1,240          │
└─────────────────────────────────────────────────────┘
```

**Tipo de gráfico:** Línea con puntos
**Librería sugerida:** Recharts
**Interactividad:** Hover muestra valor exacto

---

#### **4. LISTA DE TRANSACCIONES**

```
┌─────────────────────────────────────────────────────┐
│ Transacciones                  [📥 Exportar a CSV]  │
│                                [📥 Exportar a PDF]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 18 Enero 2025                                       │
│ María González                                      │
│ Clase individual • 60 min                   +€38.25 │
│ ✅ Pagado • Ya en tu cuenta Stripe                  │
│ [Ver detalles]                                      │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ 17 Enero 2025                                       │
│ Carlos Pérez                                        │
│ Clase individual • 90 min                   +€51.00 │
│ ✅ Pagado • Ya en tu cuenta Stripe                  │
│ [Ver detalles]                                      │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ 15 Enero 2025                                       │
│ Grupo 4 personas                                    │
│ Clase grupal • 90 min                      +€102.00 │
│ ✅ Pagado • Ya en tu cuenta Stripe                  │
│ [Ver detalles]                                      │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ 12 Enero 2025                                       │
│ Laura Martínez                                      │
│ Clase individual • 60 min                    €45.00 │
│ ❌ Cancelada • Reembolsada al alumno                │
│ Motivo: "Enfermedad del entrenador"                │
│ [Ver detalles]                                      │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ [Cargar más transacciones...]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Estados posibles:**
- ✅ Pagado (verde)
- ⏳ Pendiente (amarillo)
- ❌ Cancelada/Reembolsada (rojo)

---

#### **5. MODAL: DETALLES DE TRANSACCIÓN**

```
┌────────────────────────────────────────────┐
│      DETALLES DE LA TRANSACCIÓN            │
├────────────────────────────────────────────┤
│                                            │
│ FECHA: 18 Enero 2025                       │
│ HORA DE LA CLASE: 17:00-18:00             │
│                                            │
│ ALUMNO: María González                     │
│                                            │
│ TIPO: Individual                           │
│ DURACIÓN: 60 minutos                       │
│                                            │
│ PRECIO CLASE: €45.00                       │
│ Comisión Padeliner (15%): -€6.75          │
│ TU GANANCIA: €38.25                        │
│                                            │
│ ESTADO PAGO: ✅ Pagado                     │
│ MÉTODO: Tarjeta de crédito (Stripe)       │
│ FECHA PAGO ALUMNO: 15 Ene 2025 14:30      │
│ FECHA PAGO A TI: 19 Ene 2025 18:00        │
│                                            │
│ ID TRANSACCIÓN STRIPE:                     │
│ pi_1234567890abcdefghijk                   │
│                                            │
│ [Cerrar]                                   │
└────────────────────────────────────────────┘
```

---

#### **6. EXPORTAR REPORTES**

**Botones:**
- **Exportar a CSV**: Archivo Excel con todas las transacciones
- **Exportar a PDF**: Reporte visual formateado

**Contenido del CSV:**
```
Fecha,Alumno,Tipo,Duración,Precio,Comisión,Tu Ganancia,Estado
2025-01-18,María González,Individual,60 min,€45.00,€6.75,€38.25,Pagado
2025-01-17,Carlos Pérez,Individual,90 min,€60.00,€9.00,€51.00,Pagado
...
```

**Contenido del PDF:**
- Logo Padeliner
- Nombre del entrenador
- Período del reporte
- Resumen: Total ganado, Total clases, Promedio
- Tabla de transacciones
- Gráfico de ingresos
- Firma digital / marca de agua
