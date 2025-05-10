import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { MultiDeleteUserUseCase } from './multi-delete-user-use-case'
import { ListUserUseCase } from '../list-user/list-user-use-case'

class MultiDeleteUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete multi record

    const ids = request.body
    const multiDeleteUserUseCase = container.resolve(MultiDeleteUserUseCase)
    await multiDeleteUserUseCase.execute(ids)


    // restore list with updated records

    const listUserUseCase = container.resolve(ListUserUseCase)
    const users = await listUserUseCase.execute({
      search: '',
      page: 0,
      rowsPerPage: 100,
      order: ''
    })

    return response.json(users)
  }
}

export { MultiDeleteUserController }
