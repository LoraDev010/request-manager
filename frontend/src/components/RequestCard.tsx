import { Request, Status } from '../types'
import { useUpdateRequest } from '../hooks/useRequests'

const statusStyles: Record<Status, string> = {
  PENDING: 'badge badge-pending',
  APPROVED: 'badge badge-approved',
  REJECTED: 'badge badge-rejected',
}

const statusLabel: Record<Status, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
}

interface Props {
  request: Request
}

export function RequestCard({ request }: Props) {
  const { mutate, isPending } = useUpdateRequest()
  const isPendingStatus = request.status === 'PENDING'

  const handleAction = (status: Status) => {
    mutate({ id: request.id, status })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{request.title}</h3>
        <span className={statusStyles[request.status]}>{statusLabel[request.status]}</span>
      </div>
      <p className="card-date">{new Date(request.createdAt).toLocaleString('es-CO')}</p>
      {isPendingStatus && (
        <div className="card-actions">
          <button
            className="btn btn-approve"
            onClick={() => handleAction('APPROVED')}
            disabled={isPending}
          >
            {isPending ? 'Procesando...' : 'Aprobar'}
          </button>
          <button
            className="btn btn-reject"
            onClick={() => handleAction('REJECTED')}
            disabled={isPending}
          >
            {isPending ? 'Procesando...' : 'Rechazar'}
          </button>
        </div>
      )}
    </div>
  )
}
