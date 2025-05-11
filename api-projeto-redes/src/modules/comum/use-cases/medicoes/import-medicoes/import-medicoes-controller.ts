import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ImportMedicoesUseCase } from './import-medicoes-use-case'

class ImportMedicoesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request
    const { id: userId } = request.user

    const importMedicoesUseCase = container.resolve(ImportMedicoesUseCase)
    const result = await importMedicoesUseCase.execute({ userId, file })

    return response.status(result.statusCode).json(result.data)
  }
}

export { ImportMedicoesController }