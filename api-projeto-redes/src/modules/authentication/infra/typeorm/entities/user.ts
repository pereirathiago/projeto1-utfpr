import { Expose } from "class-transformer";
import { v4 as uuidV4 } from 'uuid'
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
class User {
  @PrimaryColumn()
  id: string

  @Column({ name: 'name', nullable: true })
  name: string

  @Column({ name: 'email', nullable: true })
  email: string

  @Column({ name: 'password', nullable: true })
  password: string

  @Column({ name: 'avatar', nullable: true })
  avatar: string

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date

  @Expose({ name: 'avatarUrl' })
  avatarUrl(): string {
    switch (process.env.disk) {
      case 'local':
        return `${process.env.APP_API_URL}/avatar/${this.avatar}`
      default:
        return null
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4()
    }
  }
}
export { User }