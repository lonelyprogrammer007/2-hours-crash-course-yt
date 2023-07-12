import { NextFunction, Request, Response } from "express";
import { Contact } from "../models/mongoose/contact";
import { getContactWithValidations } from "../utils";

//TODO: assign correct type to the errors in the catch block

const getContacts = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error: any) {
    next(error);
  }
};

const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({ name, email, phone });
    res.status(201).json(contact);
  } catch (error: any) {
    next(error);
  }
};

const getContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await getContactWithValidations(req, res);
    res.status(200).json(contact);
  } catch (error: any) {
    next(error);
  }
};

const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getContactWithValidations(req, res);

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedContact);
  } catch (error: any) {
    next(error);
  }
};

const deleteContact = async (_: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ test: "deleteContact" });
  } catch (error: any) {
    next(error);
  }
};

export { getContacts, createContact, getContact, updateContact, deleteContact };