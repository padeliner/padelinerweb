# 📋 DASHBOARD ADMIN - CHECKLIST COMPLETO

**Fecha de inicio:** Octubre 2025  
**Proyecto:** Padeliner - Panel de Administración  
**Stack:** Next.js 14, Supabase, Shadcn/ui, TailwindCSS

---

## 🎯 FASE 1 - FUNDACIÓN (ESENCIAL PARA LANZAMIENTO)

### 1.1 Estructura y Layout
- [ ] Crear carpeta `/app/admin` con protección de rutas
- [ ] Layout principal del dashboard con sidebar
- [ ] Header con usuario y logout
- [ ] Navegación responsive (mobile)
- [ ] Middleware para verificar rol admin
- [ ] Página 404 personalizada para admin
- [ ] Loading states globales

### 1.2 Dashboard Home (KPIs Principales)
- [ ] Card: Total usuarios registrados
- [ ] Card: Entrenadores activos
- [ ] Card: Academias activas
- [ ] Card: Clubes activos
- [ ] Card: Alumnos registrados
- [ ] Card: Ingresos del mes
- [ ] Card: Reservas del mes
- [ ] Card: Nuevos registros (últimos 7 días)
- [ ] Gráfico: Evolución usuarios (últimos 6 meses)
- [ ] Gráfico: Ingresos mensuales
- [ ] Lista: Últimas actividades (10 más recientes)

### 1.3 Gestión de Usuarios
#### Listado de Usuarios
- [ ] Tabla con todos los usuarios
- [ ] Filtros: rol, estado, fecha registro
- [ ] Búsqueda por nombre/email
- [ ] Paginación
- [ ] Acciones: ver, editar, suspender, eliminar

#### Detalle de Usuario
- [ ] Ver información completa
- [ ] Editar datos básicos
- [ ] Cambiar rol (alumno, entrenador, academia, club, admin)
- [ ] Historial de actividad
- [ ] Reservas realizadas
- [ ] Transacciones asociadas
- [ ] Botón: Suspender/Activar cuenta
- [ ] Botón: Enviar email
- [ ] Notas internas del admin

#### Gestión de Roles
- [ ] Lista de roles disponibles
- [ ] Permisos por rol
- [ ] Asignar/cambiar roles
- [ ] Log de cambios de rol

### 1.4 Certificaciones
#### Solicitudes Pendientes
- [ ] Tabla con solicitudes pendientes
- [ ] Ver documentos adjuntos
- [ ] Validar identidad (DNI/pasaporte)
- [ ] Ver títulos/certificados
- [ ] Botón: Aprobar certificación
- [ ] Botón: Rechazar (con motivo)
- [ ] Enviar email automático al usuario

#### Certificaciones Aprobadas
- [ ] Listado de usuarios certificados
- [ ] Fecha de aprobación
- [ ] Quién aprobó
- [ ] Ver documentos

#### Certificaciones Rechazadas
- [ ] Listado de rechazadas
- [ ] Motivo del rechazo
- [ ] Permitir reenvío

### 1.5 Moderación Básica
- [ ] Lista de reportes de usuarios
- [ ] Ver detalles del reporte
- [ ] Acción: Advertir usuario
- [ ] Acción: Suspender temporalmente
- [ ] Acción: Banear permanentemente
- [ ] Acción: Desestimar reporte
- [ ] Historial de moderación por usuario

---

## 💼 FASE 2 - OPERACIONES (POST-LANZAMIENTO)

### 2.1 Gestión de Pagos y Finanzas
#### Configuración de Comisiones
- [ ] Comisión entrenadores (%)
- [ ] Comisión academias (%)
- [ ] Comisión clubes (%)
- [ ] Comisión tienda (%)
- [ ] Guardar cambios con log

#### Transacciones
- [ ] Tabla de todas las transacciones
- [ ] Filtros: tipo, estado, fecha
- [ ] Ver detalle de transacción
- [ ] Estado: completada, pendiente, fallida, reembolsada
- [ ] Exportar a CSV

#### Pagos Pendientes
- [ ] Lista de pagos pendientes a entrenadores/academias
- [ ] Marcar como pagado
- [ ] Generar reporte de pagos

#### Reembolsos
- [ ] Solicitudes de reembolso
- [ ] Procesar reembolso
- [ ] Historial de reembolsos

#### Configuración Stripe
- [ ] API Keys
- [ ] Webhooks
- [ ] Modo test/producción

### 2.2 Sistema de Tickets (Soporte)
- [ ] Crear nuevo ticket manualmente
- [ ] Lista de tickets (abiertos, en proceso, cerrados)
- [ ] Filtros: prioridad, categoría, asignado
- [ ] Ver detalle y conversación
- [ ] Responder ticket
- [ ] Asignar a miembro del equipo
- [ ] Cambiar prioridad
- [ ] Cambiar estado
- [ ] Cerrar ticket
- [ ] Estadísticas: tiempo promedio resolución

### 2.3 Mensajería con Resend
- [ ] Bandeja de entrada (emails recibidos)
- [ ] Ver email completo
- [ ] Responder email
- [ ] Marcar como leído/no leído
- [ ] Archivar
- [ ] Eliminar
- [ ] Filtros: fecha, remitente
- [ ] Búsqueda

### 2.4 Verificaciones
#### Verificación de Identidad
- [ ] Lista pendientes de verificar
- [ ] Ver documento (DNI/pasaporte)
- [ ] Aprobar/Rechazar
- [ ] Marcar como verificado

#### Verificación de Certificados
- [ ] Ver títulos profesionales
- [ ] Validar autenticidad
- [ ] Aprobar/Rechazar

#### Verificación de Instalaciones
- [ ] Verificar clubes/academias
- [ ] Ver fotos de instalaciones
- [ ] Aprobar/Rechazar

### 2.5 Logs y Auditoría
- [ ] Log de acciones de admin (quién, qué, cuándo)
- [ ] Log de cambios en usuarios
- [ ] Log de transacciones
- [ ] Log de errores del sistema
- [ ] Log de inicios de sesión
- [ ] Filtros y búsqueda
- [ ] Exportar logs

---

## 📈 FASE 3 - CRECIMIENTO (OPTIMIZACIÓN)

### 3.1 Analytics Completo
#### Usuarios
- [ ] Gráfico: Nuevos registros por día/mes
- [ ] Gráfico: Usuarios activos vs inactivos
- [ ] Tasa de conversión (visita → registro)
- [ ] Tasa de retención
- [ ] Churn rate
- [ ] Usuarios por ubicación (mapa)
- [ ] Dispositivos más usados

#### Reservas
- [ ] Total reservas
- [ ] Reservas completadas
- [ ] Reservas canceladas
- [ ] Tasa de cancelación
- [ ] Horarios pico
- [ ] Entrenadores más reservados
- [ ] Gráfico: Evolución reservas

#### Ingresos
- [ ] Ingresos totales
- [ ] Ingresos por servicio (entrenadores, academias, clubes, tienda)
- [ ] Comisiones generadas
- [ ] Gráfico: Evolución ingresos
- [ ] Revenue por usuario (LTV)
- [ ] Proyección de ingresos

#### Tráfico Web
- [ ] Páginas más visitadas
- [ ] Fuentes de tráfico
- [ ] Conversión por fuente
- [ ] Tasa de rebote

### 3.2 Gestión de Tienda Completa
#### Productos
- [ ] Lista de productos
- [ ] Crear producto
- [ ] Editar producto
- [ ] Eliminar producto
- [ ] Imágenes del producto
- [ ] Variantes (tallas, colores)
- [ ] Precio y descuentos
- [ ] Categorías y etiquetas
- [ ] Stock

#### Inventario
- [ ] Stock actual por producto
- [ ] Alertas de stock bajo
- [ ] Historial de movimientos
- [ ] Ajustar stock manualmente

#### Pedidos
- [ ] Lista de pedidos
- [ ] Filtros: estado, fecha
- [ ] Ver detalle del pedido
- [ ] Cambiar estado (pendiente, enviado, entregado, cancelado)
- [ ] Imprimir factura
- [ ] Generar etiqueta de envío
- [ ] Tracking del envío

#### Envíos
- [ ] Configurar zonas de envío
- [ ] Tarifas por zona
- [ ] Transportistas
- [ ] Tiempo estimado de entrega

#### Proveedores
- [ ] Lista de proveedores
- [ ] Datos de contacto
- [ ] Productos por proveedor

### 3.3 Sistema de Reservas Global
- [ ] Calendario general con todas las reservas
- [ ] Vista: día, semana, mes
- [ ] Filtros: entrenador, academia, club
- [ ] Ver detalle de reserva
- [ ] Cancelar reserva manualmente
- [ ] Resolver conflictos de horario
- [ ] Estadísticas de ocupación

### 3.4 Chat Interno (Moderación)
- [ ] Lista de todas las conversaciones
- [ ] Ver conversación completa
- [ ] Buscar por usuario
- [ ] Filtrar por fecha
- [ ] Moderar mensajes inapropiados
- [ ] Eliminar mensaje
- [ ] Advertir usuario
- [ ] Exportar conversación (legal)

### 3.5 Configuración de Plataforma
#### General
- [ ] Nombre de la plataforma
- [ ] Logo
- [ ] Colores de marca
- [ ] Moneda
- [ ] Idioma por defecto

#### Políticas
- [ ] Política de cancelación (horas antes, % reembolso)
- [ ] Tiempo máximo de reserva anticipada
- [ ] Tiempo mínimo de reserva anticipada

#### Límites
- [ ] Máximo de fotos por perfil
- [ ] Precio mínimo por hora
- [ ] Precio máximo por hora
- [ ] Máximo de reservas simultáneas

#### Features
- [ ] Activar/desactivar chat
- [ ] Activar/desactivar reseñas
- [ ] Activar/desactivar programa de referidos
- [ ] Activar/desactivar tienda

#### Mantenimiento
- [ ] Modo mantenimiento (on/off)
- [ ] Mensaje de mantenimiento
- [ ] IPs excluidas del mantenimiento

#### Marketing
- [ ] Crear cupón de descuento
- [ ] Lista de cupones activos
- [ ] Código, descuento, validez
- [ ] Usos por cupón
- [ ] Banners promocionales

### 3.6 Contenido Legal
- [ ] Términos y condiciones (editor)
- [ ] Política de privacidad (editor)
- [ ] Política de cookies (editor)
- [ ] Política de cancelación (editor)
- [ ] Contrato de servicio para entrenadores (editor)
- [ ] Control de versiones
- [ ] Fecha de última actualización

### 3.7 Backup y Seguridad
- [ ] Configurar backups automáticos
- [ ] Frecuencia de backup
- [ ] Restaurar desde backup
- [ ] Exportar datos de usuario (GDPR)
- [ ] Lista de IPs bloqueadas
- [ ] Añadir/eliminar IP bloqueada
- [ ] Configurar rate limiting
- [ ] Logs de seguridad

---

## 🛠️ COMPONENTES TÉCNICOS

### Base de Datos (Supabase)
- [ ] Tabla: admin_logs
- [ ] Tabla: certifications
- [ ] Tabla: user_reports
- [ ] Tabla: support_tickets
- [ ] Tabla: transactions
- [ ] Tabla: platform_settings
- [ ] Tabla: coupons
- [ ] Tabla: legal_documents
- [ ] RLS policies para admin
- [ ] Functions para analytics
- [ ] Functions para pagos

### Autenticación y Permisos
- [ ] Middleware admin (`/middleware.ts`)
- [ ] Hook useIsAdmin
- [ ] Proteger todas las rutas `/admin/*`
- [ ] Verificar rol en cada acción sensible

### UI Components (Shadcn/ui)
- [ ] AdminLayout
- [ ] Sidebar con navegación
- [ ] StatsCard (para KPIs)
- [ ] DataTable (reutilizable)
- [ ] Modal de confirmación
- [ ] Toast notifications
- [ ] Badge (estados)
- [ ] Tabs
- [ ] Select con búsqueda
- [ ] DatePicker con rango
- [ ] FileUpload (para documentos)

### Integraciones
- [ ] Resend (emails)
- [ ] Stripe (pagos y webhooks)
- [ ] Supabase Storage (documentos)
- [ ] Analytics (opcional: Plausible)

---

## 📊 MÉTRICAS DE ÉXITO

### Performance
- [ ] Tiempo de carga del dashboard < 2s
- [ ] Optimización de queries (índices en BD)
- [ ] Lazy loading de componentes pesados

### UX
- [ ] Navegación intuitiva
- [ ] Feedback visual en todas las acciones
- [ ] Estados de loading claros
- [ ] Mensajes de error descriptivos

### Seguridad
- [ ] Todas las acciones logueadas
- [ ] Verificación de permisos en backend
- [ ] Rate limiting en APIs sensibles
- [ ] Sanitización de inputs

---

## 🚀 ROADMAP RESUMIDO

**Semana 1-2:** Fase 1 (Estructura, Home, Usuarios, Certificaciones, Moderación)  
**Semana 3-4:** Fase 2 (Pagos, Tickets, Mensajería, Verificaciones, Logs)  
**Semana 5-6:** Fase 3 (Analytics, Tienda, Reservas, Chat, Config)  
**Semana 7:** Testing, optimización y documentación

---

## ✅ CHECKLIST DE LANZAMIENTO

Antes de poner en producción:
- [ ] Todos los módulos de Fase 1 completados y testeados
- [ ] Middleware de admin funcionando
- [ ] Logs de auditoría activos
- [ ] Backup automático configurado
- [ ] Documentación básica creada
- [ ] Tests E2E de funciones críticas
- [ ] Plan de rollback preparado

---

**Última actualización:** Octubre 2025  
**Estado:** 🔴 No iniciado
