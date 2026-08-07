import { Router } from 'express'
import { AuthController } from './auth.controller.js'
import { ensureAuth } from '../../shared/middleware/ensure-auth.js'
import { validate } from '../../shared/middleware/validate.js'
import { loginSchema, registerSchema } from './auth.schemas.js'

export const authRoutes = Router()
const controller = new AuthController()

authRoutes.post('/register', validate({ body: registerSchema }), (req, res, next) =>
  controller.register(req, res).catch(next),
)

authRoutes.post('/login', validate({ body: loginSchema }), (req, res, next) =>
  controller.login(req, res).catch(next),
)

authRoutes.get('/me', ensureAuth, (req, res, next) =>
  controller.me(req, res).catch(next),
)
