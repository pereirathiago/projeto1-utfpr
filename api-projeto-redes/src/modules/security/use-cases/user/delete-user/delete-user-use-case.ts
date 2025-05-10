import { inject, injectable } from 'tsyringe'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { HttpResponse } from 'shared/helpers'

@injectable()
class DeleteUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute(id: string): Promise<HttpResponse> {
    const user = await this.userSecurityRepository.delete(id)

    return user
  }
}

export { DeleteUserUseCase }
