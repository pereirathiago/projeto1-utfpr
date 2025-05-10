import { Router } from 'express'
import multer from 'multer'
import uploadConfig from 'config/upload'
import { CreateUserController } from '@modules/authentication/use-cases/create-user/create-user-controller'

const usersRoutes = Router()

const createUserController = new CreateUserController()

usersRoutes.post('/', createUserController.handle.bind(createUserController))

export { usersRoutes }
