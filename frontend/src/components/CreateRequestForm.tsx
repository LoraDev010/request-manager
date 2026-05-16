import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCreateRequest } from '../hooks/useRequests'

export function CreateRequestForm() {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const { mutate, isPending } = useCreateRequest()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }
    setError('')
    mutate(title.trim(), {
      onSuccess: () => setTitle(''),
      onError: (err) => setError(err.message),
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-header-icon">＋</div>
        <h2 className="form-title">NUEVA SOLICITUD</h2>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            className={`form-input ${error ? 'form-input-error' : ''}`}
            placeholder="Describe la solicitud..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
          {error && <span className="form-error">⚠ {error}</span>}
        </div>
        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending ? '⏳ Creando...' : 'Crear solicitud'}
        </button>
      </div>
    </form>
  )
}
