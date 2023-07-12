import { Request, Response, NextFunction } from 'express'

const logErrorsHandler = (
  err: Error,
  _: Request,
  __: Response,
  next: NextFunction
) => {
  console.log(err.stack)
  next(err)
}

export { logErrorsHandler }
