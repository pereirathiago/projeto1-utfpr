import 'reflect-metadata'
import 'dotenv/config'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import 'shared/container'
import initializeDatabase from '../typeorm'
import { AppError } from '../../errors/app-error'
import { router } from './router'

initializeDatabase()
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