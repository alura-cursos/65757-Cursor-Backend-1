import type { Car } from '@prisma/client'

export function serializeCar(car: Car) {
  return {
    id: car.id,
    slug: car.slug,
    name: car.name,
    category: car.category,
    description: car.description,
    pricePerDay: car.pricePerDay,
    image: car.imageUrl,
    images: JSON.parse(car.images) as string[],
    features: JSON.parse(car.features) as string[],
    seats: car.seats,
    bags: car.bags,
    transmission: car.transmission,
    available: car.available,
  }
}
