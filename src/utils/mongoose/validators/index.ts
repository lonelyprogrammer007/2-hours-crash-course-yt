import { Request, Response } from "express";
import mongoose from "mongoose";

const validateBodyFields = (
  req: Request,
  res: Response,
  model: mongoose.Model<any>
) => {
  const bodyKeys = Object.keys(req.body);
  const modelFields = Object.keys(model.schema.paths);

  // Remove MongoDB's default _id and __v fields
  const indexId = modelFields.indexOf("_id");
  if (indexId > -1) modelFields.splice(indexId, 1);
  const indexV = modelFields.indexOf("__v");
  if (indexV > -1) modelFields.splice(indexV, 1);

  for (let key of bodyKeys) {
    if (!modelFields.includes(key)) {
      res.status(400);
      throw new Error(`Invalid field: ${key}`);
    }
  }
};

export { validateBodyFields };
