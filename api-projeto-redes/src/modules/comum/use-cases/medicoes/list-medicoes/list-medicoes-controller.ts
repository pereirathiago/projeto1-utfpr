import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListMedicoesUseCase } from './list-medicoes-use-case'

class ListMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order
    } = request.body

    const { id } = request.user 

    const listMedicoesUseCase = container.resolve(ListMedicoesUseCase)

    const medicoes = await listMedicoesUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: id as string
    })

    return response.json(medicoes)
  }
}

export { ListMedicoesController }
