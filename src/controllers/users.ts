/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NextFunction, type Request, type Response } from 'express'
import { User } from '../models/mongoose-repository/user'
import { decodeValue, encryptValue } from '../utils/crypto'
import { validateBodyFieldsAfterCreation } from '../utils/mongoose/validators'
import { validateEmail } from '../utils/regex'
import jwt from 'jsonwebtoken'
import { type RequestWithUser } from '../models/api/requestWithUser'

// TODO: assign correct type to the errors in the catch block

const registerUser: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
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

const loginUser: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password } = req.body
    email = email ?? ''
    password = password ?? ''
    if (email === '' || password === '') throw Error('All fields are mandatory')

    const user = await User.findOne({ email })
    if (user == null) {
      res.status(404)
      throw Error('User not found')
    }

    const decryptedPassword = decodeValue(user.password!)
    if (password !== decryptedPassword) {
      res.status(401)
      throw Error('Incorrect password')
    }

    const payload = { id: user.id, email: user.email, username: user.username }
    const secretKey = process.env.ACCESS_TOKEN_SECRET!
    const options = { expiresIn: '1h' }
    const accessToken = jwt.sign(payload, secretKey, options)

    res.status(200).json({
      message: 'User logged in successfully',
      token: accessToken
    })
  } catch (error: any) {
    next(error)
  }
}

const currentUser: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(((req as RequestWithUser)).user)
  } catch (error: any) {
    next(error)
  }
}

export { registerUser, loginUser, currentUser }
