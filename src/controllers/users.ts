import { type NextFunction, type Request, type Response } from 'express'
import { User } from '../models/mongoose-repository/user'
import { encryptValue } from '../utils/crypto'
import { validateBodyFieldsAfterCreation } from '../utils/mongoose/validators'
import { validateEmail } from '../utils/regex'

// TODO: assign correct type to the errors in the catch block

const registerUser: (req: Request, res: Response, next: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateBodyFieldsAfterCreation(req, res, User)

    let { username, email, password } = req.body
    username = username ?? ''
    email = email ?? ''
    password = password ?? ''

    if (username === '' || email === '' || password === '') {
      res.status(400)
      throw new Error('All fields are mandatory')
    }

    if (!validateEmail(email)) {
      res.status(400)
      throw new Error('Invalid email address')
    }

    if ((username as string).length < 8) {
      res.status(400)
      throw new Error('Invalid username')
    }

    const userAvailable = await User.findOne({ email })
    if (userAvailable != null) {
      res.status(400)
      throw new Error('User already registered!')
    } else {
      const encryptedPassword = encryptValue(password)
      const user = await User.create({ username, email, password: encryptedPassword })
      res.status(201).json({ _id: user.id, email: user.email })
    }
  } catch (error: any) {
    next(error)
  }
}

const loginUser: (_: Request, res: Response, next: NextFunction) => Promise<void> = async (_: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'login' })
  } catch (error: any) {
    next(error)
  }
}

const currentUser: (_: Request, res: Response, next: NextFunction) => Promise<void> = async (_: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'current' })
  } catch (error: any) {
    next(error)
  }
}

export { registerUser, loginUser, currentUser }
