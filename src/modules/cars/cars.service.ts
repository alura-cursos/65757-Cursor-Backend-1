import type { Prisma } from '@prisma/client'
import { prisma } from '../../shared/lib/prisma.js'
import { AppError } from '../../shared/errors/app-error.js'
import { serializeCar } from './cars.serializer.js'
import type { ListCarsQuery } from './cars.schemas.js'

export class CarsService {
  async list(query: ListCarsQuery) {
    const where: Prisma.CarWhereInput = {
      available: true,
    }

    if(query.cursor){
      where.pricePerDay={gt:parseFloat(query.cursor)}
    }

    if (query.category) {
      where.category = {
        contains: query.category,
      }
    }

    if (query.q) {
      where.OR = [
        { name: { contains: query.q } },
        { description: { contains: query.q } },
      ]
    }


    const cars = await prisma.car.findMany({
      where,
      orderBy: {pricePerDay:'asc'},
      take:2
    })
    
    return {
      carros:cars.map(serializeCar),
      cursor:cars[cars.length-1].pricePerDay
    }
  }

  async categories() {
    const cars = await prisma.car.findMany({
      where: { available: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    })

    return cars.map((car) => car.category)
  }

  async getById(idOrSlug: string) {
    const car = await prisma.car.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    })

    if (!car) {
      throw new AppError('Veículo não encontrado', 404)
    }

    return serializeCar(car)
  }
}
