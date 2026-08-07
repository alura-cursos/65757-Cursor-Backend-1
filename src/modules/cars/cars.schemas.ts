import { z } from 'zod'

export const listCarsQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
})

export const carIdParamsSchema = z.object({
  id: z.string().min(1),
})

export type ListCarsQuery = z.infer<typeof listCarsQuerySchema>
