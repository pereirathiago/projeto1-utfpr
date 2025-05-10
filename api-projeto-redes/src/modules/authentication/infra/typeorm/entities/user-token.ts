import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { v4 as uuidV4 } from 'uuid'

@Entity('user_tokens')
class UserToken {
  @PrimaryColumn()
  id: string

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId?: string

  @Column({ name: 'expires_date', nullable: true })
  expiresDate: Date

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}

export { UserToken }