import { User } from '@modules/authentication/infra/typeorm/entities/user'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'
import { Comodo } from './comodo'


@Entity('medicoes')
class Medicao {
  @PrimaryColumn()
  id?: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Comodo)
  @JoinColumn({ name: 'comodo_id' })
  comodo?: Comodo;

  @Column({ name: 'data_hora', nullable: true })
  dataHora?: Date

  @Column({ name: 'nivel_sinal_2_4ghz', nullable: true })
  nivelSinal2_4ghz?: number

  @Column({ name: 'nivel_sinal_5ghz', nullable: true })
  nivelSinal5ghz?: number

  @Column({ name: 'velocidade_2_4ghz', nullable: true })
  velocidade2_4ghz?: number

  @Column({ name: 'velocidade_5ghz', nullable: true })
  velocidade5ghz?: number

  @Column({ name: 'interferencia', nullable: true })
  interferencia?: number

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { Medicao }

