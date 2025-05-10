import { inject, injectable } from "tsyringe"
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { HttpResponse } from 'shared/helpers/http'

@injectable()
class IdSelectUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute({ id }): Promise<HttpResponse> {
    const user = await this.userSecurityRepository.idSelect(id)

    return user
  }
}

export { IdSelectUserUseCase }
