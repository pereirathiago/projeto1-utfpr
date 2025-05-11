import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetMedicoesModeloUseCase } from './get-xlsx-modelo-medicoes-use-case';

class GetMedicoesModelController {
  async handle(request: Request, response: Response): Promise<void> {
    const { format } = request.query
    const validFormats = ['xlsx']

    if (!validFormats.includes(format as string)) {
      response.status(400).json({
        error: 'Formato inválido. Use "xlsx"'
      })
      return
    }

    const getMedicoesModelUseCase = container.resolve(GetMedicoesModeloUseCase)
    const { type, data } = await getMedicoesModelUseCase.execute(format as 'xlsx')

    if (type === 'xlsx') {
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      response.setHeader('Content-Disposition', 'attachment; filename=modelo-medicoes.xlsx')
      response.status(200).send(data)
    } 
  }
}

export { GetMedicoesModelController };