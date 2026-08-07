import type { Request, Response } from 'express'
import { LocationsService } from './locations.service.js'

export class LocationsController {
  private readonly service = new LocationsService()

  async list(_req: Request, res: Response) {
    const locations = await this.service.list()
    return res.json(locations)
  }
}
