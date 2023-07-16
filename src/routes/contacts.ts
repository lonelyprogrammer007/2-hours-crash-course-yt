
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact
} from '../controllers/contacts'
import { validateToken } from '../middlewares/jwt/validateTokenHandler'

const router = express.Router()

router.use(validateToken)

router.route('/').get(getContacts).post(createContact)

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact)

export { router as contactsRouter }
