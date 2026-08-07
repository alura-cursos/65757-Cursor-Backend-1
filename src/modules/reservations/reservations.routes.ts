import { Router } from 'express'
import { ReservationsController } from './reservations.controller.js'
import { ensureAuth } from '../../shared/middleware/ensure-auth.js'
import { validate } from '../../shared/middleware/validate.js'
import {
  createReservationSchema,
  quoteReservationSchema,
  reservationIdParamsSchema,
} from './reservations.schemas.js'

export const reservationsRoutes = Router()
const controller = new ReservationsController()

reservationsRoutes.post(
  '/quote',
  validate({ body: quoteReservationSchema }),
  (req, res, next) => controller.quote(req, res).catch(next),
)

reservationsRoutes.use(ensureAuth)

reservationsRoutes.get('/', (req, res, next) =>
  controller.list(req, res).catch(next),
)

reservationsRoutes.post(
  '/',
  validate({ body: createReservationSchema }),
  (req, res, next) => controller.create(req, res).catch(next),
)

reservationsRoutes.get(
  '/:id',
  validate({ params: reservationIdParamsSchema }),
  (req, res, next) => controller.getById(req, res).catch(next),
)

reservationsRoutes.patch(
  '/:id/cancel',
  validate({ params: reservationIdParamsSchema }),
  (req, res, next) => controller.cancel(req, res).catch(next),
)
