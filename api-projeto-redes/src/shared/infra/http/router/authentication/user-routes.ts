import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'
import { Router } from 'express'
import multer from 'multer'
import uploadConfig from 'config/upload'
import { CreateUserController } from '@modules/authentication/use-cases/create-user/create-user-controller'
import { ProfileUserController } from '@modules/authentication/use-cases/profile-user-use-case/profile-user-controller'
import { UpdateUserAvatarController } from '@modules/authentication/use-cases/update-user-avatar/update-user-avatar-controller'
import { UpdateUserController } from '@modules/authentication/use-cases/update-user/update-user-controller'

const usersRoutes = Router()

const uploadAvatar = multer(uploadConfig)
const createUserController = new CreateUserController()
const updateUserController = new UpdateUserController()
const updateUserAvatarController = new UpdateUserAvatarController()
const profileUserController = new ProfileUserController()

usersRoutes.post('/', createUserController.handle.bind(createUserController))
usersRoutes.put('/', ensureAuthenticated, updateUserController.handle.bind(updateUserController))
usersRoutes.patch('/avatar', ensureAuthenticated, uploadAvatar.single('avatar'), updateUserAvatarController.handle.bind(updateUserAvatarController))
usersRoutes.get('/profile', ensureAuthenticated, profileUserController.handle.bind(profileUserController))

export { usersRoutes }
