import { Request, Status } from '../types'
import { IRequestRepository } from '../repositories/IRequestRepository'
import { NotFoundError, ConflictError } from '../errors/AppError'

export class RequestService {
  constructor(private readonly repository: IRequestRepository) {}

  getAll(): Request[] {
    return this.repository.findAll()
  }

  create(title: string): Request {
    return this.repository.create(title)
  }

  updateStatus(id: string, status: Status): Request {
    const request = this.repository.findById(id)

    if (!request) {
      throw new NotFoundError(`Request with id '${id}' not found`)
    }

    if (request.status !== 'PENDING') {
      throw new ConflictError(
        `Cannot modify request '${id}'. Current status: ${request.status}`
      )
    }

    return this.repository.updateStatus(id, status)
  }
}
