import { prisma } from '../../shared/lib/prisma.js'
import { serializeProtection } from './protections.serializer.js'

export class ProtectionsService {
  async list() {
    const protections = await prisma.protection.findMany({
      orderBy: { pricePerDay: 'asc' },
    })

    return protections.map(serializeProtection)
  }
}
