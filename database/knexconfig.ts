import { resolve } from 'path'
import { get } from 'lodash'
import env from '../.env.json'

// FIXME: Bisogna utilizzare un dbms piu' serio.
// creare parecchi problemi specialmente con accessi concorrenti
const dbDir = get(env, 'DB_DIRNAME', 'database')

export default {
  client: get(env, 'DB_CONNECTION', 'pg'),
  connection: {
    host: get(env, 'DB_HOST', '127.0.0.1'),
    user: get(env, 'DB_USER', 'homestead'),
    password: get(env, 'DB_PASSWORD', 'secret'),
    database: get(env, 'DB_DATABASE', 'homestead')
  },
  migrations: {
    directory: resolve('.', dbDir, 'migrations')
  },
  seeds: {
    directory: resolve('.', dbDir, 'seeds')
  }
}
