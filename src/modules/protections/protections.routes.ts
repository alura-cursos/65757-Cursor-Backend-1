import { Router } from 'express'
import { ProtectionsController } from './protections.controller.js'
import { validate } from '../../shared/middleware/validate.js'
import {
  createProtectionSchema,
  protectionIdParamsSchema,
  updateProtectionSchema,
} from './protections.schemas.js'

export const protectionsRoutes = Router()
const controller = new ProtectionsController()

protectionsRoutes.get('/', (req, res, next) =>
  controller.list(req, res).catch(next),
)

protectionsRoutes.get(
  '/:id',
  validate({ params: protectionIdParamsSchema }),
  (req, res, next) => controller.getById(req, res).catch(next),
)

protectionsRoutes.post(
  '/',
  validate({ body: createProtectionSchema }),
  (req, res, next) => controller.create(req, res).catch(next),
)

protectionsRoutes.put(
  '/:id',
  validate({ params: protectionIdParamsSchema, body: updateProtectionSchema }),
  (req, res, next) => controller.update(req, res).catch(next),
)

protectionsRoutes.delete(
  '/:id',
  validate({ params: protectionIdParamsSchema }),
  (req, res, next) => controller.delete(req, res).catch(next),
)
