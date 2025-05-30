import { getRepository, Repository } from "typeorm";
import { User } from "../entities/user";
import { IUserRepository } from "@modules/authentication/repositories/i-user-repository";
import { IUserDTO } from "@modules/authentication/dtos/i-user-dto";
import { AppDataSource } from "shared/infra/typeorm/data-source";

class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  async create({
    id,
    name,
    email,
    password,
    avatar
  }: IUserDTO): Promise<void> {
    const user = this.repository.create({
      id,
      name,
      email,
      password,
      avatar
    })

    await this.repository.save(user)
  }

  async findByEmail(email: string): Promise<User> {
    const newEmail = email.toLowerCase()
    const user = await this.repository.findOne({ where: { email: newEmail } })

    return user
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } })

    return user
  }

  async update(id: string, {
    name,
    email,
    password,
    avatar
  }: IUserDTO): Promise<void> {
    const user = await this.repository.findOne({ where: { id } })

    if (!user) {
      throw new Error("User not found")
    }

    user.name = name || user.name
    user.email = email ? email.toLowerCase() : user.email
    user.password = password || user.password
    user.avatar = avatar || user.avatar

    await this.repository.save(user)
  }
}

export { UserRepository }