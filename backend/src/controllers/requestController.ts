import { Request, Response, NextFunction } from 'express'
import { RequestService } from '../services/requestService'
import { ApiResponse } from '../types'
import { Request as AppRequest, Status } from '../types'

export class RequestController {
  constructor(private readonly service: RequestService) {}

  getAll = (_req: Request, res: Response): void => {
    const data = this.service.getAll()
    const body: ApiResponse<AppRequest[]> = { data, error: null }
    res.status(200).json(body)
  }

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.create(req.body.title)
      const body: ApiResponse<AppRequest> = { data, error: null }
      res.status(201).json(body)
    } catch (err) {
      next(err)
    }
  }

  updateStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.updateStatus(req.params.id, req.body.status as Status)
      const body: ApiResponse<AppRequest> = { data, error: null }
      res.status(200).json(body)
    } catch (err) {
      next(err)
    }
  }
}
