import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CountMedicoesUseCase } from './count-medicoes-use-case'

class CountMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search
    } = request.body

    const { id } = request.user

    const countMedicoesUseCase = container.resolve(CountMedicoesUseCase)

    const medicoesCount = await countMedicoesUseCase.execute({
      search: search as string,
      filter: id
    })

    return response.status(medicoesCount.statusCode).json(medicoesCount)
  }
}

export { CountMedicoesController }
