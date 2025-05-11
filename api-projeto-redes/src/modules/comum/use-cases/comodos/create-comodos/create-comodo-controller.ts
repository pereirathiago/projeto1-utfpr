import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateComodoUseCase } from './create-comodo-use-case'

class CreateComodoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome
    } = request.body

    const { id } = request.user

    const createComodoUseCase = container.resolve(CreateComodoUseCase)

    const result = await createComodoUseCase.execute({
      nome,
      userId: id
    })
      .then(categoriasResult => {
        return categoriasResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { CreateComodoController }

