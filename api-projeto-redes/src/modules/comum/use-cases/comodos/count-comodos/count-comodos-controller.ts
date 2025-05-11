import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountComodosUseCase } from './count-comodos-use-case'

class CountComodosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const { id } = request.user

    const countComodosUseCase = container.resolve(CountComodosUseCase)

    const comodoCount = await countComodosUseCase.execute({
      search: search as string,
      filter: id
    })

    return response.status(comodoCount.statusCode).json(comodoCount)
  }
}

export { CountComodosController }
