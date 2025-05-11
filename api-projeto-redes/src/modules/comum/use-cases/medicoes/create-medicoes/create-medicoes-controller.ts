import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateMedicoesUseCase } from './create-medicoes-use-case'

class CreateMedicaoController {
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

    const { id } = request.user

    const createComodoUseCase = container.resolve(CreateMedicoesUseCase)

    const result = await createComodoUseCase.execute({
      comodoId,
      dataHora,
      nivelSinal2_4ghz,
      nivelSinal5ghz,
      velocidade2_4ghz,
      velocidade5ghz,
      interferencia,
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

export { CreateMedicaoController }

