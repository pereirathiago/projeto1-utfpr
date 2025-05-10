import { CreateUserUseCase } from '@modules/security/use-cases/user/create-user/create-user-use-case'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body

    const createUserUseCase = container.resolve(CreateUserUseCase)

    const userResponse = await createUserUseCase.execute({
      name,
      email,
      password,
    })

    return response.status(userResponse.statusCode).json(userResponse)
  }
}

export { CreateUserController }
