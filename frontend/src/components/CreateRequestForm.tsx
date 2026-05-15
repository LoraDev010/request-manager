import { useState, FormEvent } from 'react'
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
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form-title">Nueva Solicitud</h2>
      <div className="form-group">
        <input
          type="text"
          className={`form-input ${error ? 'form-input-error' : ''}`}
          placeholder="Título de la solicitud"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
      <button className="btn btn-primary" type="submit" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear solicitud'}
      </button>
    </form>
  )
}
