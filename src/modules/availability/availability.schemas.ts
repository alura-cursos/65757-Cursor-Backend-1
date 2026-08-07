import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const availabilityQuerySchema = z.object({
  pickupLocationId: z.string().min(1),
  returnLocationId: z.string().min(1),
  pickupDate: z.string().regex(dateRegex, 'Use o formato YYYY-MM-DD'),
  returnDate: z.string().regex(dateRegex, 'Use o formato YYYY-MM-DD'),
  category: z.string().optional(),
  q: z.string().optional(),
})

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>
