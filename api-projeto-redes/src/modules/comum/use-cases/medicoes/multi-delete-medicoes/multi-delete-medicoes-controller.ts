import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteMedicoesUseCase } from './multi-delete-medicoes-use-case'
import { ListMedicoesUseCase } from '../list-medicoes/list-medicoes-use-case'

class MultiDeleteMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { ids } = request.body
    const { id } = request.user 

    const multiDeleteMedicoesUseCase = container.resolve(MultiDeleteMedicoesUseCase)
    await multiDeleteMedicoesUseCase.execute(ids, id)

    const listMedicoesUseCase = container.resolve(ListMedicoesUseCase)
    const categoria = await listMedicoesUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: '',
      filter: id as string
    })

    return response.json(categoria)
  }
}

export { MultiDeleteMedicoesController }
