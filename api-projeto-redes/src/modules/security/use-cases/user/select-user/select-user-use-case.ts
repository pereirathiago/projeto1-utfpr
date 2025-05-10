import { inject, injectable } from 'tsyringe'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'

interface ResponseProps {
  items?: object[]
  hasNext?: boolean
  value?: string
  label?: string
}

interface RequestProps {
  filter: string
}

@injectable()
class SelectUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute({ 
    filter,
   }: RequestProps): Promise<ResponseProps> {
    const users = await this.userSecurityRepository.select(
      filter,
    )

    const newUsers = {
      items: users.data,
      hasNext: false
    }

    return newUsers
  }
}

export { SelectUserUseCase }
