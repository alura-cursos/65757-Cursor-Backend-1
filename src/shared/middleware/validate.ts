import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

type Schemas = {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body)
    }

    // Express 5: query e params são somente leitura — só validamos
    if (schemas.query) {
      schemas.query.parse(req.query)
    }

    if (schemas.params) {
      schemas.params.parse(req.params)
    }

    next()
  }
}
