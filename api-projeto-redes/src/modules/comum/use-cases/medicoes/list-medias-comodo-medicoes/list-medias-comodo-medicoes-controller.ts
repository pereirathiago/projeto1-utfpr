import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListMediaComodosMedicoesUseCase } from './list-medias-comodo-medicoes-use-case'

class ListMediasComodoMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user 

    const listMediasMedicoesUseCase = container.resolve(ListMediaComodosMedicoesUseCase)
    const medias = await listMediasMedicoesUseCase.execute(id)

    return response.json(medias)
  }
}

export { ListMediasComodoMedicoesController }
