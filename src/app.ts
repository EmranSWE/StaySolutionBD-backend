/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { NextFunction } from 'connect'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import router from './app/routes'
const app: Application = express()
app.use(cors())
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser())
//Application use
app.use('/api/v1', router)

//Error

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send('Server is running perfectly!!!!!!')
})

//global error handler
app.use(globalErrorHandler)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Your entered Api Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

export default app
