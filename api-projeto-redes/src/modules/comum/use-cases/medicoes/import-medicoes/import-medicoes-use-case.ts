import { inject, injectable } from 'tsyringe'
import ExcelJS from 'exceljs'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'
import { Medicao } from '@modules/comum/infra/typeorm/entities/medicao'
import {
  badRequest,
  conflictError,
  HttpResponse,
  notFound,
  ok,
  serverError
} from 'shared/helpers'
import { AppError } from 'shared/errors/app-error'

interface IRequest {
  userId: string
  file: Express.Multer.File
}

@injectable()
class ImportMedicoesUseCase {
  constructor(
    @inject('ComodosRepository')
    private comodosRepository: IComodoRepository,
    @inject('MedicoesRepository')
    private medicoesRepository: IMedicoesRepository
  ) { }

  private async processXLSX(file: Express.Multer.File, userId: string): Promise<HttpResponse> {
    try {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(file.buffer)
      const worksheet = workbook.worksheets[0]
      const medicoes: Medicao[] = []

      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i)
        const comodoNome = row.getCell(1).value?.toString().trim().toUpperCase()

        if (!comodoNome) continue
        let comodo = await this.comodosRepository.findByName(comodoNome, userId)

        if (comodo.statusCode !== 200) {
          const criado = await this.comodosRepository.create({
            nome: comodoNome.charAt(0).toUpperCase() + comodoNome.slice(1).toLowerCase(),
            userId
          })

          comodo = criado
        }

        medicoes.push({
          comodoId: comodo.data.id,
          userId,
          dataHora: new Date(row.getCell(2).value?.toString() || new Date()),
          nivelSinal2_4ghz: Number(row.getCell(3).value),
          nivelSinal5ghz: Number(row.getCell(4).value),
          velocidade2_4ghz: Number(row.getCell(5).value),
          velocidade5ghz: Number(row.getCell(6).value),
          interferencia: Number(row.getCell(7).value)
        } as Medicao)
      }

      return ok(medicoes)
    } catch (error) {
      return serverError(error)
    }
  }

  async execute({ userId, file }: IRequest): Promise<HttpResponse> {
    try {
      if (!file) {
        return badRequest(new Error('Nenhum arquivo enviado'))
      }

      const isXLSX = file.mimetype.includes('spreadsheetml')

      if (!isXLSX) {
        return badRequest(new Error('Formato de arquivo inválido. Use XLSX'))
      }

      const processed = await this.processXLSX(file, userId)

      if (processed.statusCode !== 200) {
        return processed
      }

      const created = await this.medicoesRepository.bulkCreate(processed.data)
      return ok(created)
    } catch (error) {
      if (error instanceof AppError && error.message.includes('já existe')) {
        return conflictError('Medição')
      }
      return serverError(error)
    }
  }
}

export { ImportMedicoesUseCase }