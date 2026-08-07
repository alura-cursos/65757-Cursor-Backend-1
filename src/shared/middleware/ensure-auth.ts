import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/app-error.js'

export type AuthPayload = {
  sub: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function ensureAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Não autenticado', 401)
  }

  const token = header.slice('Bearer '.length)
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new AppError('JWT_SECRET não configurado', 500)
  }

  try {
    const payload = jwt.verify(token, secret) as AuthPayload
    req.user = payload
    next()
  } catch {
    throw new AppError('Token inválido ou expirado', 401)
  }
}
