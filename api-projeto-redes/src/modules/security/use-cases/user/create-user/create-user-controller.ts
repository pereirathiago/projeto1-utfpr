import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateUserUseCase } from './create-user-use-case'

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      email,
      password,
      avatar,
    } = request.body

    const createUserUseCase = container.resolve(CreateUserUseCase)

    const result = await createUserUseCase.execute({
        name,
        email,
        password,
        avatar,
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

export { CreateUserController }
