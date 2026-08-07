import type { Protection } from '@prisma/client'

export function serializeProtection(protection: Protection) {
  return {
    id: protection.id,
    slug: protection.slug,
    name: protection.name,
    pricePerDay: protection.pricePerDay,
    benefits: JSON.parse(protection.benefits) as string[],
  }
}
