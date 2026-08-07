import type { Request, Response } from 'express'
import { CarsService } from './cars.service.js'

export class CarsController {
  private readonly service = new CarsService()

  async list(req: Request, res: Response) {
    const cars = await this.service.list(req.query as never)
    return res.json(cars)
  }

  async categories(_req: Request, res: Response) {
    const categories = await this.service.categories()
    return res.json(categories)
  }

  async getById(req: Request, res: Response) {
    const car = await this.service.getById(req.params.id as string)
    return res.json(car)
  }
}
