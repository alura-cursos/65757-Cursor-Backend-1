import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { prisma } from '../../shared/lib/prisma.js'
import { AppError } from '../../shared/errors/app-error.js'
import type { LoginInput, RegisterInput } from './auth.schemas.js'

function signToken(userId: string, email: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new AppError('JWT_SECRET não configurado', 500)
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
  }

  return jwt.sign({ sub: userId, email }, secret, options)
}

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    })

    if (existing) {
      throw new AppError('E-mail já cadastrado', 409)
    }

    const passwordHash = await bcrypt.hash(input.password, 10)
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash,
      },
    })

    const token = signToken(user.id, user.email)

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    })

    if (!user) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const token = signToken(user.id, user.email)

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    return user
  }
}
