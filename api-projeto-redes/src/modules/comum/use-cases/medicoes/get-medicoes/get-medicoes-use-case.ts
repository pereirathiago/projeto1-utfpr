import { inject, injectable } from 'tsyringe'
import { HttpResponse } from 'shared/helpers'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'

@injectable()
class GetMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
    private medicoesRepository: IMedicoesRepository
  ) {}

  async execute(id: string, userId: string): Promise<HttpResponse> {
    const medicoes = await this.medicoesRepository.get(id, userId)

    return medicoes
  }
}

export { GetMedicoesUseCase }
