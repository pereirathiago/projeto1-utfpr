import { User } from "@modules/authentication/infra/typeorm/entities/user"

interface IComodoDTO {
  id?: string
  userId?: string
  user?: User
  nome?: string
  createdAt?: Date
  updatedAt?: Date
}

export { IComodoDTO }

