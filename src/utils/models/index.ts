import { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import { Contact } from '../../models/mongoose-repository/contact'

const getContactWithValidations: (req: Request, res: Response) => Promise<unknown> = async (req: Request, res: Response) => {
  const id = req.params.id ?? ''
  if (id === '') {
    res.status(400)
    throw new Error('missed URL param')
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid id')
  }

  const contact = await Contact.findById(id)
  if (contact == null) {
    res.status(404)
    throw new Error('Contact not found')
  } else {
    return contact
  }
}

export { getContactWithValidations }
