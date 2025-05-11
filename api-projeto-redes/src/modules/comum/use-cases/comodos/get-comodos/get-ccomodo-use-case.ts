import { inject, injectable } from 'tsyringe'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'
import { HttpResponse } from 'shared/helpers'

@injectable()
class GetComodosUseCase {
  constructor(@inject('ComodosRepository')
    private comodosRepository: IComodoRepository
  ) {}

  async execute(id: string, userId: string): Promise<HttpResponse> {
    const comodos = await this.comodosRepository.get(id, userId)

    return comodos
  }
}

export { GetComodosUseCase }
