import type { Prisma } from '@prisma/client'
import { prisma } from '../../shared/lib/prisma.js'
import { AppError } from '../../shared/errors/app-error.js'
import { serializeCar } from '../cars/cars.serializer.js'
import type { AvailabilityQuery } from './availability.schemas.js'

function parseDateOnly(value: string) {
  const date = new Date(`${value}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    throw new AppError('Data inválida')
  }
  return date
}

export class AvailabilityService {
  async list(query: AvailabilityQuery) {
    const pickupDate = parseDateOnly(query.pickupDate)
    const returnDate = parseDateOnly(query.returnDate)

    if (returnDate < pickupDate) {
      throw new AppError(
        'A data de devolução deve ser igual ou posterior à retirada',
      )
    }

    const [pickupLocation, returnLocation] = await Promise.all([
      prisma.location.findUnique({ where: { id: query.pickupLocationId } }),
      prisma.location.findUnique({ where: { id: query.returnLocationId } }),
    ])

    if (!pickupLocation || !returnLocation) {
      throw new AppError('Local de retirada ou devolução inválido', 404)
    }

    const busyReservations = await prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED',
        pickupDate: { lte: returnDate },
        returnDate: { gte: pickupDate },
      },
      select: { carId: true },
    })

    const busyCarIds = [...new Set(busyReservations.map((item) => item.carId))]

    const where: Prisma.CarWhereInput = {
      available: true,
      ...(busyCarIds.length > 0 ? { id: { notIn: busyCarIds } } : {}),
    }

    if (query.category) {
      where.category = { contains: query.category }
    }

    if (query.q) {
      where.OR = [
        { name: { contains: query.q } },
        { category: { contains: query.q } },
        { description: { contains: query.q } },
      ]
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: { pricePerDay: 'asc' },
    })

    return cars.map(serializeCar)
  }
}
