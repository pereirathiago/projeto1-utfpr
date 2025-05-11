import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { UpdateMedicoesUseCase } from './update-medicoes-use-case'

class UpdateMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      comodoId,
      dataHora,
      nivelSinal2_4ghz,
      nivelSinal5ghz,
      velocidade2_4ghz,
      velocidade5ghz,
      interferencia
    } = request.body

    const { id } = request.params
    const userId = request.user.id

    const updateMedicoesUseCase = container.resolve(UpdateMedicoesUseCase)

    const result = await updateMedicoesUseCase.execute({
      id,
      comodoId,
      userId,
      dataHora,
      nivelSinal2_4ghz,
      nivelSinal5ghz,
      velocidade2_4ghz,
      velocidade5ghz,
      interferencia
    })
      .then(medicoesResult => {
        return medicoesResult
      })
      .catch(error => {
        return error
      })

    return response.status(result.statusCode).json(result)
  }
}

export { UpdateMedicoesController }

