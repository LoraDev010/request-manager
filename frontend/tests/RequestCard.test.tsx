import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RequestCard } from '../src/components/RequestCard'
import type { Request } from '../src/types'

vi.mock('../src/services/api', () => ({
  updateRequestStatus: vi.fn(),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
)

const base: Request = {
  id: '1',
  title: 'Test request',
  createdAt: new Date().toISOString(),
  status: 'PENDING',
}

describe('RequestCard', () => {
  it('shows Aprobar and Rechazar buttons when status is PENDING', () => {
    render(wrap(<RequestCard request={base} />))
    expect(screen.getByText(/Aprobar/)).toBeInTheDocument()
    expect(screen.getByText(/Rechazar/)).toBeInTheDocument()
  })

  it('does not show action buttons when status is APPROVED', () => {
    render(wrap(<RequestCard request={{ ...base, status: 'APPROVED' }} />))
    expect(screen.queryByText('Aprobar')).not.toBeInTheDocument()
    expect(screen.queryByText('Rechazar')).not.toBeInTheDocument()
  })

  it('does not show action buttons when status is REJECTED', () => {
    render(wrap(<RequestCard request={{ ...base, status: 'REJECTED' }} />))
    expect(screen.queryByText('Aprobar')).not.toBeInTheDocument()
    expect(screen.queryByText('Rechazar')).not.toBeInTheDocument()
  })

  it('renders correct badge for each status', () => {
    const { rerender } = render(wrap(<RequestCard request={base} />))
    expect(screen.getByText('Pendiente')).toBeInTheDocument()

    rerender(wrap(<RequestCard request={{ ...base, status: 'APPROVED' }} />))
    expect(screen.getByText('Aprobada')).toBeInTheDocument()

    rerender(wrap(<RequestCard request={{ ...base, status: 'REJECTED' }} />))
    expect(screen.getByText('Rechazada')).toBeInTheDocument()
  })
})
