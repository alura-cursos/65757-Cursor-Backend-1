import { prisma } from '../../shared/lib/prisma.js'
import { AppError } from '../../shared/errors/app-error.js'
import { serializeProtection } from './protections.serializer.js'
import type {
  CreateProtectionInput,
  UpdateProtectionInput,
} from './protections.schemas.js'

export class ProtectionsService {
  async list() {
    const protections = await prisma.protection.findMany({
      orderBy: { pricePerDay: 'asc' },
    })

    return protections.map(serializeProtection)
  }

  async getById(idOrSlug: string) {
    const protection = await prisma.protection.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    })

    if (!protection) {
      throw new AppError('Seguro não encontrado', 404)
    }

    return serializeProtection(protection)
  }

  async create(input: CreateProtectionInput) {
    const existing = await prisma.protection.findUnique({
      where: { slug: input.slug },
    })

    if (existing) {
      throw new AppError('Já existe um seguro com este slug', 409)
    }

    const protection = await prisma.protection.create({
      data: {
        slug: input.slug,
        name: input.name,
        pricePerDay: input.pricePerDay,
        benefits: JSON.stringify(input.benefits),
      },
    })

    return serializeProtection(protection)
  }

  async update(idOrSlug: string, input: UpdateProtectionInput) {
    const protection = await prisma.protection.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    })

    if (!protection) {
      throw new AppError('Seguro não encontrado', 404)
    }

    if (input.slug && input.slug !== protection.slug) {
      const slugTaken = await prisma.protection.findUnique({
        where: { slug: input.slug },
      })

      if (slugTaken) {
        throw new AppError('Já existe um seguro com este slug', 409)
      }
    }

    const updated = await prisma.protection.update({
      where: { id: protection.id },
      data: {
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.pricePerDay !== undefined && {
          pricePerDay: input.pricePerDay,
        }),
        ...(input.benefits !== undefined && {
          benefits: JSON.stringify(input.benefits),
        }),
      },
    })

    return serializeProtection(updated)
  }

  async delete(idOrSlug: string) {
    const protection = await prisma.protection.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        _count: { select: { reservations: true } },
      },
    })

    if (!protection) {
      throw new AppError('Seguro não encontrado', 404)
    }

    if (protection._count.reservations > 0) {
      throw new AppError(
        'Não é possível excluir um seguro vinculado a reservas',
        409,
      )
    }

    await prisma.protection.delete({ where: { id: protection.id } })
  }
}
