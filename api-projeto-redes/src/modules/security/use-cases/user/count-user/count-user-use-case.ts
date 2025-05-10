import { inject, injectable } from 'tsyringe'
import { User } from '@modules/security/infra/typeorm/entities/user'
import { IUserRepository } from '@modules/security/repositories/i-user-repository'
import { HttpResponse } from 'shared/helpers'

interface IRequest {
  search: string,
}

@injectable()
class CountUserUseCase {
  constructor(@inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute({
    search
  }: IRequest): Promise<HttpResponse> {
    const usersCount = await this.userRepository.count(search)

    return usersCount
  }
}

export { CountUserUseCase }
