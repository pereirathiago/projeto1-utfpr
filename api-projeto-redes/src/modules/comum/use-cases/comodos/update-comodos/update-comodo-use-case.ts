import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'
import { HttpResponse } from 'shared/helpers'
import { inject, injectable } from 'tsyringe'

interface IRequest {
  id: string
  nome: string
  userId: string
}

@injectable()
class UpdateComodosUseCase {
  constructor(@inject('ComodosRepository')
  private comodosRepository: IComodoRepository
  ) { }

  async execute({
    id,
    nome,
    userId,
  }: IRequest): Promise<HttpResponse> {
    const comodos = await this.comodosRepository.update({
      id,
      nome,
      userId,
    })
    
    return comodos
  }
}

export { UpdateComodosUseCase }

