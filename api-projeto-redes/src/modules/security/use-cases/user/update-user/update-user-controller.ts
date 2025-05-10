import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateUserUseCase } from './update-user-use-case'

class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      userGroupId,
      name,
      login,
      password,
      isAdmin,
      isSuperUser,
      isBlocked,
      blockReasonId,
      mustChangePasswordNextLogon,
      mustActiveTwoFactorAuthentication,
      avatar,
      disabled
    } = request.body

    const { id } = request.params

    const updateUserUseCase = container.resolve(UpdateUserUseCase)

    const result = await updateUserUseCase.execute({
        id,
        userGroupId,
        name,
        login,
        password,
        isAdmin,
        isSuperUser,
        isBlocked,
        blockReasonId,
        mustChangePasswordNextLogon,
        mustActiveTwoFactorAuthentication,
        avatar,
        isDisabled: disabled
      })
      .then(userResult => {
        return userResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateUserController }
