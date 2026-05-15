export type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Request {
  id: string
  title: string
  status: Status
  createdAt: string
}

export interface ApiResponse<T> {
  data: T | null
  error: { code: string; message: string } | null
}
