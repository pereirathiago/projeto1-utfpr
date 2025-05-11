import { inject, injectable } from 'tsyringe'
import { HttpResponse } from 'shared/helpers'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'

interface IRequest {
  search: string,
  filter?: string
}

@injectable()
class CountComodosUseCase {
  constructor(@inject('ComodosRepository')
    private comodosRepository: IComodoRepository
  ) {}

  async execute({
    search,
    filter
  }: IRequest): Promise<HttpResponse> {
    const comodoCount = await this.comodosRepository.count(
      search,
      filter
    )

    return comodoCount
  }
}

export { CountComodosUseCase }
