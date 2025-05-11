import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetComodosUseCase } from './get-ccomodo-use-case'

class GetComodosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const userId = request.user.id
    const getComodosUseCase = container.resolve(GetComodosUseCase)
    const comodos = await getComodosUseCase.execute(id, userId)

    return response.status(comodos.statusCode).json(comodos.data)
  }
}

export { GetComodosController }
