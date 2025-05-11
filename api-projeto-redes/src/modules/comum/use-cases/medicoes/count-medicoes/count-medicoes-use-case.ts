import { inject, injectable } from 'tsyringe'
import { HttpResponse } from 'shared/helpers'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
    private medicoesRepository: IMedicoesRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const medicoesCount = await this.medicoesRepository.count(
      search,
      filter
    )

    return medicoesCount
  }
}

export { CountMedicoesUseCase }
