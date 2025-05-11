import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { SelectComodosUseCase } from './select-comodos-use-case'

class SelectComodosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filter } = request.query
    const { id } = request.user

    const selectComodosUseCase = container.resolve(SelectComodosUseCase)

    const comodo = await selectComodosUseCase.execute({
      filter: filter as string,
      userId: id
    })

    return response.json(comodo)
  }
}

export { SelectComodosController }
