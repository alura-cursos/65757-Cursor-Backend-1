import { Router } from 'express'
import { authRoutes } from './modules/auth/auth.routes.js'
import { availabilityRoutes } from './modules/availability/availability.routes.js'
import { carsRoutes } from './modules/cars/cars.routes.js'
import { locationsRoutes } from './modules/locations/locations.routes.js'
import { protectionsRoutes } from './modules/protections/protections.routes.js'
import { reservationsRoutes } from './modules/reservations/reservations.routes.js'

export const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/cars', carsRoutes)
routes.use('/availability', availabilityRoutes)
routes.use('/locations', locationsRoutes)
routes.use('/protections', protectionsRoutes)
routes.use('/reservations', reservationsRoutes)
