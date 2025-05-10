import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectUserUseCase } from './select-user-use-case'

class SelectUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query

    const selectUserUseCase = container.resolve(SelectUserUseCase)

    const users = await selectUserUseCase.execute({
      filter: filter as string
    })

    return response.json(users)
  }
}

export { SelectUserController }
