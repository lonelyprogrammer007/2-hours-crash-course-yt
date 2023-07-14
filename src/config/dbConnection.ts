import mongoose from 'mongoose'

const connectDb: () => Promise<void> = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGO_CONNECTION_STRING ?? ''
    )
    console.log('Database connected: ')
    console.log(connect.connection.host)
    console.log(connect.connection.name)
  } catch (error) {
    console.log('Failed to connect to database', error)
    process.exit(1)
  }
}

export { connectDb }
