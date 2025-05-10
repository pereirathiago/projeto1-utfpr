import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IdSelectUserUseCase } from './id-select-user-use-case'

class IdSelectUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const idSelectUserUseCase = container.resolve(IdSelectUserUseCase)

    const user = await idSelectUserUseCase.execute({
      id: id as string
    })

    return response.json(user.data)
  }
}

export { IdSelectUserController }
