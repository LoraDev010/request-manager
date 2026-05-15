export type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Request {
  id: string
  title: string
  status: Status
  createdAt: string
}

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  code: string
  message: string
}
