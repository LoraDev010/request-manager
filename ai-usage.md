# Registro de Uso de IA

## Herramientas Utilizadas

- **Claude (Anthropic)** – planificación de arquitectura, revisión de estructura de código, redacción de documentación y guía visual del frontend

## En qué ayudó la IA

- Diseñar la estructura de respuesta API `{ data, error }` (envelope)
- Sugerir la organización de carpetas para la arquitectura en capas
- Generar boilerplate para schemas de Zod y estructura de archivos de test
- Redactar contenido inicial para `spec.md` y `README.md`
- Proponer una dirección visual para el frontend basada en los colores y estilo corporativo de Choucair Testing

## Qué fue validado manualmente

- **Aplicación de reglas de negocio** – verificado que la capa de servicios lanza `ConflictError` correctamente cuando el estado no es `PENDING`, no solo en tests sino razonando el state machine
- **Códigos de estado HTTP** – la IA inicialmente sugirió `400` para violaciones de reglas de negocio; corregido a `409 Conflict` basado en semántica del spec HTTP (conflicto de estado del recurso vs. petición malformada)
- **Calidad de los tests** – revisado cada test para asegurar que valida comportamiento (qué hace el sistema) y no detalles de implementación (cómo lo hace)
- **Diseño de la interfaz del repositorio** – verificado que la interfaz es mínima y genérica para ser implementada por un adaptador de base de datos real sin cambios en la capa de servicios
- **Gestión de estado en frontend** – confirmado que TanStack Query era la herramienta correcta para server state vs. UI state local
- **Diseño visual del frontend** – la IA propuso una paleta y estructura de componentes; los colores corporativos, tipografía y disposición final fueron revisados y ajustados manualmente para alinearlos con la identidad de Choucair Testing

## Decisiones del Desarrollador (no de la IA)

- Elegir **TanStack Query** sobre `useState + useEffect` para fetching – la IA sugirió ambas opciones; se seleccionó TQ porque maneja caché, refetch en background y estados de carga automáticamente
- Elegir **`409 Conflict`** sobre `400 Bad Request` para `REQUEST_ALREADY_PROCESSED` – semántica HTTP: 400 = input inválido, 409 = input válido pero el estado del recurso impide la operación
- Elegir **repositorio in-memory con interfaz** sobre base de datos real – añade claridad arquitectónica sin complejidad de infraestructura; la interfaz hace que una futura migración a DB sea directa
- Decidir **no agregar autenticación JWT** – no lo pide la spec; añadirlo sería sobreingeniería e introduciría complejidad innecesaria
- Definir **paleta de colores y estética final** – la IA ofreció opciones; se eligió blanco/negro con `#007D70` como acento único para respetar la identidad visual de Choucair

## Problemas Encontrados y Corregidos

- La IA generó un controller que llamaba `repository.save()` directamente – corregido para pasar por la capa de servicios y mantener la lógica de negocio centralizada
- La IA escribió inicialmente tests de frontend usando `fireEvent` – reemplazados con queries de `screen` y aserciones de comportamiento que no dependen de detalles de implementación
- La IA sugirió agregar `try/catch` en la capa del repositorio – eliminado porque los repositorios no deben manejar errores; esa responsabilidad pertenece a la capa de servicios
- La IA asumió colores incorrectos para el frontend (rojo) – corregido manualmente tras revisar la identidad real de Choucair Testing
