import type { Request, Response } from 'express'
import { ReservationsService } from './reservations.service.js'

export class ReservationsController {
  private readonly service = new ReservationsService()

  async quote(req: Request, res: Response) {
    const quote = await this.service.quote(req.body)
    return res.json(quote)
  }

  async create(req: Request, res: Response) {
    const reservation = await this.service.create(req.body)
    return res.status(201).json(reservation)
  }

  async list(_req: Request, res: Response) {
    const reservations = await this.service.list()
    return res.json(reservations)
  }

  async getById(req: Request, res: Response) {
    const reservation = await this.service.getByIdOrCode(
      req.params.id as string,
    )
    return res.json(reservation)
  }

  async cancel(req: Request, res: Response) {
    const reservation = await this.service.cancel(req.params.id as string)
    return res.json(reservation)
  }
}
