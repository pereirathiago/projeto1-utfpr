import { Comodo } from '@modules/comum/infra/typeorm/entities/comodo'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'
import { inject, injectable } from 'tsyringe'

interface IRequest {
  nome: string
  userId: string
}

@injectable()
class CreateComodoUseCase {
  constructor(@inject('ComodosRepository')
  private comodosRepository: IComodoRepository
  ) { }

  async execute({
    nome,
    userId,
  }: IRequest): Promise<Comodo> {
    const result = await this.comodosRepository.create({
      nome,
      userId
    })
      .then(comodoResult => {
        return comodoResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateComodoUseCase }

