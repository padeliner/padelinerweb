# Formateo Markdown en ChatBot

El ChatBot ahora soporta formateo completo de Markdown gracias a Gemini AI.

## Simbologías Soportadas

### 1. **Negritas**
```
**texto en negrita**
__texto en negrita__
```
Resultado: **texto en negrita**

### 2. *Cursivas*
```
*texto en cursiva*
_texto en cursiva_
```
Resultado: *texto en cursiva*

### 3. ***Negrita y Cursiva***
```
***texto en negrita y cursiva***
___texto en negrita y cursiva___
```
Resultado: ***texto en negrita y cursiva***

### 4. Enlaces
```
[Texto del enlace](https://www.ejemplo.com)
```
Resultado: [Texto del enlace](https://www.ejemplo.com)

### 5. Listas Desordenadas
```
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3
```
Resultado:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3

### 6. Listas Ordenadas
```
1. Primer paso
2. Segundo paso
3. Tercer paso
```
Resultado:
1. Primer paso
2. Segundo paso
3. Tercer paso

### 7. Código Inline
```
`código inline`
```
Resultado: `código inline`

### 8. Bloques de Código
````
```javascript
function ejemplo() {
  console.log('Hola mundo');
}
```
````

### 9. Encabezados
```
# Encabezado 1
## Encabezado 2
### Encabezado 3
```

### 10. Citas
```
> Esta es una cita
> Puede tener múltiples líneas
```
Resultado:
> Esta es una cita
> Puede tener múltiples líneas

### 11. Líneas Horizontales
```
---
***
___
```
Resultado: ---

### 12. Tablas (GFM)
```
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dato 1    | Dato 2    | Dato 3    |
| Dato 4    | Dato 5    | Dato 6    |
```

### 13. Tachado (GFM)
```
~~texto tachado~~
```
Resultado: ~~texto tachado~~

### 14. Listas de Tareas (GFM)
```
- [x] Tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea pendiente
```

## Estilos Aplicados

### Para Mensajes del Usuario (fondo verde)
- Fondo: `bg-primary-500`
- Texto: `text-white`
- Código: fondo `bg-white/20`

### Para Mensajes del Bot (fondo blanco)
- Fondo: `bg-white`
- Texto: `text-neutral-900`
- Código: fondo `bg-neutral-100` con texto `text-primary-600`
- Enlaces: `text-primary-600`

## Plugins Utilizados

- **react-markdown**: Renderizado de Markdown
- **remark-gfm**: GitHub Flavored Markdown (tablas, tachado, listas de tareas)

## Ejemplos de Uso

El bot puede responder con formato enriquecido como:

```
¡Hola! Puedo ayudarte con:

**Búsqueda de Entrenadores:**
- Buscar por ciudad
- Filtrar por nivel
- Ver valoraciones

**Información de Precios:**
- Desde **25€/hora** para principiantes
- Hasta **80€/hora** para profesionales

Para más info, visita [nuestra web](https://padeliner.com)
```

Este texto se renderizará con negritas, listas y enlaces funcionales.
