import { inject, injectable } from 'tsyringe'
import { hash } from 'bcrypt'
import { User } from '@modules/security/infra/typeorm/entities/user'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { IUserRepository } from '@modules/authentication/repositories/i-user-repository'
import { HttpResponse, conflictError } from 'shared/helpers'

interface IRequest {
  userGroupId?: string
  name?: string
  email?: string
  password?: string
  avatar?: string
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UserSecurityRepository')
    private userSecurityRepository: IUserSecurityRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute({
    name,
    email,
    password,
    avatar,
  }: IRequest): Promise<HttpResponse> {
    const passwordBtoa = btoa(password)
    const passwordHash = await hash(passwordBtoa, 8)

    if (email) {
      const userByEmail = await this.userRepository.findByEmail(email)
      if (userByEmail) return conflictError('E-Mail')
    }

    const result = await this.userSecurityRepository.create({
        name,
        email,
        password: passwordHash,
        avatar
      })
      .then(userResult => {
        return userResult
      })
      .catch(error => {
        return error
      })

    return result
  }
}

export { CreateUserUseCase }
