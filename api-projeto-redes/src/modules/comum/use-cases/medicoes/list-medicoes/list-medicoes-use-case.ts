import { IMedicaoDTO } from '@modules/comum/dtos/i-medicao-dto';
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository';
import { request } from 'http';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IMedicaoDTO[],
  hasNext: boolean
}

@injectable()
class ListMedicoesUseCase {
  constructor(@inject('MedicoesRepository')
  private medicoesRepository: IMedicoesRepository
  ) { }

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const comodo = await this.medicoesRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countComodo = await this.medicoesRepository.count(
      search,
      filter
    )

    const numeroComodos = page * rowsPerPage

    const comodoResponse = {
      items: comodo.data,
      hasNext: numeroComodos < countComodo.data.count
    }

    return comodoResponse
  }
}

export { ListMedicoesUseCase };
