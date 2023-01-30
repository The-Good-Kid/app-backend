import "reflect-metadata"
import { DataSource } from "typeorm"
import 'dotenv/config'
import { join } from "path"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "******",
  port: 5432,
  username: "*******",
  password: "**************",
  database: "*********",
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  subscribers: [],
})