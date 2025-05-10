import { inject, injectable } from 'tsyringe'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { HttpResponse } from 'shared/helpers'

@injectable()
class GetUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const user = await this.userSecurityRepository.get(id)

    const newUser = {
      statusCode: user.statusCode,
      data: {
        id: user.data.id,
        name: user.data.name,
        email: user.data.email,
        password: user.data.password,
        avatar: user.data.avatar,
      }
    }

    return newUser
  }
}

export { GetUserUseCase }
