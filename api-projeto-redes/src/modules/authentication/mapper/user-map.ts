import { instanceToPlain } from 'class-transformer'
import { IUserResponseDTO } from '../dtos/i-user-response-dto'
import { User } from '../infra/typeorm/entities/user'

class UserMap {
  static toDTO({
    id,
    email,
    name,
    avatar,
    avatarUrl,
  }: User): IUserResponseDTO {
    const user = instanceToPlain({
      id,
      email,
      name,
      avatar,
      avatarUrl
    }) as IUserResponseDTO
    
    return user
  }
}

export { UserMap }
