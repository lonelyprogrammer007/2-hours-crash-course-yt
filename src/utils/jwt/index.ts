/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Request, type Response } from 'express'
import { type Contact } from '../../models/contact'
import { type RequestWithUser } from '../../models/api/requestWithUser'

const validateContactPermission: (_: Contact, __: Request, ___: Response) => void = (contact, req, res) => {
  const userId = (req as RequestWithUser).user!.id
  if (contact.user_id !== userId) {
    res.status(403)
    throw new Error("User don't have permission on this resource")
  }
}

export { validateContactPermission }
