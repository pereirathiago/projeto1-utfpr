import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'
import { HttpResponse } from 'shared/helpers'
import { inject, injectable } from 'tsyringe'

interface IRequest {
  id: string
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
class UpdateMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
  private medicoesRepository: IMedicoesRepository
  ) { }

  async execute({
    id,
    comodoId,
    userId,
    dataHora,
    nivelSinal2_4ghz,
    nivelSinal5ghz,
    velocidade2_4ghz,
    velocidade5ghz,
    interferencia
  }: IRequest): Promise<HttpResponse> {
    const medicao = await this.medicoesRepository.update({
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
    
    return medicao
  }
}

export { UpdateMedicoesUseCase }

