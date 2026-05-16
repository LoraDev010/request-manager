# Gestor de Solicitudes

Aplicación full-stack para gestionar solicitudes con flujo de aprobación.

## Arquitectura

```
api-validator/
├── backend/          API REST con Express + TypeScript
│   ├── src/
│   │   ├── routes/        → Definición de rutas HTTP
│   │   ├── controllers/   → Manejo de request/response
│   │   ├── services/      → Lógica de negocio
│   │   ├── repositories/  → Acceso a datos (interfaz + implementación in-memory)
│   │   ├── middleware/    → Manejador de errores + validación Zod
│   │   ├── schemas/       → Schemas de validación con Zod
│   │   └── errors/        → Clases de error personalizadas
│   └── tests/             → Tests de integración (Supertest)
└── frontend/         SPA con React + Vite + TypeScript
    ├── src/
    │   ├── components/    → RequestList, RequestCard, CreateRequestForm
    │   ├── hooks/         → Hooks de TanStack Query
    │   ├── services/      → Cliente API con Axios
    │   └── types/         → Interfaces TypeScript compartidas
    └── tests/             → Tests de componentes (Vitest + RTL)
```

## Stack Tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Runtime backend | Node.js + Express | Estándar, minimalista |
| Lenguaje backend | TypeScript | Tipado estático |
| Validación de entrada | Zod | Orientado a schemas, errores descriptivos |
| Tests backend | Jest + Supertest | Tests de integración HTTP reales |
| Build frontend | Vite + React | Tooling moderno y rápido |
| Lenguaje frontend | TypeScript | Tipado estático |
| Server state | TanStack Query | Caché + estados de carga |
| Cliente HTTP | Axios | Configuración centralizada |
| Tests frontend | Vitest + RTL | Tests orientados al comportamiento |

## Inicio Rápido

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev       # http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

## Referencia de API

| Método | Endpoint | Descripción | Éxito | Error |
|---|---|---|---|---|
| `GET` | `/requests` | Listar todas las solicitudes | 200 | — |
| `POST` | `/requests` | Crear solicitud | 201 | 400 |
| `PATCH` | `/requests/:id` | Aprobar o rechazar | 200 | 404, 409 |

Todas las respuestas siguen el envelope: `{ "data": ..., "error": ... }`

### Ejemplo: Crear solicitud

```bash
curl -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d '{ "title": "Aprobación de presupuesto" }'
```

### Ejemplo: Aprobar solicitud

```bash
curl -X PATCH http://localhost:3000/requests/<id> \
  -H "Content-Type: application/json" \
  -d '{ "status": "APPROVED" }'
```

## Ejecutar Tests

```bash
# Backend (8 tests de integración)
cd backend && npm test

# Frontend (4 tests de componentes)
cd frontend && npm test
```

## Decisiones Técnicas Clave

- **409 Conflict** para violaciones de reglas de negocio (no 400) — el estado del recurso impide la operación, no un input malformado
- **Patrón Repository con interfaz** — la lógica de negocio está desacoplada del almacenamiento; se puede migrar a cualquier DB sin tocar los servicios
- **TanStack Query** — server state gestionado separado del UI state; caché automático y refetch
- **Envelope de API consistente** `{ data, error }` — contrato predecible en todos los endpoints

Ver [`spec.md`](./spec.md) para reglas de negocio completas y contrato de API.  
Ver [`ai-usage.md`](./ai-usage.md) para declaración de uso de herramientas IA.
