import { Request, Response } from "express";
import mongoose from "mongoose";
import { Contact } from "../models/mongoose/contact";

const getContactWithValidations = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("missed URL param");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }

  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
};

export { getContactWithValidations };
