# Claude Boundaries

Lo que Claude NO hace en este proyecto, sin importar lo que se pida.

## Fuera de scope — no implementar

| Qué | Por qué |
|-----|---------|
| Auth / JWT / sesiones | No lo pide la spec. Agregar es ruido, no valor |
| Base de datos real (Postgres, MongoDB, etc.) | El patrón Repository ya demuestra la abstracción |
| Docker / docker-compose | Bajo ROI para el objetivo del proyecto |
| CI/CD (GitHub Actions, etc.) | Fuera del alcance de la prueba técnica |
| Redux / Zustand / estado global adicional | TanStack Query resuelve el problema correctamente |
| UI libraries (MUI, Chakra, etc.) | Distracción del criterio técnico |

## Acciones que requieren confirmación explícita

- `npm install` de dependencias nuevas — preguntar antes
- `git push` a cualquier remote — siempre confirmar
- Crear PRs — siempre confirmar
- Operaciones destructivas de git (`reset --hard`, `force push`, `branch -D`)
- Eliminar archivos existentes

## Estilo de código

- Sin comentarios salvo WHY no obvio (un workaround, una restricción oculta, un invariante sutil)
- Sin docstrings multi-línea
- Sin `console.log` de debug en código committed
- Sin features extra no pedidas — una tarea de bug fix no necesita refactor alrededor

## TypeScript estricto — siempre

- Sin `any` — usar tipos explícitos o `unknown` con narrowing
- Sin `@ts-ignore` ni `@ts-expect-error` sin comentario explicando por qué es necesario
- Sin type assertions (`as Type`) salvo la excepción documentada: `this.map.get(id) as Type` en métodos de escritura del repositorio (válido por contrato — el service siempre llama `findById` antes)
- Frontend: todos los imports de solo tipos usan `import type { ... }` — `verbatimModuleSyntax: true` lo hace obligatorio
- Parámetros y retornos de funciones públicas siempre tipados explícitamente

## Restricciones de proyecto

- No leer ni tocar proyectos fuera de `/home/lora/projects/api-validator/`
- No ejecutar `npm audit` — eso es responsabilidad del agente `security-auditor`
- No modificar `.claude/agents/*.md` salvo instrucción explícita del usuario
- Los reportes en `.claude/*.md` los escriben los agentes, no Claude directamente
