import { getRepository, Repository, getManager } from 'typeorm'
import { IUserDTO } from '@modules/security/dtos/i-user-dto'
import { IUserSecurityRepository } from 'modules/security/repositories/i-user-security-repository'
import { User } from '@modules/security/infra/typeorm/entities/user'
import { noContent, serverError, ok, notFound, HttpResponse } from 'shared/helpers'
import { AppError } from 'shared/errors/app-error'
import { AppDataSource } from 'shared/infra/typeorm/data-source'

class UserSecurityRepository implements IUserSecurityRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }


  // create
  async create ({
    name,
    email,
    password,
    avatar
  }: IUserDTO): Promise<HttpResponse> {
    const user = this.repository.create({
      name,
      email,
      password,
      avatar
    })

    const result = await this.repository.save(user)
      .then(userResult => {
        return ok(userResult)
      })
      .catch(error => {
        return serverError(error)
      })

    return result
  }


  // list
  async list (
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
  ): Promise<HttpResponse> {
    let columnName: string
    let columnDirection: 'ASC' | 'DESC'

    if ((typeof(order) === 'undefined') || (order === "")) {
      columnName = 'nome'
      columnDirection = 'ASC'
    } else {
      columnName = order.substring(0, 1) === '-' ? order.substring(1) : order
      columnDirection = order.substring(0, 1) === '-' ? 'DESC' : 'ASC'
    }

    const referenceArray = [
      "name",
      "email",
    ]
    const columnOrder = new Array<'ASC' | 'DESC'>(2).fill('ASC')

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let users = await this.repository.createQueryBuilder('use')
        .select([
          'use.id as "id"',
          'use.name as "name"',
          'use.email as "email"'
        ])
        .orWhere('use.name ilike :search', { search: `%${search}%` })
        .orWhere('use.email ilike :search', { search: `%${search}%` })
        .addOrderBy('use.name', columnOrder[0])
        .addOrderBy('use.email', columnOrder[1])
        .take(rowsPerPage)
        .skip(offset)
        .getRawMany()

      // below statements are to solve typeorm bug related to use of leftjoins, filters, .take and .skip together

      if (users.length > rowsPerPage) {
        users = users.slice(offset, offset + rowsPerPage)
      }

      return ok(users)
    } catch (err) {
      return serverError(err)
    }
  }


  // select
  async select (
      filter: string,
    ): Promise<HttpResponse> {
    try {
      let users = []

      users = await this.repository.createQueryBuilder('use')
        .select([
          'use.id as "value"',
          'use.name as "label"',
        ])
        .where('use.name ilike :filter', { filter: `${filter}%` })
        .addOrderBy('use.name')
        .getRawMany()

      return ok(users)
    } catch (err) {
      return serverError(err)
    }
  }


  // id select
  async idSelect (id: string): Promise<HttpResponse> {
    try {
      const user = await this.repository.createQueryBuilder('use')
        .select([
          'use.id as "value"',
          'use.name as "label"',
        ])
        .where('use.id = :id', { id: `${id}` })
        .getRawOne()

      return ok(user)
    } catch (err) {
      return serverError(err)
    }
  }


  // count
  async count (
    search: string,
    filter?: string
  ): Promise<HttpResponse> {
    try {
      const users = await this.repository.createQueryBuilder('use')
        .select([
          'use.id as "id"',
        ])
        .orWhere('use.name ilike :search', { search: `%${search}%` })
        .orWhere('use.email ilike :search', { search: `%${search}%` })
        .getRawMany()

      return ok({ count: users.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get (id: string): Promise<HttpResponse> {
    try {
      const user = await this.repository.findOne({ where: { id }})

      if (typeof user === 'undefined') {
        return noContent()
      }

      return ok(user)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update ({
    id,
    name,
    email,
    password,
    avatar
  }: IUserDTO): Promise<HttpResponse> {
    const user = await this.repository.findOne({where: {id}})

    if (!user) {
      return notFound()
    }

    const newuser = this.repository.create({
      id,
      name,
      email,
      password,
      avatar
    })

    try {
      await this.repository.save(newuser)

      return ok(newuser)
    } catch (err) {
      return serverError(err)
    }
  }

  // delete
  async delete (id: string): Promise<HttpResponse> {
    try {
      await this.repository.delete(id)

      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }


  // multi delete
  async multiDelete (ids: string[]): Promise<HttpResponse> {
    try {
      await this.repository.delete(ids)

      return noContent()
    } catch (err) {
      if(err.message.slice(0, 10) === 'null value') {
        throw new AppError('not null constraint', 404)
      }

      return serverError(err)
    }
  }
}

export { UserSecurityRepository }
