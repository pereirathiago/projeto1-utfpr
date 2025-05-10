import { inject, injectable } from 'tsyringe'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { IUserDTO } from '@modules/security/dtos/i-user-dto';

interface IRequest {
  search: string,
  page: number,
  rowsPerPage: number,
  order: string,
  filter?: string
}

interface ResponseProps {
  items: IUserDTO[],
  hasNext: boolean
}

@injectable()
class ListUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute({
    search = '',
    page = 0,
    rowsPerPage = 50,
    order = '',
    filter
  }: IRequest): Promise<ResponseProps> {
    const newPage = page - 1

    const users = await this.userSecurityRepository.list(
      search,
      newPage,
      rowsPerPage,
      order,
    )

    const countUsers = await this.userSecurityRepository.count(
      search,
    )

    const numeroUser = page * rowsPerPage

    const usersResponse = {
      items: users.data,
      hasNext: numeroUser < countUsers.data.count
    }

    return usersResponse
  }
}

export { ListUserUseCase }
