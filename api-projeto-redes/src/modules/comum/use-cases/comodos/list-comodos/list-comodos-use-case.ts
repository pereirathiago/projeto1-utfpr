import { IComodoDTO } from '@modules/comum/dtos/i-comodo-dto';
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository';
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
  items: IComodoDTO[],
  hasNext: boolean
}

@injectable()
class ListComodosUseCase {
  constructor(@inject('ComodosRepository')
  private comodosRepository: IComodoRepository
  ) { }

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page !== 0 ? page - 1 : 0

    const comodo = await this.comodosRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
      filter
    )

    const countComodo = await this.comodosRepository.count(
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

export { ListComodosUseCase };
