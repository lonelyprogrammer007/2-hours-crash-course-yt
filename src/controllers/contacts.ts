/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NextFunction, type Request, type Response } from 'express'
import { type RequestWithUser } from '../models/api/requestWithUser'
import { Contact as ContactRepo } from '../models/mongoose-repository/contact'
import { validateContactPermission } from '../utils/jwt'
import { getContactWithValidations } from '../utils/models'
import { validateBodyFieldsAfterCreation } from '../utils/mongoose/validators'

const getContacts: (_: Request, __: Response, ___: NextFunction) => Promise<void> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as RequestWithUser).user!.id
    const contacts = await ContactRepo.find({ user_id: userId })
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
    const contact = await ContactRepo.create({ name, email, phone, user_id: userId })
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
    const contact = await getContactWithValidations(req, res)
    validateBodyFieldsAfterCreation(req, res, ContactRepo)

    validateContactPermission(contact, req, res)

    const updatedContact = await ContactRepo.findByIdAndUpdate(
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

    validateContactPermission(contact, req, res)

    await ContactRepo.deleteOne({ _id: req.params.id })

    res.status(200).json(contact)
  } catch (error: any) {
    next(error)
  }
}

export { getContacts, createContact, getContact, updateContact, deleteContact }
