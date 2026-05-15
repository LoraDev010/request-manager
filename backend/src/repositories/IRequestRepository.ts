import { Request, Status } from '../types'

export interface IRequestRepository {
  findAll(): Request[]
  findById(id: string): Request | undefined
  create(title: string): Request
  updateStatus(id: string, status: Status): Request
}
