/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { loginUser, registerUser, currentUser } from '../controllers/users'
import { validateToken } from '../middlewares/jwt/validateTokenHandler'

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/current', validateToken, currentUser)

export { router as usersRouter }
