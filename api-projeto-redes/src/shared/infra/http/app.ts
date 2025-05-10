import 'express-async-errors'
import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { AppError } from '../../errors/app-error'
import { router } from './router'

const app = express()

app.use(express.json())

const allowedOrgins = '*'

const options: cors.CorsOptions = {
  origin: allowedOrgins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}

app.use(cors(options))

app.use(router)

app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: `Internal server error - ${err.message}`,
  })
})

export { app }