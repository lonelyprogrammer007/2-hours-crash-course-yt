import dotenv from 'dotenv'
import express, { type Express } from 'express'

import { connectDb } from './config/dbConnection'
import { errorHandler } from './middlewares/errors/errorHandler'
import { logErrorsHandler } from './middlewares/errors/logErrorsHandler'
import { contactsRouter } from './routes/contacts'
// import { usersRouter } from './routes/users'

dotenv.config()
const app: Express = express()
const port: string | number = process.env.PORT ?? 5000

app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/api/users', contactsRouter)

app.use(logErrorsHandler)
app.use(errorHandler)

const startServer = async (): Promise<void> => {
  try {
    await connectDb()
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  } catch (error) {
    console.log('Error connecting to the database', error)
    process.exit(1)
  }
}

void startServer()
