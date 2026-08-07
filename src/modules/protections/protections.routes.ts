import { Router } from 'express'
import { ProtectionsController } from './protections.controller.js'

export const protectionsRoutes = Router()
const controller = new ProtectionsController()

protectionsRoutes.get('/', (req, res, next) =>
  controller.list(req, res).catch(next),
)
