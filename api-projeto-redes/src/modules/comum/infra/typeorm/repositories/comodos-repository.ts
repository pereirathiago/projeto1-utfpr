import { IComodoDTO } from '@modules/comum/dtos/i-comodo-dto'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository'
import { AppError } from 'shared/errors/app-error'
import { HttpResponse, noContent, notFound, ok, serverError } from 'shared/helpers'
import { Brackets, Repository } from 'typeorm'
import { Comodo } from '../entities/comodo'
import { AppDataSource } from 'shared/infra/typeorm/data-source'

class ComodoRepository implements IComodoRepository {
  private repository: Repository<Comodo>

  constructor() {
    this.repository = AppDataSource.getRepository(Comodo)
  }

  // create
  async create({
    nome,
    userId,
  }: IComodoDTO): Promise<HttpResponse> {
    const comodo = this.repository.create({
      nome,
      user: { id: userId },
    })

    const result = await this.repository.save(comodo)
      .then(comodoResult => {
        return ok(comodoResult)
      })
      .catch(error => {
        return serverError(error)
      })

    return result
  }

  // list
  async list(
    search: string,
    page: number,
    rowsPerPage: number,
    order: string,
    filter: string
  ): Promise<HttpResponse> {
    let columnName: string
    let columnDirection: 'ASC' | 'DESC'

    if ((typeof (order) === 'undefined') || (order === "")) {
      columnName = 'nome'
      columnDirection = 'ASC'
    } else {
      columnName = order.substring(0, 1) === '-' ? order.substring(1) : order
      columnDirection = order.substring(0, 1) === '-' ? 'DESC' : 'ASC'
    }

    const referenceArray = [
      "nome",
    ]
    const columnOrder = new Array<'ASC' | 'DESC'>(2).fill('ASC')

    const index = referenceArray.indexOf(columnName)

    columnOrder[index] = columnDirection

    const offset = rowsPerPage * page

    try {
      let query = this.repository.createQueryBuilder('com')
        .select([
          'com.id as "id"',
          'com.nome as "nome"'
        ])

      if (filter) {
        query = query
          .where({ user: { id: filter } })
      }

      const comodos = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(com.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .addOrderBy('com.nome', columnOrder[0])
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

      return ok(comodos)
    } catch (err) {
      return serverError(err)
    }
  }

  // select
  async select(filter: string, userId: string): Promise<HttpResponse> {
    try {
      const comodos = await this.repository.createQueryBuilder('com')
        .select([
          'com.id as "value"',
          'com.nome as "label"',
        ])
        .where('com.user.id = :userId', { userId })
        .andWhere('com.nome ilike :filter', { filter: `${filter}%` })
        .addOrderBy('com.nome')
        .getRawMany()

      return ok(comodos)
    } catch (err) {
      return serverError(err)
    }
  }

  // id select
  async idSelect(id: string, userId: string): Promise<HttpResponse> {
    try {
      const comodos = await this.repository.createQueryBuilder('com')
        .select([
          'com.id as "value"',
          'com.nome as "label"',
        ])
        .where('com.user.id = :userId', { userId })
        .andWhere('com.id = :id', { id: `${id}` })
        .getRawOne()

      return ok(comodos)
    } catch (err) {
      return serverError(err)
    }
  }

  // count
  async count(
    search: string,
    filter: string
  ): Promise<HttpResponse> {
    try {
      let query = this.repository.createQueryBuilder('com')
        .select([
          'com.id as "id"',
        ])

      if (filter) {
        query = query
          .andWhere({ user: { id: filter } })
      }

      const comodos = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(com.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .getRawMany()

      return ok({ count: comodos.length })
    } catch (err) {
      return serverError(err)
    }
  }


  // get
  async get(id: string, userId: string): Promise<HttpResponse> {
    try {
      const comodo = await this.repository.createQueryBuilder('com')
        .select([
          'com.id as "id"',
          'com.nome as "nome"',
        ])
        .where('com.user.id = :userId', { userId })
        .andWhere('com.id = :id', { id })
        .getRawOne()

      if (typeof comodo === 'undefined') {
        return noContent()
      }

      return ok(comodo)
    } catch (err) {
      return serverError(err)
    }
  }

  // find by name
  async findByName(name: string, userId: string): Promise<HttpResponse> {
    try {
      const comodo = await this.repository.createQueryBuilder('com')
        .select([
          'com.id as "id"',
          'com.nome as "nome"',
        ])
        .where('com.user.id = :userId', { userId })
        .andWhere('UPPER(com.nome) = UPPER(:name)', { name })
        .getRawOne()

      if (!comodo) {
        return noContent()
      }

      return ok(comodo)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({
    id,
    nome,
    userId,
  }: IComodoDTO): Promise<HttpResponse> {
    const comodo = await this.repository.find({ where: { id, user: { id: userId } } })

    if (!comodo) {
      return notFound()
    }

    const newComodo = this.repository.create({
      id,
      nome,
      user: { id: userId },
    })

    try {
      await this.repository.save(newComodo)

      return ok(newComodo)
    } catch (err) {
      return serverError(err)
    }
  }


  // delete
  async delete(id: string): Promise<HttpResponse> {
    try {
      await this.repository.delete(id)

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === 'null value') {
        throw new AppError('not null constraint', 404)
      }

      return serverError(err)
    }
  }


  // multi delete
  async multiDelete(ids: string[]): Promise<HttpResponse> {
    try {
      await this.repository.delete(ids)

      return noContent()
    } catch (err) {
      if (err.message.slice(0, 10) === 'null value') {
        throw new AppError('not null constraint', 404)
      }

      return serverError(err)
    }
  }
}

export { ComodoRepository }

