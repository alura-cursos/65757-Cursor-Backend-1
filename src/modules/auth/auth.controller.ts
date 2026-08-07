import type { Request, Response } from 'express'
import { AuthService } from './auth.service.js'

export class AuthController {
  private readonly service = new AuthService()

  async register(req: Request, res: Response) {
    const result = await this.service.register(req.body)
    return res.status(201).json(result)
  }

  async login(req: Request, res: Response) {
    const result = await this.service.login(req.body)
    return res.json(result)
  }

  async me(req: Request, res: Response) {
    const result = await this.service.me(req.user!.sub)
    return res.json(result)
  }
}
