import { User } from "@modules/authentication/infra/typeorm/entities/user"
import { Comodo } from "../infra/typeorm/entities/comodo"

interface IMedicaoDTO {
  id?: string
  userId?: string
  user?: User
  comodoId?: string
  comodo?: Comodo
  dataHora?: Date
  nivelSinal2_4ghz?: number
  nivelSinal5ghz?: number
  velocidade2_4ghz?: number
  velocidade5ghz?: number
  interferencia?: number
  createdAt?: Date
  updatedAt?: Date
}

export { IMedicaoDTO }

