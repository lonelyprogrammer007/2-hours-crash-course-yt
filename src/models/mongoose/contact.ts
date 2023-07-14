import mongoose from 'mongoose'

const Contact = mongoose.model(
  'Contact',
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Please add the contact name']
      },
      email: {
        type: String,
        required: [true, 'Please add the contact email address']
      },
      phone: {
        type: String,
        required: [true, 'Please add the contact phone number']
      }
    },
    { timestamps: true }
  )
)

export { Contact }
