import { AppError } from 'shared/errors/app-error'
import { HttpResponse, noContent, notFound, ok, serverError } from 'shared/helpers'
import { Brackets, Repository } from 'typeorm'
import { AppDataSource } from 'shared/infra/typeorm/data-source'
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository'
import { Medicao } from '../entities/medicao'
import { IMedicaoDTO } from '@modules/comum/dtos/i-medicao-dto'

class MedicoesRepository implements IMedicoesRepository {
  private repository: Repository<Medicao>

  constructor() {
    this.repository = AppDataSource.getRepository(Medicao)
  }

  // create
  async create({
    comodoId,
    userId,
    interferencia,
    nivelSinal2_4ghz,
    nivelSinal5ghz,
    velocidade2_4ghz,
    velocidade5ghz,
    dataHora,
  }: IMedicaoDTO): Promise<HttpResponse> {
    const comodo = this.repository.create({
      interferencia,
      nivelSinal2_4ghz,
      nivelSinal5ghz,
      velocidade2_4ghz,
      velocidade5ghz,
      dataHora,
      comodo: { id: comodoId },
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

  async bulkCreate(data: IMedicaoDTO[]): Promise<HttpResponse> {
    const medicoes = data.map(item => {
      return this.repository.create({
        comodo: { id: item.comodoId },
        user: { id: item.userId },
        interferencia: item.interferencia,
        nivelSinal2_4ghz: item.nivelSinal2_4ghz,
        nivelSinal5ghz: item.nivelSinal5ghz,
        velocidade2_4ghz: item.velocidade2_4ghz,
        velocidade5ghz: item.velocidade5ghz,
        dataHora: item.dataHora,
      })
    })

    const result = await this.repository.save(medicoes)
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
    const allowedColumns = {
      id: 'med.id',
      comodo: 'com.nome',
      dataHora: 'med.data_hora',
      sinal2_4: 'med.nivel_sinal_2_4ghz',
      sinal5: 'med.nivel_sinal_5ghz',
      velocidade2_4: 'med.velocidade_2_4ghz',
      velocidade5: 'med.velocidade_5ghz',
      interferencia: 'med.interferencia'
    }

    let columnName = 'com.nome'
    let columnDirection: 'ASC' | 'DESC' = 'ASC'

    if (order && order !== '') {
      const isDesc = order.startsWith('-')
      const requestedColumn = isDesc ? order.substring(1) : order

      if (requestedColumn in allowedColumns) {
        columnName = allowedColumns[requestedColumn]
        columnDirection = isDesc ? 'DESC' : 'ASC'
      }
    }

    const offset = rowsPerPage * page

    try {
      let query = this.repository.createQueryBuilder('med')
        .select([
          'med.id as "id"',
          'com.id as "comodoId"',
          'com.nome as "nomeComodo"',
          'med.data_hora as "dataHora"',
          'med.nivel_sinal_2_4ghz as "nivelSinal2_4ghz"',
          'med.nivel_sinal_5ghz as "nivelSinal5ghz"',
          'med.velocidade_2_4ghz as "velocidade2_4ghz"',
          'med.velocidade_5ghz as "velocidade5ghz"',
          'med.interferencia as "interferencia"',
        ])

      query.leftJoin('med.comodo', 'com')
      query.leftJoin('med.user', 'use')

      if (filter) {
        query = query
          .where({ user: { id: filter } })
      }

      const comodos = await query
        .andWhere(new Brackets(query => {
          query.andWhere('CAST(com.nome AS VARCHAR) ilike :search', { search: `%${search}%` })
        }))
        .addOrderBy(columnName, columnDirection)
        .offset(offset)
        .limit(rowsPerPage)
        .take(rowsPerPage)
        .getRawMany()

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
      let query = this.repository.createQueryBuilder('med')
        .select([
          'med.id as "id"',
        ])

      query.leftJoin('med.comodo', 'com')
      query.leftJoin('med.user', 'use')

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
      const medicao = await this.repository.createQueryBuilder('med')
        .select([
          'med.id as "id"',
          'com.id as "comodoId"',
          'com.nome as "nomeComodo"',
          'med.data_hora as "dataHora"',
          'med.nivel_sinal_2_4ghz as "nivelSinal2_4ghz"',
          'med.nivel_sinal_5ghz as "nivelSinal5ghz"',
          'med.velocidade_2_4ghz as "velocidade2_4ghz"',
          'med.velocidade_5ghz as "velocidade5ghz"',
          'med.interferencia as "interferencia"',
        ])
        .leftJoin('med.comodo', 'com')
        .where('med.user.id = :userId', { userId })
        .andWhere('med.id = :id', { id })
        .getRawOne()

      if (typeof medicao === 'undefined') {
        return noContent()
      }

      return ok(medicao)
    } catch (err) {
      return serverError(err)
    }
  }

  // update
  async update({
    id,
    comodoId,
    userId,
    interferencia,
    nivelSinal2_4ghz,
    nivelSinal5ghz,
    velocidade2_4ghz,
    velocidade5ghz,
    dataHora,
  }: IMedicaoDTO): Promise<HttpResponse> {
    const medicao = await this.repository.find({ where: { id, user: { id: userId } } })

    if (!medicao) {
      return notFound()
    }

    const newMedicao = this.repository.create({
      id,
      comodo: { id: comodoId },
      user: { id: userId },
      interferencia,
      nivelSinal2_4ghz,
      nivelSinal5ghz,
      velocidade2_4ghz,
      velocidade5ghz,
      dataHora,
    })

    try {
      await this.repository.save(newMedicao)

      return ok(newMedicao)
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

export { MedicoesRepository }

