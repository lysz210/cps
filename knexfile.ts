require('dotenv').config()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
})
// injext .env

const { resolve } = require('path')

// Update with your config settings.
const { env } = process

const DB_DIRNAME = env.DB_DIRNAME || ''
const DB_DATABASE = env.DB_DATABASE || './dev.sqlite3'
module.exports = {
  client: env.DB_CONNECTION || 'sqlite3',
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
