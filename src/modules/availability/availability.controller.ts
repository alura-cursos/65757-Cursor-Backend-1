import type { Request, Response } from 'express'
import { AvailabilityService } from './availability.service.js'
import type { AvailabilityQuery } from './availability.schemas.js'

export class AvailabilityController {
  private readonly service = new AvailabilityService()

  async list(req: Request, res: Response) {
    const cars = await this.service.list(req.query as unknown as AvailabilityQuery)
    return res.json(cars)
  }
}
