import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteMedicoesUseCase } from './delete-medicoes-use-case'
import { ListMedicoesUseCase } from '../list-medicoes/list-medicoes-use-case'

class DeleteMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.params.id
    const deleteMedicoesUseCase = container.resolve(DeleteMedicoesUseCase)
    await deleteMedicoesUseCase.execute(id)

    const listMedicoesUseCase = container.resolve(ListMedicoesUseCase)
    const categoria = await listMedicoesUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(categoria)
  }
}

export { DeleteMedicoesController }
