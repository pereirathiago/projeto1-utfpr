import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListComodosUseCase } from './list-comodos-use-case'

class ListComodosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order
    } = request.body

    const { id } = request.user 

    const listComodosUseCase = container.resolve(ListComodosUseCase)

    const comodo = await listComodosUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: id as string
    })

    return response.json(comodo)
  }
}

export { ListComodosController }
