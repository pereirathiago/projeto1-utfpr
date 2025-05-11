import { HttpResponse } from 'shared/helpers'
import { IComodoDTO } from '../dtos/i-comodo-dto'

interface IComodoRepository {
  create(data: IComodoDTO): Promise<HttpResponse>
  list(
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
    filter: string
  ): Promise<HttpResponse>
  select(filter: string, userId: string): Promise<HttpResponse>
  idSelect(id: string, userId: string): Promise<HttpResponse>
  count(search: string, filter: string): Promise<HttpResponse>
  get(id: string, userId: string): Promise<HttpResponse>
  findByName(name: string, userId: string): Promise<HttpResponse>
  update(data: IComodoDTO): Promise<HttpResponse>
  delete(id: string): Promise<HttpResponse>
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IComodoRepository }
