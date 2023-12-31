import mongoose from 'mongoose'

const Contact = mongoose.model(
  'Contact',
  new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user missing'],
        ref: 'User'
      },
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
