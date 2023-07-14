/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { loginUser, registerUser, currentUser } from '../controllers/users'

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/current', currentUser)

export { router as usersRouter }
