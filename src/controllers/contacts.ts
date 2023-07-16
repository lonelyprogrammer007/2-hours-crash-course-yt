/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NextFunction, type Request, type Response } from 'express'
import { Contact } from '../models/mongoose-repository/contact'
import { getContactWithValidations } from '../utils/models'
import { validateBodyFieldsAfterCreation } from '../utils/mongoose/validators'
import { type RequestWithUser } from '../models/api/requestWithUser'

// TODO: assign correct type to the errors in the catch block

const getContacts: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as RequestWithUser).user!.id
    const contacts = await Contact.find({ user_id: userId })
    res.status(200).json(contacts)
  } catch (error: any) {
    next(error)
  }
}

const createContact: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name, email, phone } = req.body
    name = name ?? ''
    email = email ?? ''
    phone = phone ?? ''

    if (name === '' || email === '' || phone === '') {
      res.status(400)
      throw new Error('All fields are mandatory')
    }
    const userId = (req as RequestWithUser).user!.id
    const contact = await Contact.create({ name, email, phone, user_id: userId })
    res.status(201).json(contact)
  } catch (error: any) {
    next(error)
  }
}

const getContact: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await getContactWithValidations(req, res)
    res.status(200).json(contact)
  } catch (error: any) {
    next(error)
  }
}

const updateContact: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getContactWithValidations(req, res)
    validateBodyFieldsAfterCreation(req, res, Contact)

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedContact)
  } catch (error: any) {
    next(error)
  }
}

const deleteContact: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contact = await getContactWithValidations(req, res)
    await Contact.findByIdAndRemove(req.params.id)

    res.status(200).json(contact)
  } catch (error: any) {
    next(error)
  }
}

export { getContacts, createContact, getContact, updateContact, deleteContact }
