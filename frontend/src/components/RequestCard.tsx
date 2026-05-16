import { useState } from 'react'
import type { Request, Status } from '../types'
import { useUpdateRequest } from '../hooks/useRequests'

const statusStyles: Record<Status, string> = {
  PENDING:  'badge badge-pending',
  APPROVED: 'badge badge-approved',
  REJECTED: 'badge badge-rejected',
}

const statusLabel: Record<Status, string> = {
  PENDING:  'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
}

const cardModifier: Record<Status, string> = {
  PENDING:  'card card--pending',
  APPROVED: 'card card--approved',
  REJECTED: 'card card--rejected',
}

interface Props {
  request: Request
}

export function RequestCard({ request }: Props) {
  const { mutate, isPending } = useUpdateRequest()
  const [actionError, setActionError] = useState('')
  const isPendingStatus = request.status === 'PENDING'

  const handleAction = (status: Status) => {
    setActionError('')
    mutate({ id: request.id, status }, {
      onError: (err) => setActionError(err.message),
    })
  }

  return (
    <div className={cardModifier[request.status]}>
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
            {isPending ? '⏳' : '✓'} Aprobar
          </button>
          <button
            className="btn btn-reject"
            onClick={() => handleAction('REJECTED')}
            disabled={isPending}
          >
            ✕ Rechazar
          </button>
          {actionError && <span className="form-error">⚠ {actionError}</span>}
        </div>
      )}
    </div>
  )
}
