import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateComodosUseCase } from './update-comodo-use-case'

class UpdateComodosController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      nome
    } = request.body

    const { id } = request.params
    const userId = request.user.id

    const updateComodosUseCase = container.resolve(UpdateComodosUseCase)

    const result = await updateComodosUseCase.execute({
      id,
      nome,
      userId
    })
      .then(comodosResult => {
        return comodosResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateComodosController }

