/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Request, type Response } from 'express'
import mongoose from 'mongoose'
import { Contact as ContactRepo } from '../../models/mongoose-repository/contact'
import { type Contact } from '../../models/contact'

const getContactWithValidations: (req: Request, res: Response) => Promise<Contact> = async (req: Request, res: Response) => {
  const id = req.params.id ?? ''
  if (id === '') {
    res.status(400)
    throw new Error('missed URL param')
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid id')
  }

  const contact = await ContactRepo.findById(id)
  if (contact == null) {
    res.status(404)
    throw new Error('Contact not found')
  } else {
    const formattedContact: Contact = {
      id: contact._id.toString(),
      name: contact.name!,
      email: contact.email!,
      phone: contact.phone!,
      user_id: contact.user_id!.toString()
    }

    return formattedContact
  }
}

export { getContactWithValidations }
