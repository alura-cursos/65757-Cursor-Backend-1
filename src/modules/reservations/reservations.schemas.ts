import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const timeRegex = /^\d{2}:\d{2}$/

export const createReservationSchema = z.object({
  carId: z.string().min(1),
  pickupLocationId: z.string().min(1),
  returnLocationId: z.string().min(1),
  pickupDate: z.string().regex(dateRegex, 'Use o formato YYYY-MM-DD'),
  pickupTime: z.string().regex(timeRegex, 'Use o formato HH:mm'),
  returnDate: z.string().regex(dateRegex, 'Use o formato YYYY-MM-DD'),
  returnTime: z.string().regex(timeRegex, 'Use o formato HH:mm'),
  protectionId: z.string().optional().nullable(),
})

export const reservationIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const quoteReservationSchema = createReservationSchema

export type CreateReservationInput = z.infer<typeof createReservationSchema>
