import { HttpResponse } from 'shared/helpers'
import { IMedicaoDTO } from '../dtos/i-medicao-dto'

interface IMedicoesRepository {
  create(data: IMedicaoDTO): Promise<HttpResponse>
  list(
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
    filter: string
  ): Promise<HttpResponse>
  count(search: string, filter: string): Promise<HttpResponse>
  get(id: string, userId: string): Promise<HttpResponse>
  update(data: IMedicaoDTO): Promise<HttpResponse>
  delete(id: string): Promise<HttpResponse>
  multiDelete(ids: string[]): Promise<HttpResponse>
}

export { IMedicoesRepository }
