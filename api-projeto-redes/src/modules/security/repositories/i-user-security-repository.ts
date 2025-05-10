import { IUserDTO } from '@modules/security/dtos/i-user-dto'
import { HttpResponse } from 'shared/helpers'

interface IUserSecurityRepository {
  // create
  create (data: IUserDTO): Promise<HttpResponse> 


  // list
  list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
  ): Promise<HttpResponse>


  // select
  select (
    filter: string,
  ): Promise<HttpResponse>


  // id select
  idSelect (id: string): Promise<HttpResponse>


  // count
  count (search: string): Promise<HttpResponse>


  // get
  get (id: string): Promise<HttpResponse>


  // update
  update (data: IUserDTO): Promise<HttpResponse>
  
  // delete
  delete (id: string): Promise<HttpResponse>


  // multi delete
  multiDelete (ids: string[]): Promise<HttpResponse> 
}

export { IUserSecurityRepository }
