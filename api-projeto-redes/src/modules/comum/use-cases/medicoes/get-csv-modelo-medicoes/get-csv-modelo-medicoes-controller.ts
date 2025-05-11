import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetMedicoesModeloUseCase } from './get-csv-modelo-medicoes-use-case';

class GetMedicoesCsvModelController {
  async handle(request: Request, response: Response): Promise<void> {
    const { format = 'csv' } = request.query
    const validFormats = ['csv', 'xlsx']

    if (!validFormats.includes(format as string)) {
      response.status(400).json({
        error: 'Formato inválido. Use "csv" ou "xlsx"'
      })
      return
    }

    const getMedicoesModelUseCase = container.resolve(GetMedicoesModeloUseCase)
    const { type, data } = await getMedicoesModelUseCase.execute(format as 'csv' | 'xlsx')

    if (type === 'xlsx') {
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      response.setHeader('Content-Disposition', 'attachment; filename=modelo-medicoes.xlsx')
      response.status(200).send(data)
    } else {
      response.setHeader('Content-Type', 'text/csv')
      response.setHeader('Content-Disposition', 'attachment; filename=modelo-medicoes.csv')
      response.status(200).send(data)
    }
  }
}

export { GetMedicoesCsvModelController };