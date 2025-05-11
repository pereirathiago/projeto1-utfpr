import { Medicao } from '@modules/comum/infra/typeorm/entities/medicao'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'
import { inject, injectable } from 'tsyringe'

interface IRequest {
  userId: string
  comodoId: string
  dataHora: Date
  nivelSinal2_4ghz: number
  nivelSinal5ghz: number
  velocidade2_4ghz: number
  velocidade5ghz: number
  interferencia: number
}

@injectable()
class CreateMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
  private medicoesRepository: IMedicoesRepository
  ) { }

  async execute({
    comodoId,
    userId,
    dataHora,
    nivelSinal2_4ghz,
    nivelSinal5ghz,
    velocidade2_4ghz,
    velocidade5ghz,
    interferencia
  }: IRequest): Promise<Medicao> {
    const result = await this.medicoesRepository.create({
      comodoId,
      userId,
      dataHora,
      nivelSinal2_4ghz,
      nivelSinal5ghz,
      velocidade2_4ghz,
      velocidade5ghz,
      interferencia
    })
      .then(medicaoResult => {
        return medicaoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateMedicoesUseCase }

