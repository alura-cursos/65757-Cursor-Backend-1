import type {
  Car,
  Location,
  Protection,
  Reservation,
} from '@prisma/client'
import { serializeCar } from '../cars/cars.serializer.js'
import { serializeProtection } from '../protections/protections.serializer.js'

type ReservationWithRelations = Reservation & {
  car: Car
  pickupLocation: Location
  returnLocation: Location
  protection: Protection | null
}

export function serializeReservation(reservation: ReservationWithRelations) {
  return {
    id: reservation.id,
    code: reservation.code,
    status: reservation.status,
    pickupDate: reservation.pickupDate.toISOString().slice(0, 10),
    pickupTime: reservation.pickupTime,
    returnDate: reservation.returnDate.toISOString().slice(0, 10),
    returnTime: reservation.returnTime,
    days: reservation.days,
    carSubtotal: reservation.carSubtotal,
    protectionSubtotal: reservation.protectionSubtotal,
    totalPrice: reservation.totalPrice,
    car: serializeCar(reservation.car),
    pickupLocation: reservation.pickupLocation,
    returnLocation: reservation.returnLocation,
    protection: reservation.protection
      ? serializeProtection(reservation.protection)
      : null,
    createdAt: reservation.createdAt.toISOString(),
  }
}
