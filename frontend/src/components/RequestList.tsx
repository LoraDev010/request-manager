import { useRequests } from '../hooks/useRequests'
import { RequestCard } from './RequestCard'

export function RequestList() {
  const { data: requests, isLoading, isError } = useRequests()

  if (isLoading) {
    return <p className="state-message">Cargando solicitudes...</p>
  }

  if (isError) {
    return (
      <p className="state-message state-error">
        <strong>Error de conexión</strong>
        Verifica que el servidor esté activo en el puerto 3000.
      </p>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <p className="state-message">
        <strong>Sin solicitudes aún</strong>
        Crea la primera solicitud usando el formulario.
      </p>
    )
  }

  return (
    <div className="list">
      {requests.map((req) => (
        <RequestCard key={req.id} request={req} />
      ))}
    </div>
  )
}
