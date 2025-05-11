import { inject, injectable } from 'tsyringe'
import { HttpResponse } from 'shared/helpers'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'

@injectable()
class DeleteMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
    private medicoesRepository: IMedicoesRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const medicoes = await this.medicoesRepository.delete(id)

    return medicoes
  }
}

export { DeleteMedicoesUseCase }
