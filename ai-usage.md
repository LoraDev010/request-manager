# Registro de Uso de IA

## Herramientas Utilizadas

- **Claude (Anthropic)** – asistencia en arquitectura, implementación y documentación del proyecto

## Para Qué Se Utilizó

- Generar boilerplate inicial (schemas Zod, estructura de archivos de test, wiring Express)
- Implementar la estructura de carpetas según la arquitectura en capas definida previamente
- Redactar el contenido textual de `spec.md` y `README.md` a partir de decisiones ya tomadas
- Proponer opciones de dirección visual para el frontend

## Qué Fue Validado Manualmente

- **Reglas de negocio** – verificado que la capa de servicios lanza `ConflictError` correctamente cuando el estado no es `PENDING`, razonando el state machine completo
- **Códigos de estado HTTP** – la IA sugirió `400` para violaciones de reglas de negocio; corregido a `409 Conflict` basado en semántica HTTP (conflicto de estado del recurso vs. petición malformada)
- **Calidad de los tests** – revisado cada test para asegurar que valida comportamiento y no detalles de implementación
- **Diseño de la interfaz del repositorio** – verificado que `IRequestRepository` es mínima y genérica para permitir una futura migración a DB sin tocar la capa de servicios
- **Gestión de estado en frontend** – confirmado que TanStack Query era la elección correcta para server state vs. UI state local
- **Diseño visual del frontend** – paleta de colores, tipografía y disposición final revisados y ajustados manualmente para alinearlos con la identidad de Choucair Testing

## Problemas Encontrados y Corregidos

- La IA generó un controller que llamaba `repository.save()` directamente – corregido para pasar por la capa de servicios y mantener la lógica de negocio centralizada
- La IA sugirió agregar `try/catch` en la capa del repositorio – eliminado porque los repositorios no deben manejar errores; esa responsabilidad pertenece a los servicios
- La IA escribió tests de frontend usando `fireEvent` – reemplazados con queries de `screen` y aserciones de comportamiento
- La IA no cubrió el escenario `title: ""` (string vacío) ni `PATCH PENDING → REJECTED` en la suite de tests – gaps identificados manualmente y corregidos
- La IA asumió colores incorrectos para el frontend – corregido tras revisar la identidad real de Choucair Testing
