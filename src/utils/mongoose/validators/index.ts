/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Request, type Response } from 'express'
import type mongoose from 'mongoose'

const validateBodyFields: (req: Request,
  res: Response,
  model: mongoose.Model<any>) => void = (
  req: Request,
  res: Response,
  model: mongoose.Model<any>
) => {
  const bodyKeys = Object.keys(req.body)
  const modelFields = Object.keys(model.schema.paths)

  if (bodyKeys.includes('_id')) {
    res.status(400)
    throw new Error("Cannot update the '_id' field")
  }

  // Remove MongoDB's default _id and __v fields
  const indexId = modelFields.indexOf('_id')
  if (indexId > -1) modelFields.splice(indexId, 1)
  const indexV = modelFields.indexOf('__v')
  if (indexV > -1) modelFields.splice(indexV, 1)

  let validFieldFound = false
  for (const key of bodyKeys) {
    if (!modelFields.includes(key)) {
      res.status(400)
      throw new Error(`Invalid field: ${key}`)
    } else {
      validFieldFound = true
    }
  }

  if (!validFieldFound) {
    res.status(400)
    throw new Error('No valid fields provided')
  }
}

export { validateBodyFields }
