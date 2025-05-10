import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListUserUseCase } from './list-user-use-case'

class ListUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { 
      search,
      page,
      pageSize,
      order,
      filter
    } = request.body

    const listUserUseCase = container.resolve(ListUserUseCase)

    const users = await listUserUseCase.execute({
      search: search as string,
      page: Number(page) as number,
      rowsPerPage: Number(pageSize) as number,
      order: order as string,
      filter: filter as string
    })

    return response.json(users)
  }
}

export { ListUserController }
