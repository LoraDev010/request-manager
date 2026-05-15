# Especificación – Gestor de Solicitudes

## Propósito

Sistema para registrar y procesar solicitudes de aprobación. Permite crear solicitudes, listarlas y aprobarlas o rechazarlas con un flujo de estado controlado.

---

## Modelo de Datos

### Request

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | string (UUID v4) | generado por el servidor, inmutable |
| `title` | string | requerido, no vacío, máximo 500 caracteres |
| `status` | `PENDING` \| `APPROVED` \| `REJECTED` | inicia siempre en `PENDING` |
| `createdAt` | string (ISO 8601) | generado por el servidor, inmutable |

---

## Requisitos

### Requisito: Creación de solicitudes

El sistema DEBE crear solicitudes con estado `PENDING` y un `title` válido.

#### Escenario: title válido

- GIVEN un body con `title` no vacío
- WHEN `POST /requests`
- THEN responde 201 con `status: "PENDING"` y envelope `{ data, error: null }`

#### Escenario: title ausente

- GIVEN un body sin campo `title`
- WHEN `POST /requests`
- THEN responde 400 con `code: "VALIDATION_ERROR"` y `message: "title is required"`

#### Escenario: title vacío

- GIVEN un body con `title: ""`
- WHEN `POST /requests`
- THEN responde 400 con `code: "VALIDATION_ERROR"` y `message: "title cannot be empty"`

---

### Requisito: Listado de solicitudes

El sistema DEBE retornar todas las solicitudes existentes.

#### Escenario: repositorio con solicitudes

- GIVEN N solicitudes creadas
- WHEN `GET /requests`
- THEN responde 200 con array de N items en `data`

#### Escenario: repositorio vacío

- GIVEN ninguna solicitud creada
- WHEN `GET /requests`
- THEN responde 200 con `data: []`

---

### Requisito: Procesamiento de solicitudes

El sistema DEBE permitir aprobar o rechazar únicamente solicitudes en estado `PENDING`.

#### Escenario: aprobar solicitud PENDING

- GIVEN una solicitud con `status: "PENDING"`
- WHEN `PATCH /requests/:id` con `{ "status": "APPROVED" }`
- THEN responde 200 con `status: "APPROVED"` en `data`

#### Escenario: rechazar solicitud PENDING

- GIVEN una solicitud con `status: "PENDING"`
- WHEN `PATCH /requests/:id` con `{ "status": "REJECTED" }`
- THEN responde 200 con `status: "REJECTED"` en `data`

#### Escenario: solicitud ya procesada

- GIVEN una solicitud con `status: "APPROVED"` o `"REJECTED"`
- WHEN `PATCH /requests/:id` con cualquier status válido
- THEN responde 409 con `code: "REQUEST_ALREADY_PROCESSED"`

#### Escenario: solicitud inexistente

- GIVEN un `id` que no existe en el repositorio
- WHEN `PATCH /requests/:id`
- THEN responde 404 con `code: "REQUEST_NOT_FOUND"`

#### Escenario: status inválido

- GIVEN un body con `status` fuera de `"APPROVED"` o `"REJECTED"`
- WHEN `PATCH /requests/:id`
- THEN responde 400 con `code: "VALIDATION_ERROR"`

---

## Contrato de API

Todas las respuestas siguen el envelope:
```json
{ "data": <T> | null, "error": { "code": "...", "message": "..." } | null }
```

### POST /requests

**Cuerpo:**
```json
{ "title": "string (requerido, max 500 chars)" }
```

**201 – creada:**
```json
{
  "data": { "id": "uuid", "title": "string", "status": "PENDING", "createdAt": "ISO8601" },
  "error": null
}
```

**400 – validación:**
```json
{ "data": null, "error": { "code": "VALIDATION_ERROR", "message": "title is required" } }
```

---

### GET /requests

**200:**
```json
{
  "data": [{ "id": "uuid", "title": "string", "status": "PENDING|APPROVED|REJECTED", "createdAt": "ISO8601" }],
  "error": null
}
```

---

### PATCH /requests/:id

**Cuerpo:**
```json
{ "status": "APPROVED" | "REJECTED" }
```

**200:**
```json
{
  "data": { "id": "uuid", "title": "string", "status": "APPROVED", "createdAt": "ISO8601" },
  "error": null
}
```

**400 – status inválido:**
```json
{ "data": null, "error": { "code": "VALIDATION_ERROR", "message": "status must be APPROVED or REJECTED" } }
```

**404 – no encontrada:**
```json
{ "data": null, "error": { "code": "REQUEST_NOT_FOUND", "message": "..." } }
```

**409 – ya procesada:**
```json
{ "data": null, "error": { "code": "REQUEST_ALREADY_PROCESSED", "message": "..." } }
```

---

## Referencia de Códigos de Error

| Código | Estado HTTP | Cuándo |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Campos faltantes o inválidos |
| `REQUEST_NOT_FOUND` | 404 | El ID no existe |
| `REQUEST_ALREADY_PROCESSED` | 409 | La solicitud no está en estado PENDING |
| `INTERNAL_ERROR` | 500 | Error inesperado del servidor |

---

## Decisiones Técnicas

### Backend
- **Express.js + TypeScript** – framework minimalista, tipado completo, estándar de la industria
- **Arquitectura en capas** (routes → controllers → services → repositories) – responsabilidad única por capa, permite testing independiente y futura migración de base de datos sin tocar la lógica de negocio
- **Patrón Repository con interfaz** – `IRequestRepository` desacopla la lógica de negocio del almacenamiento. Cambiar de in-memory a MongoDB/SQL solo requiere una nueva implementación
- **Validación con Zod** – validación orientada a schemas con mensajes de error descriptivos
- **409 Conflict para violaciones de reglas de negocio** – código HTTP semánticamente correcto cuando el estado actual del recurso impide la operación (distinto de 400 que indica input malformado)
- **Envelope de respuesta consistente** `{ data, error }` – contrato predecible para todos los consumidores

### Frontend
- **React + Vite + TypeScript** – setup rápido, tipado completo
- **TanStack Query** – maneja server state (caché, carga, refetch) separado del UI state; elimina el patrón manual `useEffect` + `useState` para fetching
- **Axios** – cliente HTTP con configuración centralizada de base URL

---

## Supuestos

- Sin autenticación (fuera del alcance según spec)
- Persistencia en memoria (se resetea al reiniciar el servidor); la interfaz del repositorio está diseñada para migrar a almacenamiento persistente sin cambiar la lógica de negocio
- Un único campo `status` controla todo el flujo de aprobación
