import type { Request, Response } from 'express'
import { ProtectionsService } from './protections.service.js'

export class ProtectionsController {
  private readonly service = new ProtectionsService()

  async list(_req: Request, res: Response) {
    const protections = await this.service.list()
    return res.json(protections)
  }
}
