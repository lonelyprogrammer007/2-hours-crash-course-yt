import mongoose from 'mongoose'

const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, 'Please add the username']
      },
      email: {
        type: String,
        required: [true, 'Please add the user email address'],
        unique: [true, 'Email address already taken']
      },
      password: {
        type: String,
        required: [true, 'Please add the user password']
      }
    },
    { timestamps: true }
  )
)

export { User }
