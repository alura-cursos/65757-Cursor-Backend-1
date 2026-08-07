import { Router } from 'express'
import { LocationsController } from './locations.controller.js'

export const locationsRoutes = Router()
const controller = new LocationsController()

locationsRoutes.get('/', (req, res, next) =>
  controller.list(req, res).catch(next),
)
