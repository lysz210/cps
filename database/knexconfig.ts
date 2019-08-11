import { config } from 'dotenv'
import { resolve } from 'path'

config()

const { env: {
  DB_DIRNAME = '',
  DB_DATABASE = './dev.sqlite3',
  DB_CONNECTION = 'sqlite3'
} } = process

export default {
  client: DB_CONNECTION,
  useNullAsDefault: true,
  connection: {
    filename: resolve('.', DB_DIRNAME, DB_DATABASE)
  },
  migrations: {
    directory: resolve('.', DB_DIRNAME, 'migrations'),
  },
  seeds: {
    directory: resolve('.', DB_DIRNAME, 'seeds')
  }
}
