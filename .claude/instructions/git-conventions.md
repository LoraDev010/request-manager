# Git Conventions

## Contributor único

Todos los commits de este proyecto pertenecen a **LoraDev010**. No agregar co-authors ni modificar la configuración de git.

## Formato de commits

```
<tipo>(<scope>): <descripción en imperativo, minúsculas>
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad visible al usuario |
| `fix` | Corrección de bug |
| `test` | Agregar o corregir tests |
| `chore` | Setup, configuración, scaffolding |
| `docs` | README, spec.md, ai-usage.md, CLAUDE.md |
| `refactor` | Cambio interno sin impacto funcional |

### Scopes válidos

`backend` · `frontend` · *(vacío para cambios transversales)*

### Ejemplos correctos

```
feat(backend): implement PATCH /requests/:id with business rules
test(frontend): add unit tests for RequestCard status behavior
fix(backend): return 409 instead of 400 for already-processed requests
docs: update ai-usage with quality pipeline decisions
chore(backend): setup express typescript and jest
```

## Reglas

- Un commit = un cambio cohesivo. No mezclar feat + refactor en el mismo commit
- Descripción en **imperativo presente**: "add" no "added", "fix" no "fixed"
- Sin punto final en la descripción
- Sin `--no-verify` — si un hook falla, corregir el problema, no saltarlo
- No hacer `git push --force` sin confirmación explícita del usuario
- No hacer `git push` a ningún remote sin confirmación explícita del usuario
