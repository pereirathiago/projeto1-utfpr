import { sign, SignOptions } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@modules/authentication/repositories/i-user-repository';
import { IUserTokenRepository } from '@modules/authentication/repositories/i-user-token-repository';
import { IDateProvider } from 'shared/container/providers/date-provider/i-date-provider';
import { IStorageProvider } from 'shared/container/providers/storage-provider/i-storage-provider';
import { IUserDTO } from '@modules/authentication/dtos/i-user-dto';
import auth from 'config/auth';
import { AppError } from 'shared/errors/app-error';
import { hash } from 'bcrypt'

interface IUpdateResponse {
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  token: string;
  refreshToken: string;
}

@injectable()
class UpdateUserUseCase {
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

  async execute({ id, name, email, password }: IUserDTO): Promise<IUpdateResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);

    if (email && email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(email);
      if (emailExists && emailExists.id !== id) {
        throw new AppError('E-mail already in use', 400);
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const passwordBtoa = btoa(password)
      const passwordHash = await hash(passwordBtoa, 8)
      user.password = passwordHash
    }

    await this.userRepository.update(id, user)

    const {
      expires_in_token,
      secret_refreshToken,
      secret_token,
      expires_in_refreshToken,
      expires_refreshToken_days,
    } = auth;

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    } as SignOptions);

    const refreshToken = sign({ email: user.email }, secret_refreshToken, {
      subject: user.id,
      expiresIn: expires_in_refreshToken,
    } as SignOptions);

    const refreshTokenExpiresDate = this.dateProvider.addDays(expires_refreshToken_days);

    await this.userTokenRepository.create({
      userId: user.id,
      refreshToken,
      expiresDate: refreshTokenExpiresDate,
    });

    return {
      token,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar ? `${this.storageProvider.url}/avatar/${user.avatar}` : null,
      },
    };
  }
}

export { UpdateUserUseCase };