import { IUserTokenRepository } from "@modules/authentication/repositories/i-user-token-repository";
import { getRepository, Repository } from "typeorm";
import { UserToken } from "../entities/user-token";
import { IUserTokenDTO } from "@modules/authentication/dtos/i-user-token-dto";
import { AppDataSource } from "shared/infra/typeorm/data-source";

class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>

  constructor() {
    this.repository = AppDataSource.getRepository(UserToken)
  }

  async create({
    expiresDate,
    refreshToken,
    userId,
  }: IUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      expiresDate,
      refreshToken,
      userId,
    })

    await this.repository.save(userToken)

    return userToken
  }

  async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserToken> {
    const userToken = await this.repository.findOne({
      where: {
        userId,
        refreshToken,
      }
    })
    return userToken
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken> {
    try {
      const userToken = await this.repository.createQueryBuilder('tok')
        .select([
          'tok.id as "id"',
          'tok.refresh_token as "refreshToken"',
          'tok.expires_date as "expiresDate"',
          'use.id as "userId"',
        ])
        .leftJoin('tok.userId', 'use')
        .where('tok.refresh_token = :refreshToken', { refreshToken: refreshToken })
        .getRawOne()

      return userToken
    } catch (err) {
      console.log(err)
    }
  }
}

export { UserTokenRepository }