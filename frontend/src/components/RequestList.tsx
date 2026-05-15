import { useRequests } from '../hooks/useRequests'
import { RequestCard } from './RequestCard'

export function RequestList() {
  const { data: requests, isLoading, isError } = useRequests()

  if (isLoading) {
    return <p className="state-message">Cargando solicitudes...</p>
  }

  if (isError) {
    return <p className="state-message state-error">Error al cargar solicitudes. Verifica que el servidor esté activo.</p>
  }

  if (!requests || requests.length === 0) {
    return <p className="state-message">No hay solicitudes aún. Crea la primera.</p>
  }

  return (
    <div className="list">
      {requests.map((req) => (
        <RequestCard key={req.id} request={req} />
      ))}
    </div>
  )
}
