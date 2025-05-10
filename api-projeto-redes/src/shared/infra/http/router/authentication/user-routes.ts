import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'
import { Router } from 'express'
import multer from 'multer'
import uploadConfig from 'config/upload'
import { CreateUserController } from '@modules/authentication/use-cases/create-user/create-user-controller'
import { ProfileUserController } from '@modules/authentication/use-cases/profile-user-use-case/profile-user-controller'

const usersRoutes = Router()

const createUserController = new CreateUserController()
const profileUserController = new ProfileUserController()

usersRoutes.post('/', createUserController.handle.bind(createUserController))
usersRoutes.get('/profile', ensureAuthenticated, profileUserController.handle.bind(profileUserController))

export { usersRoutes }
