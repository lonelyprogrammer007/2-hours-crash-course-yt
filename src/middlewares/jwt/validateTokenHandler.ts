/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { type RequestWithUser } from '../../models/api/requestWithUser'

const validateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization ?? ''
  if (authorizationHeader === '') {
    res.status(401).json({ message: 'Authorization header is missing' })
    return
  }

  const token = authorizationHeader.split('Bearer ')[1]
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
    if (typeof decodedToken !== 'string') {
      (req as RequestWithUser).user = decodedToken
    } else {
      res.status(401).json({ message: 'Invalid token' })
      return
    }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export { validateToken }
