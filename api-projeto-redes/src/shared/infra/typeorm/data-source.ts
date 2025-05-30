import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "projeto1_utfpr_user",
  password: "123456",
  database: process.env.NODE_ENV === 'test' ? 'security_test' : 'projeto1_utfpr_db',
  entities: [
    "src/modules/**/entities/*.ts"
  ],
  migrations: [
    "src/shared/infra/typeorm/migrations/*.ts"
  ],
  synchronize: false,
  logging: true,
});
