import { prisma } from '../../shared/lib/prisma.js'

export class LocationsService {
  async list() {
    return prisma.location.findMany({
      orderBy: { name: 'asc' },
    })
  }
}
