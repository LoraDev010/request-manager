# Especificación – Gestor de Solicitudes

## Reglas de Negocio

1. Toda solicitud se crea con estado `PENDING`.
2. Solo las solicitudes en estado `PENDING` pueden ser aprobadas o rechazadas.
3. Intentar modificar una solicitud `APPROVED` o `REJECTED` retorna `409 Conflict`.
4. El campo `title` es obligatorio y no puede estar vacío.
5. `PATCH /requests/:id` acepta únicamente `{ "status": "APPROVED" | "REJECTED" }`.

## Contrato de API

### POST /requests

Crea una nueva solicitud.

**Cuerpo de la petición:**
```json
{ "title": "string (requerido)" }
```

**Respuesta 201:**
```json
{
  "data": { "id": "uuid", "title": "string", "status": "PENDING", "createdAt": "ISO8601" },
  "error": null
}
```

**Respuesta 400 – title faltante:**
```json
{ "data": null, "error": { "code": "VALIDATION_ERROR", "message": "title is required" } }
```

---

### GET /requests

Retorna todas las solicitudes.

**Respuesta 200:**
```json
{
  "data": [{ "id": "uuid", "title": "string", "status": "PENDING|APPROVED|REJECTED", "createdAt": "ISO8601" }],
  "error": null
}
```

---

### PATCH /requests/:id

Aprueba o rechaza una solicitud.

**Cuerpo de la petición:**
```json
{ "status": "APPROVED" | "REJECTED" }
```

**Respuesta 200:**
```json
{
  "data": { "id": "uuid", "title": "string", "status": "APPROVED", "createdAt": "ISO8601" },
  "error": null
}
```

**Respuesta 404 – no encontrada:**
```json
{ "data": null, "error": { "code": "REQUEST_NOT_FOUND", "message": "..." } }
```

**Respuesta 409 – ya procesada:**
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

## Supuestos

- Sin autenticación (fuera del alcance según spec)
- Persistencia en memoria (se resetea al reiniciar el servidor); la interfaz del repositorio está diseñada para migrar a almacenamiento persistente sin cambiar la lógica de negocio
- Un único campo `status` controla todo el flujo de aprobación
