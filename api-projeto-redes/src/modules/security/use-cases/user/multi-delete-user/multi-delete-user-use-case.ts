import { inject, injectable } from 'tsyringe'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { HttpResponse } from 'shared/helpers'

@injectable()
class MultiDeleteUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute(ids: string[]): Promise<HttpResponse> {
    const user = await this.userSecurityRepository.multiDelete(ids)

    return user
  }
}

export { MultiDeleteUserUseCase }
