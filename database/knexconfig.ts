import { resolve } from 'path'
import env from '../.env.json'

const {
  DB_DIRNAME = '',
  DB_DATABASE = './dev.sqlite3',
  DB_CONNECTION = 'sqlite3'
} = env

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
