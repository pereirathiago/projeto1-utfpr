import { compare } from 'bcrypt'
import { sign, SignOptions } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '@modules/authentication/repositories/i-user-repository'
import { AppError } from 'shared/errors/app-error'
import { IUserTokenRepository } from '@modules/authentication/repositories/i-user-token-repository'
import auth from 'config/auth'
import { IDateProvider } from 'shared/container/providers/date-provider/i-date-provider'
import { IStorageProvider } from 'shared/container/providers/storage-provider/i-storage-provider'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: {
    name: string
    email: string
    avatar: string | null
  }
  token: string
  refreshToken: string
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email)
    const {
      expires_in_token,
      secret_refreshToken,
      secret_token,
      expires_in_refreshToken,
      expires_refreshToken_days,
    } = auth

    if (!user) {
      throw new AppError('Email or password incorrect!')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!')
    }

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    } as SignOptions)

    const refreshToken = sign({ email }, secret_refreshToken, {
      subject: user.id,
      expiresIn: expires_in_refreshToken,
    } as SignOptions)

    const refreshToken_expiresDate = this.dateProvider.addDays(expires_refreshToken_days)

    await this.userTokenRepository.create({
      userId: user.id,
      refreshToken,
      expiresDate: refreshToken_expiresDate,
    })

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar ? `${this.storageProvider.url}/avatar/${user.avatar}` : null,
      },
      refreshToken,
    }

    return tokenReturn
  }
}

export { AuthenticateUserUseCase }
