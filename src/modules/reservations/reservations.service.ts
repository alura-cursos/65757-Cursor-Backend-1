import { prisma } from '../../shared/lib/prisma.js'
import { AppError } from '../../shared/errors/app-error.js'
import { serializeCar } from '../cars/cars.serializer.js'
import { serializeProtection } from '../protections/protections.serializer.js'
import { serializeReservation } from './reservations.serializer.js'
import type { CreateReservationInput } from './reservations.schemas.js'

function parseDateOnly(value: string) {
  const date = new Date(`${value}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    throw new AppError('Data inválida')
  }
  return date
}

function diffInDays(pickupDate: Date, returnDate: Date) {
  const ms = returnDate.getTime() - pickupDate.getTime()
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return Math.max(days, 1)
}

function generateReservationCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const letters = Array.from({ length: 4 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('')
  const numbers = String(Math.floor(1000 + Math.random() * 9000))
  return `${letters}${numbers}`
}

export class ReservationsService {
  private async buildQuote(input: CreateReservationInput) {
    const pickupDate = parseDateOnly(input.pickupDate)
    const returnDate = parseDateOnly(input.returnDate)

    if (returnDate < pickupDate) {
      throw new AppError('A data de devolução deve ser igual ou posterior à retirada')
    }

    const car = await prisma.car.findFirst({
      where: {
        OR: [{ id: input.carId }, { slug: input.carId }],
        available: true,
      },
    })

    if (!car) {
      throw new AppError('Veículo não encontrado ou indisponível', 404)
    }

    const [pickupLocation, returnLocation] = await Promise.all([
      prisma.location.findUnique({ where: { id: input.pickupLocationId } }),
      prisma.location.findUnique({ where: { id: input.returnLocationId } }),
    ])

    if (!pickupLocation || !returnLocation) {
      throw new AppError('Local de retirada ou devolução inválido', 404)
    }

    let protection = null
    if (input.protectionId) {
      protection = await prisma.protection.findFirst({
        where: {
          OR: [{ id: input.protectionId }, { slug: input.protectionId }],
        },
      })

      if (!protection) {
        throw new AppError('Proteção não encontrada', 404)
      }
    }

    const days = diffInDays(pickupDate, returnDate)
    const carSubtotal = Number((car.pricePerDay * days).toFixed(2))
    const protectionSubtotal = protection
      ? Number((protection.pricePerDay * days).toFixed(2))
      : 0
    const totalPrice = Number((carSubtotal + protectionSubtotal).toFixed(2))

    return {
      car,
      pickupLocation,
      returnLocation,
      protection,
      pickupDate,
      returnDate,
      days,
      carSubtotal,
      protectionSubtotal,
      totalPrice,
    }
  }

  async quote(input: CreateReservationInput) {
    const quote = await this.buildQuote(input)

    return {
      days: quote.days,
      carSubtotal: quote.carSubtotal,
      protectionSubtotal: quote.protectionSubtotal,
      totalPrice: quote.totalPrice,
      car: serializeCar(quote.car),
      pickupLocation: quote.pickupLocation,
      returnLocation: quote.returnLocation,
      protection: quote.protection
        ? serializeProtection(quote.protection)
        : null,
      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
      returnDate: input.returnDate,
      returnTime: input.returnTime,
    }
  }

  private async getDefaultUserId() {
    const user = await prisma.user.findFirst({
      where: { email: 'cliente@hermex.com' },
      select: { id: true },
    })

    if (!user) {
      throw new AppError(
        'Usuário padrão não encontrado. Execute o seed do banco.',
        500,
      )
    }

    return user.id
  }

  async create(input: CreateReservationInput) {
    const quote = await this.buildQuote(input)
    const userId = await this.getDefaultUserId()

    const overlapping = await prisma.reservation.findFirst({
      where: {
        carId: quote.car.id,
        status: 'CONFIRMED',
        pickupDate: { lte: quote.returnDate },
        returnDate: { gte: quote.pickupDate },
      },
    })

    if (overlapping) {
      throw new AppError('Veículo indisponível para o período selecionado', 409)
    }

    let code = generateReservationCode()
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const exists = await prisma.reservation.findUnique({ where: { code } })
      if (!exists) break
      code = generateReservationCode()
    }

    const reservation = await prisma.reservation.create({
      data: {
        code,
        userId,
        carId: quote.car.id,
        pickupLocationId: quote.pickupLocation.id,
        returnLocationId: quote.returnLocation.id,
        protectionId: quote.protection?.id,
        pickupDate: quote.pickupDate,
        pickupTime: input.pickupTime,
        returnDate: quote.returnDate,
        returnTime: input.returnTime,
        days: quote.days,
        carSubtotal: quote.carSubtotal,
        protectionSubtotal: quote.protectionSubtotal,
        totalPrice: quote.totalPrice,
      },
      include: {
        car: true,
        pickupLocation: true,
        returnLocation: true,
        protection: true,
      },
    })

    return serializeReservation(reservation)
  }

  async list() {
    const reservations = await prisma.reservation.findMany({
      include: {
        car: true,
        pickupLocation: true,
        returnLocation: true,
        protection: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return reservations.map(serializeReservation)
  }

  async getByIdOrCode(idOrCode: string) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [{ id: idOrCode }, { code: idOrCode }],
      },
      include: {
        car: true,
        pickupLocation: true,
        returnLocation: true,
        protection: true,
      },
    })

    if (!reservation) {
      throw new AppError('Reserva não encontrada', 404)
    }

    return serializeReservation(reservation)
  }

  async cancel(idOrCode: string) {
    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [{ id: idOrCode }, { code: idOrCode }],
      },
    })

    if (!reservation) {
      throw new AppError('Reserva não encontrada', 404)
    }

    if (reservation.status === 'CANCELLED') {
      throw new AppError('Reserva já está cancelada')
    }

    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'CANCELLED' },
      include: {
        car: true,
        pickupLocation: true,
        returnLocation: true,
        protection: true,
      },
    })

    return serializeReservation(updated)
  }
}
