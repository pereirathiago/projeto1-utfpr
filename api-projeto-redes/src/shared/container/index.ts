import 'reflect-metadata';
import { container } from 'tsyringe'

import 'shared/container/providers'

import { IUserRepository } from '@modules/authentication/repositories/i-user-repository'
import { UserRepository } from '@modules/authentication/infra/typeorm/repositories/user-repository'
import { IUserSecurityRepository } from '@modules/security/repositories/i-user-security-repository'
import { UserSecurityRepository } from '@modules/security/infra/typeorm/repositories/user-security-repository'
import { IUserTokenRepository } from '@modules/authentication/repositories/i-user-token-repository'
import { UserTokenRepository } from '@modules/authentication/infra/typeorm/repositories/user-token-repository'
import { IComodoRepository } from '@modules/comum/repositories/i-comodos-repository';
import { ComodoRepository } from '@modules/comum/infra/typeorm/repositories/comodos-repository';
import { IMedicoesRepository } from '@modules/comum/repositories/i-medicoes-repository';
import { MedicoesRepository } from '@modules/comum/infra/typeorm/repositories/medicoes-repository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<IUserSecurityRepository>('UserSecurityRepository', UserSecurityRepository)
container.registerSingleton<IUserTokenRepository>('UserTokenRepository', UserTokenRepository)
container.registerSingleton<IComodoRepository>('ComodosRepository', ComodoRepository)
container.registerSingleton<IMedicoesRepository>('MedicoesRepository', MedicoesRepository)