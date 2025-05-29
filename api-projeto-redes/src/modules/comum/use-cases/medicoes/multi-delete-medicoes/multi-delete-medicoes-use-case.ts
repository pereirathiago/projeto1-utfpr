import { inject, injectable } from 'tsyringe'
import { HttpResponse } from 'shared/helpers'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'

@injectable()
class MultiDeleteMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
    private medicoesRepository: IMedicoesRepository
  ) {}

  async execute(ids: string[], userId: string): Promise<HttpResponse> {
    const medicoes = await this.medicoesRepository.multiDelete(ids, userId)

    return medicoes
  }
}

export { MultiDeleteMedicoesUseCase }
