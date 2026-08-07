import { Router } from 'express'
import { CarsController } from './cars.controller.js'
import { validate } from '../../shared/middleware/validate.js'
import { carIdParamsSchema, listCarsQuerySchema } from './cars.schemas.js'

export const carsRoutes = Router()
const controller = new CarsController()

carsRoutes.get('/', validate({ query: listCarsQuerySchema }), (req, res, next) =>
  controller.list(req, res).catch(next),
)

carsRoutes.get('/categories', (req, res, next) =>
  controller.categories(req, res).catch(next),
)

carsRoutes.get('/:id', validate({ params: carIdParamsSchema }), (req, res, next) =>
  controller.getById(req, res).catch(next),
)
