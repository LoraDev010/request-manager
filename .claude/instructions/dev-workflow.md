# Dev Workflow

## Setup inicial

```bash
cd backend && npm install
cd frontend && npm install
```

Ambos directorios tienen sus propias dependencias. Nunca instalar desde la raíz.

## Levantar el proyecto

```bash
# Terminal 1
cd backend && npm run dev    # :3000

# Terminal 2
cd frontend && npm run dev   # :5173
```

## Datos en memoria

`InMemoryRequestRepository` no persiste. Los datos se resetean al reiniciar el servidor.

- Los tests deben ser independientes — nunca asumir estado previo
- Si el frontend muestra lista vacía después de reiniciar: es correcto, no es un bug

## Agentes de calidad — cuándo ejecutar cada uno

| Agente | Ejecutar cuando... |
|--------|-------------------|
| `test-validator` | Después de agregar o modificar tests |
| `architecture-validator` | Después de agregar una capa, mover archivos, o cambiar imports |
| `security-auditor` | Después de cambiar validación de inputs, headers, o rate limiting |
| `qa-gates` | Siempre como último paso antes de un PR |

**Orden obligatorio antes de PR:**
```
use agent test-validator
use agent architecture-validator
use agent security-auditor
use agent qa-gates
```

qa-gates lee los reportes de los otros 3 — si no corren primero, qa-gates da BLOCKED.
