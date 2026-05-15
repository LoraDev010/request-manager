import { v4 as uuidv4 } from 'uuid'
import { Request, Status } from '../types'
import { IRequestRepository } from './IRequestRepository'

export class InMemoryRequestRepository implements IRequestRepository {
  private requests: Map<string, Request> = new Map()

  findAll(): Request[] {
    return Array.from(this.requests.values())
  }

  findById(id: string): Request | undefined {
    return this.requests.get(id)
  }

  create(title: string): Request {
    const request: Request = {
      id: uuidv4(),
      title,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
    this.requests.set(request.id, request)
    return request
  }

  updateStatus(id: string, status: Status): Request {
    // service always verifies existence via findById before calling this
    const existing = this.requests.get(id) as Request
    const updated: Request = { ...existing, status }
    this.requests.set(id, updated)
    return updated
  }
}
