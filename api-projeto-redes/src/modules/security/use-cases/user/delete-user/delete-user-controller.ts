import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteUserUseCase } from './delete-user-use-case'
import { ListUserUseCase } from '../list-user/list-user-use-case'

class DeleteUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    // delete record
    
    const id = request.params.id
    const deleteUserUseCase = container.resolve(DeleteUserUseCase)
    await deleteUserUseCase.execute(id)


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

export { DeleteUserController }
