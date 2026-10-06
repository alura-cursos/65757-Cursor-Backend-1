import type { Request, Response } from 'express'
import { ProtectionsService } from './protections.service.js'

export class ProtectionsController {
  private readonly service = new ProtectionsService()

  async list(_req: Request, res: Response) {
    const protections = await this.service.list()
    return res.json(protections)
  }

  async getById(req: Request, res: Response) {
    const protection = await this.service.getById(req.params.id as string)
    return res.json(protection)
  }

  async create(req: Request, res: Response) {
    const protection = await this.service.create(req.body)
    return res.status(201).json(protection)
  }

  async update(req: Request, res: Response) {
    const protection = await this.service.update(
      req.params.id as string,
      req.body,
    )
    return res.json(protection)
  }

  async delete(req: Request, res: Response) {
    await this.service.delete(req.params.id as string)
    return res.status(204).send()
  }
}
