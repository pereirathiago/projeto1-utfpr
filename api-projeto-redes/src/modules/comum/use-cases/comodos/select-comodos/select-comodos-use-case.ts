import { inject, injectable } from 'tsyringe'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

@injectable()
class SelectComodosUseCase {
  constructor(@inject('ComodosRepository')
    private comodosRepository: IComodoRepository
  ) {}

  async execute({
    filter,
    userId
  }): Promise<ResponseProps> {
    const comodo = await this.comodosRepository.select(filter, userId)

    const newComodo = {
      items: comodo.data,
      hasNext: false
    }

    return newComodo
  }
}

export { SelectComodosUseCase }
