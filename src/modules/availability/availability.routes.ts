import { Router } from 'express'
import { AvailabilityController } from './availability.controller.js'
import { validate } from '../../shared/middleware/validate.js'
import { availabilityQuerySchema } from './availability.schemas.js'

export const availabilityRoutes = Router()
const controller = new AvailabilityController()

availabilityRoutes.get(
  '/',
  validate({ query: availabilityQuerySchema }),
  (req, res, next) => controller.list(req, res).catch(next),
)
