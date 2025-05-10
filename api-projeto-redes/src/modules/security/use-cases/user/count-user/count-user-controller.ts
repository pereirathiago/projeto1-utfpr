import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountUserUseCase } from './count-user-use-case'

class CountUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const countUserUseCase = container.resolve(CountUserUseCase)

    const usersCount = await countUserUseCase.execute({
      search: search as string
    })

    return response.status(usersCount.statusCode).json(usersCount)
  }
}

export { CountUserController }
