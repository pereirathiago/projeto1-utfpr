import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetMedicoesUseCase } from './get-medicoes-use-case'

class GetMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const userId = request.user.id
    const getMedicoesUseCase = container.resolve(GetMedicoesUseCase)
    const medicoes = await getMedicoesUseCase.execute(id, userId)

    return response.status(medicoes.statusCode).json(medicoes.data)
  }
}

export { GetMedicoesController }
