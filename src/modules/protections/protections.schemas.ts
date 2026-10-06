import { z } from 'zod'

export const protectionIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const createProtectionSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug deve conter apenas letras minúsculas, números e hífens',
    ),
  name: z.string().min(1),
  pricePerDay: z.number().positive(),
  benefits: z.array(z.string().min(1)).min(1),
})

export const updateProtectionSchema = createProtectionSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Informe ao menos um campo para atualizar' },
)

export type CreateProtectionInput = z.infer<typeof createProtectionSchema>
export type UpdateProtectionInput = z.infer<typeof updateProtectionSchema>
