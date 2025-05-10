import { inject, injectable } from 'tsyringe'
import { hash } from 'bcrypt'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { HttpResponse } from 'shared/helpers'

interface IRequest {
  id: string
  name: string
  email: string
  password: string
  avatar: string
}

@injectable()
class UpdateUserUseCase {
  constructor(@inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository
  ) {}

  async execute({
    id,
    name,
    email,
    password,
    avatar,
  }: IRequest): Promise<HttpResponse> {
    const passwordBtoa = btoa(password)
    const passwordHash = await hash(passwordBtoa, 8)

    const user = await this.userSecurityRepository.update({
      id,
      name,
      email,
      password: passwordHash,
      avatar,
    })

    return user
  }
}

export { UpdateUserUseCase }
