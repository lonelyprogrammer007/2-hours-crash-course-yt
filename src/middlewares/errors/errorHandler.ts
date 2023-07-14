import { type Request, type Response, type NextFunction } from 'express'
import { HTTP } from '../../constants'

const HTTPStatuses: Record<string, number> = HTTP

const errorHandler: (err: Error,
  _: Request,
  res: Response,
  next: NextFunction) => void = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(err); return
  }

  const statusCode = res.statusCode ?? 500

  let errorName = 'Unknown Error'
  for (const key in HTTPStatuses) {
    if (HTTPStatuses[key] === statusCode) {
      errorName = key
      break
    }
  }

  res.status(statusCode).json({
    errorName,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stackTrace: err.stack })
  })
}

export { errorHandler }
